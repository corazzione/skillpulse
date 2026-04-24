import { readFile } from 'node:fs/promises';
import { Octokit } from '@octokit/rest';
import { createLogger } from '@skillpulse/core';
import { onComment } from './handlers/on-comment.js';
import { onIssueOpened } from './handlers/on-issue-opened.js';
import type { GitHubPayload } from './types.js';

const logger = createLogger('bot');

async function main() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN is required');

  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath) throw new Error('GITHUB_EVENT_PATH is required');

  const octokit = new Octokit({ auth: token });
  const rawPayload = await readFile(eventPath, 'utf-8');
  const payload = JSON.parse(rawPayload) as GitHubPayload;

  logger.info({ msg: 'Bot dispatching event', action: payload.action });

  if ('issue' in payload && payload.action === 'opened' && !('comment' in payload)) {
    await onIssueOpened(octokit, payload as Parameters<typeof onIssueOpened>[1]);
  } else if ('comment' in payload && payload.action === 'created') {
    await onComment(octokit, payload as Parameters<typeof onComment>[1]);
  } else {
    logger.info({ msg: 'No handler for this event', action: payload.action });
  }
}

main().catch((err) => {
  console.error(JSON.stringify({ level: 'error', msg: 'Bot failed', error: String(err) }));
  process.exit(1);
});
