import type { Octokit } from '@octokit/rest';
import { createLogger } from '@skillpulse/core';
import type { IssueCommentPayload } from '../types.js';

const logger = createLogger('bot:on-comment');

export async function onComment(octokit: Octokit, payload: IssueCommentPayload): Promise<void> {
  const { issue, comment, repository } = payload;
  const owner = repository.owner.login;
  const repo = repository.name;
  const issueNumber = issue.number;

  logger.info({ msg: 'Comment received', number: issueNumber, body: comment.body.slice(0, 100) });

  // Maintainer /refresh command
  if (
    comment.body.trim() === '/refresh' &&
    issue.labels.some((l) => l.name === 'submission:queued')
  ) {
    await octokit.issues.createComment({
      owner,
      repo,
      issue_number: issueNumber,
      body: 'Refresh requested. The next automated cycle will re-validate this submission.',
    });
  }
}
