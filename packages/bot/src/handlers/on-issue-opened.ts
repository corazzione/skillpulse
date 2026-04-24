import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Octokit } from '@octokit/rest';
import { createLogger } from '@skillpulse/core';
import type { IssueOpenedPayload } from '../types.js';

const logger = createLogger('bot:on-issue-opened');

const PENDING_PATH = join(process.cwd(), 'data', 'pending-submissions.json');
const FLAGGED_PATH = join(process.cwd(), 'data', 'flagged-stale.json');

async function readJsonArray(path: string): Promise<string[]> {
  try {
    return JSON.parse(await readFile(path, 'utf-8')) as string[];
  } catch {
    return [];
  }
}

async function appendToJsonArray(path: string, value: string): Promise<void> {
  await mkdir(join(process.cwd(), 'data'), { recursive: true });
  const arr = await readJsonArray(path);
  if (!arr.includes(value)) {
    arr.push(value);
    await writeFile(path, JSON.stringify(arr, null, 2));
  }
}

async function appendCompatSignal(path: string, url: string, agent: string): Promise<void> {
  await mkdir(join(process.cwd(), 'data'), { recursive: true });
  let signals: Record<string, string[]> = {};
  try {
    signals = JSON.parse(await readFile(path, 'utf-8')) as Record<string, string[]>;
  } catch {
    // file doesn't exist yet
  }
  const existing = signals[url] ?? [];
  if (!existing.includes(agent)) {
    signals[url] = [...existing, agent];
    await writeFile(path, JSON.stringify(signals, null, 2));
  }
}

function extractUrlFromBody(body: string): string | null {
  const match = body.match(/https?:\/\/[^\s\)\"\']+/);
  return match?.[0] ?? null;
}

function isSubmitSkillIssue(issue: IssueOpenedPayload['issue']): boolean {
  return (
    issue.labels.some((l) => l.name === 'submission:queued') ||
    issue.title.toLowerCase().startsWith('[skill]')
  );
}

function isReportStaleIssue(issue: IssueOpenedPayload['issue']): boolean {
  return (
    issue.labels.some((l) => l.name === 'stale:reported') ||
    issue.title.toLowerCase().startsWith('[stale]')
  );
}

async function urlExists(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 10_000);
    const res = await fetch(url, { method: 'HEAD', signal: controller.signal });
    return res.status < 400;
  } catch {
    return false;
  }
}

export async function onIssueOpened(octokit: Octokit, payload: IssueOpenedPayload): Promise<void> {
  const { issue, repository } = payload;
  const owner = repository.owner.login;
  const repo = repository.name;
  const issueNumber = issue.number;
  const body = issue.body ?? '';

  logger.info({ msg: 'Issue opened', number: issueNumber, title: issue.title });

  // Handle telemetry issues from @skillpulse/cli
  if (issue.labels.some((l) => l.name === 'telemetry:anonymous')) {
    const jsonMatch = body.match(/```json\n([\s\S]+?)\n```/);
    if (jsonMatch?.[1]) {
      try {
        const telemetry = JSON.parse(jsonMatch[1]) as {
          userId: string;
          skills: Array<{
            name: string;
            kind: string;
            url?: string;
            description?: string;
            detectedBy?: string;
          }>;
        };
        // Add any new URLs to pending-submissions, annotated with compat agent
        for (const skill of telemetry.skills) {
          if (skill.url?.startsWith('http')) {
            await appendToJsonArray(PENDING_PATH, skill.url);
            // If we have detectedBy info, store it for compat signal enrichment
            if (skill.detectedBy) {
              const compatPath = join(process.cwd(), 'data', 'compat-signals.json');
              await appendCompatSignal(compatPath, skill.url, skill.detectedBy);
            }
          }
        }
        await octokit.issues.createComment({
          owner,
          repo,
          issue_number: issueNumber,
          body: `🙏 Thank you for contributing! ${telemetry.skills.length} items queued for classification. This issue will be closed automatically.`,
        });
        await octokit.issues.update({ owner, repo, issue_number: issueNumber, state: 'closed' });
        return;
      } catch (err) {
        logger.warn({ msg: 'Failed to parse telemetry', error: String(err) });
      }
    }
  }

  if (isSubmitSkillIssue(issue)) {
    const url = extractUrlFromBody(body);

    if (!url) {
      await octokit.issues.createComment({
        owner,
        repo,
        issue_number: issueNumber,
        body: `Thanks for submitting! I couldn't find a URL in your issue. Please edit it to include the full URL (GitHub, npm, or PyPI link).`,
      });
      return;
    }

    // Check if URL resolves
    const exists = await urlExists(url);
    if (!exists) {
      await octokit.issues.createComment({
        owner,
        repo,
        issue_number: issueNumber,
        body: `I couldn't reach \`${url}\`. Please double-check the URL and update the issue.`,
      });
      return;
    }

    // Check if already in latest snapshot
    const snapshotPath = join(process.cwd(), 'data', 'snapshots', 'latest.json');
    if (existsSync(snapshotPath)) {
      try {
        const snapshot = JSON.parse(await readFile(snapshotPath, 'utf-8')) as {
          entries: Array<{ sourceUrl: string; name: string }>;
        };
        const existing = snapshot.entries.find(
          (e) => e.sourceUrl.toLowerCase() === url.toLowerCase(),
        );
        if (existing) {
          await octokit.issues.createComment({
            owner,
            repo,
            issue_number: issueNumber,
            body: `Already tracked! **${existing.name}** is in the registry. Thanks for checking!`,
          });
          await octokit.issues.update({ owner, repo, issue_number: issueNumber, state: 'closed' });
          return;
        }
      } catch {
        /* snapshot may not exist yet */
      }
    }

    // Queue the submission
    await appendToJsonArray(PENDING_PATH, url);
    await octokit.issues.createComment({
      owner,
      repo,
      issue_number: issueNumber,
      body: `Queued! **${url}** has been added to the next refresh cycle (runs every 6h). This issue will auto-close once the entry appears in the dataset. Thank you!`,
    });

    logger.info({ msg: 'Submission queued', url });
  } else if (isReportStaleIssue(issue)) {
    const url = extractUrlFromBody(body);

    if (!url) {
      await octokit.issues.createComment({
        owner,
        repo,
        issue_number: issueNumber,
        body: 'Please include the URL of the stale entry in your issue.',
      });
      return;
    }

    const exists = await urlExists(url);
    if (!exists) {
      await appendToJsonArray(FLAGGED_PATH, url);
      await octokit.issues.createComment({
        owner,
        repo,
        issue_number: issueNumber,
        body: `Confirmed - \`${url}\` returned a 404. It's been flagged for removal on the next refresh cycle. Thanks!`,
      });
      await octokit.issues.update({ owner, repo, issue_number: issueNumber, state: 'closed' });
    } else {
      await octokit.issues.createComment({
        owner,
        repo,
        issue_number: issueNumber,
        body: `\`${url}\` still resolves. Can you provide more details about why you think it's stale?`,
      });
    }
  } else {
    await octokit.issues.createComment({
      owner,
      repo,
      issue_number: issueNumber,
      body: `Thanks for opening an issue! Check out [CONTRIBUTING.md](https://github.com/${owner}/${repo}/blob/main/CONTRIBUTING.md) for how to get involved. A maintainer will review this soon.`,
    });
  }
}
