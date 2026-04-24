import type { SkillEntry } from '@skillpulse/core';
import { describe, expect, it } from 'vitest';
import { computePulseScore, computeTrend } from '../scoring.js';

const base: SkillEntry = {
  id: 'abc',
  name: 'test',
  description: 'test',
  kind: 'skill',
  source: 'github',
  sourceUrl: 'https://github.com/u/r',
  author: 'u',
  stars: 100,
  compat: ['claude-code'],
  category: 'developer-tooling',
  tags: [],
  firstSeenAt: new Date().toISOString(),
  lastUpdatedAt: new Date().toISOString(),
  pulseScore: 50,
  trend: 'stable',
};

describe('computePulseScore', () => {
  it('returns a number between 0 and 100', () => {
    const score = computePulseScore(base, []);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('higher stars = higher score (all else equal)', () => {
    const low = computePulseScore({ ...base, stars: 10 }, []);
    const high = computePulseScore({ ...base, stars: 5000 }, []);
    expect(high).toBeGreaterThan(low);
  });
});

describe('computeTrend', () => {
  it('returns "new" for entries not in history', () => {
    expect(computeTrend(base, [])).toBe('new');
  });

  it('returns "rising" when score grew >15%', () => {
    const history = [{ ...base, pulseScore: 40 }];
    const current = { ...base, pulseScore: 60 };
    expect(computeTrend(current, history)).toBe('rising');
  });

  it('returns "stable" for small changes', () => {
    const history = [{ ...base, pulseScore: 50 }];
    const current = { ...base, pulseScore: 52 };
    expect(computeTrend(current, history)).toBe('stable');
  });
});
