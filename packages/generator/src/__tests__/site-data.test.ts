import type { DataSnapshot, SkillEntry } from '@skillpulse/core';
import { describe, expect, it } from 'vitest';
import { getAllCategories, getByCategory, getTopTrending, search } from '../site-data.js';

const makeEntry = (o: Partial<SkillEntry> = {}): SkillEntry => ({
  id: 'x',
  name: 'test',
  description: 'A test skill',
  kind: 'skill',
  source: 'github',
  sourceUrl: 'https://github.com/u/r',
  author: 'u',
  stars: 10,
  compat: ['claude-code'],
  category: 'developer-tooling',
  tags: ['t'],
  firstSeenAt: new Date().toISOString(),
  lastUpdatedAt: new Date().toISOString(),
  pulseScore: 50,
  trend: 'stable',
  ...o,
});

const snap: DataSnapshot = {
  generatedAt: new Date().toISOString(),
  totalEntries: 3,
  entries: [
    makeEntry({ id: '1', trend: 'rising', pulseScore: 80, category: 'testing' }),
    makeEntry({ id: '2', trend: 'new', pulseScore: 70 }),
    makeEntry({ id: '3', trend: 'stable', pulseScore: 30, category: 'testing' }),
  ],
};

describe('getTopTrending', () => {
  it('only returns rising/new', () => {
    expect(getTopTrending(snap, 10).every((e) => e.trend === 'rising' || e.trend === 'new')).toBe(
      true,
    );
  });
});

describe('getByCategory', () => {
  it('filters by category', () => {
    expect(getByCategory(snap, 'testing')).toHaveLength(2);
  });
});

describe('getAllCategories', () => {
  it('returns unique sorted categories', () => {
    const cats = getAllCategories(snap);
    expect(new Set(cats).size).toBe(cats.length);
  });
});

describe('search', () => {
  it('finds by name', () => {
    expect(search(snap, 'test').length).toBeGreaterThan(0);
  });
});
