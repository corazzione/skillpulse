import type { SkillEntry } from '@skillpulse/core';
import { describe, expect, it } from 'vitest';
import { dedupeEntries } from '../dedupe.js';

const base: SkillEntry = {
  id: 'abc123',
  name: 'test-skill',
  description: 'A test skill',
  kind: 'skill',
  source: 'github',
  sourceUrl: 'https://github.com/user/test-skill',
  author: 'user',
  stars: 100,
  compat: ['claude-code'],
  category: 'developer-tooling',
  tags: ['test'],
  firstSeenAt: '2026-01-01T00:00:00Z',
  lastUpdatedAt: '2026-01-01T00:00:00Z',
  pulseScore: 50,
  trend: 'stable',
};

describe('dedupeEntries', () => {
  it('removes duplicate URLs', () => {
    const entries = [
      { ...base, id: 'abc', sourceUrl: 'https://github.com/user/test-skill' },
      { ...base, id: 'def', sourceUrl: 'https://github.com/user/test-skill/' },
    ];
    expect(dedupeEntries(entries)).toHaveLength(1);
  });

  it('keeps higher-star entry on URL duplicate', () => {
    const low = { ...base, id: 'abc', stars: 10, sourceUrl: 'https://github.com/user/repo' };
    const high = {
      ...base,
      id: 'def',
      stars: 500,
      name: 'test-skill-2',
      sourceUrl: 'https://github.com/user/repo',
    };
    const result = dedupeEntries([low, high]);
    expect(result).toHaveLength(1);
    expect(result[0]?.stars).toBe(500);
  });

  it('handles empty array', () => {
    expect(dedupeEntries([])).toEqual([]);
  });
});
