import { describe, expect, it, vi } from 'vitest';

vi.mock('@anthropic-ai/sdk', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      messages: {
        create: vi.fn().mockResolvedValue({
          content: [
            {
              type: 'tool_use',
              input: {
                description: 'A Claude Code skill for testing purposes with 25+ chars',
                kind: 'skill',
                category: 'developer-tooling',
                tags: ['testing', 'claude-code'],
                compat: ['claude-code'],
                confidence: 0.9,
              },
            },
          ],
          usage: { input_tokens: 100, output_tokens: 50 },
        }),
      },
    })),
  };
});

vi.mock('../ai-client.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../ai-client.js')>();
  return {
    ...actual,
    getClient: vi.fn().mockReturnValue({
      messages: {
        create: vi.fn().mockResolvedValue({
          content: [
            {
              type: 'tool_use',
              input: {
                description: 'A Claude Code skill for testing purposes with 25+ chars',
                kind: 'skill',
                category: 'developer-tooling',
                tags: ['testing', 'claude-code'],
                compat: ['claude-code'],
                confidence: 0.9,
              },
            },
          ],
          usage: { input_tokens: 100, output_tokens: 50 },
        }),
      },
    }),
    logCost: vi.fn().mockResolvedValue(undefined),
  };
});

import { classifyEntry } from '../classify.js';

const mockRaw = {
  source: 'github' as const,
  sourceId: 'user/test-skill',
  name: 'test-skill',
  rawDescription: 'A test skill for Claude Code',
  url: 'https://github.com/user/test-skill',
  author: 'user',
  updatedAt: new Date().toISOString(),
};

describe('classifyEntry', () => {
  it('returns a valid classification result', async () => {
    const result = await classifyEntry(mockRaw);
    expect(result).not.toBeNull();
    expect(result?.kind).toBe('skill');
    expect(result?.description.length).toBeGreaterThan(20);
    expect(result?.confidence).toBeGreaterThan(0);
  });
});
