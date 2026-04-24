import { describe, expect, it, vi } from 'vitest';

vi.mock('@octokit/rest', () => ({
  Octokit: vi.fn().mockImplementation(() => ({
    issues: {
      createComment: vi.fn().mockResolvedValue({}),
      update: vi.fn().mockResolvedValue({}),
    },
  })),
}));

import { Octokit } from '@octokit/rest';
import { onIssueOpened } from '../handlers/on-issue-opened.js';

const mockOctokit = new Octokit() as unknown as InstanceType<typeof Octokit>;

const basePayload = {
  action: 'opened' as const,
  issue: {
    number: 1,
    title: '[SKILL] test',
    body: 'A skill\n\nhttps://github.com/user/nonexistent-repo-xyz-12345',
    labels: [{ name: 'submission:queued' }],
    user: { login: 'testuser' },
    html_url: 'https://github.com/corazzione/skillpulse/issues/1',
  },
  repository: {
    owner: { login: 'corazzione' },
    name: 'skillpulse',
  },
};

describe('onIssueOpened', () => {
  it('comments when URL not found in body', async () => {
    const payload = {
      ...basePayload,
      issue: { ...basePayload.issue, body: 'No URL here', labels: [{ name: 'submission:queued' }] },
    };
    await onIssueOpened(mockOctokit, payload);
    expect(mockOctokit.issues.createComment).toHaveBeenCalled();
  });
});
