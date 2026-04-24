import { describe, expect, it, vi } from 'vitest';

// Mock the individual ingestors
vi.mock('../github-trending.js', () => ({
  githubTrendingIngestor: {
    name: 'github-trending',
    fetch: vi.fn().mockResolvedValue([
      {
        source: 'github',
        sourceId: 'user/repo',
        name: 'test-repo',
        rawDescription: 'A test repo',
        url: 'https://github.com/user/repo',
        author: 'user',
        updatedAt: new Date().toISOString(),
      },
    ]),
  },
}));

vi.mock('../npm.js', () => ({
  npmIngestor: { name: 'npm', fetch: vi.fn().mockResolvedValue([]) },
}));
vi.mock('../pypi.js', () => ({
  pypiIngestor: { name: 'pypi', fetch: vi.fn().mockResolvedValue([]) },
}));
vi.mock('../anthropic-registry.js', () => ({
  anthropicRegistryIngestor: { name: 'anthropic-registry', fetch: vi.fn().mockResolvedValue([]) },
}));
vi.mock('../tokrepo.js', () => ({
  tokrepoIngestor: { name: 'tokrepo', fetch: vi.fn().mockResolvedValue([]) },
}));
vi.mock('../hn.js', () => ({
  hnIngestor: { name: 'hn', fetch: vi.fn().mockResolvedValue([]) },
}));
vi.mock('../reddit.js', () => ({
  redditIngestor: { name: 'reddit', fetch: vi.fn().mockResolvedValue([]) },
}));

import { runAllIngestors } from '../orchestrator.js';

describe('runAllIngestors', () => {
  it('returns deduplicated results from all ingestors', async () => {
    const results = await runAllIngestors();
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
  });

  it('handles ingestor failures gracefully', async () => {
    const { githubTrendingIngestor } = await import('../github-trending.js');
    vi.mocked(githubTrendingIngestor.fetch).mockRejectedValueOnce(new Error('Network error'));
    const results = await runAllIngestors();
    expect(Array.isArray(results)).toBe(true);
  });
});
