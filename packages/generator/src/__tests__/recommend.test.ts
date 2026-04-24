import type { DataSnapshot, SkillEntry } from '@skillpulse/core';
import { describe, expect, it } from 'vitest';
import { recommendSimilar } from '../recommend.js';

const entry = (o: Partial<SkillEntry> = {}): SkillEntry => ({
  id: 'x',
  name: 't',
  description: 'd',
  kind: 'skill',
  source: 'github',
  sourceUrl: 'https://x',
  author: 'a',
  compat: ['claude-code'],
  category: 'developer-tooling',
  tags: ['test'],
  firstSeenAt: new Date().toISOString(),
  lastUpdatedAt: new Date().toISOString(),
  pulseScore: 50,
  trend: 'stable',
  ...o,
});

describe('recommendSimilar', () => {
  it('returns similar entries sorted by score', () => {
    const snap: DataSnapshot = {
      generatedAt: new Date().toISOString(),
      totalEntries: 3,
      entries: [
        entry({ id: '1', category: 'testing', tags: ['test', 'e2e'] }),
        entry({ id: '2', category: 'testing', tags: ['test'] }),
        entry({ id: '3', category: 'database', tags: ['db'] }),
      ],
    };
    const base = entry({ id: 'base', category: 'testing', tags: ['test', 'e2e'] });
    const result = recommendSimilar(snap, base, 2);
    expect(result).toHaveLength(2);
    expect(result[0]?.id).toBe('1'); // most similar
  });
});
