import { describe, expect, it } from 'vitest';
import { dedupeByUrl, normalizeGithubUrl } from '../utils.js';

describe('normalizeGithubUrl', () => {
  it('removes trailing slash', () => {
    expect(normalizeGithubUrl('https://github.com/user/repo/')).toBe(
      'https://github.com/user/repo',
    );
  });

  it('lowercases URL', () => {
    expect(normalizeGithubUrl('https://GitHub.com/User/Repo')).toBe('https://github.com/user/repo');
  });
});

describe('dedupeByUrl', () => {
  it('removes duplicate URLs', () => {
    const items = [
      { url: 'https://github.com/user/repo', name: 'first' },
      { url: 'https://github.com/user/repo/', name: 'second' },
      { url: 'https://github.com/other/repo', name: 'third' },
    ];
    const result = dedupeByUrl(items);
    expect(result).toHaveLength(2);
    expect(result[0]?.name).toBe('first');
    expect(result[1]?.name).toBe('third');
  });

  it('handles empty array', () => {
    expect(dedupeByUrl([])).toEqual([]);
  });
});
