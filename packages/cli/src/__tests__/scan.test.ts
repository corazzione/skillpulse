import { describe, expect, it } from 'vitest';
import { scanAll } from '../scan.js';

describe('scanAll', () => {
  it('returns an array (even if empty on CI)', async () => {
    const results = await scanAll();
    expect(Array.isArray(results)).toBe(true);
  });
});
