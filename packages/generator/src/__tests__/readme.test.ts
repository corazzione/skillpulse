import { describe, expect, it } from 'vitest';
import { applyToReadme } from '../readme.js';

describe('applyToReadme', () => {
  it('replaces content between markers', () => {
    const existing = '# Header\n<!-- SKILLPULSE:START -->\nold\n<!-- SKILLPULSE:END -->\n# Footer';
    const gen = '<!-- SKILLPULSE:START -->\nnew\n<!-- SKILLPULSE:END -->';
    const result = applyToReadme(existing, gen);
    expect(result).toContain('# Header');
    expect(result).toContain('new');
    expect(result).toContain('# Footer');
    expect(result).not.toContain('old');
  });

  it('replaces entire file when no markers', () => {
    const result = applyToReadme('no markers', '<!-- SKILLPULSE:START -->x<!-- SKILLPULSE:END -->');
    expect(result).toBe('<!-- SKILLPULSE:START -->x<!-- SKILLPULSE:END -->');
  });
});
