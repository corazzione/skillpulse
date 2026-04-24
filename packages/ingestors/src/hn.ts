import { createLogger } from '@skillpulse/core';
import type { Ingestor, RawSkillResult } from './types.js';
import { fetchWithRetry } from './utils.js';

const logger = createLogger('ingestor:hn');

const HN_QUERIES = [
  'claude code',
  'MCP server',
  'claude skill',
  'agent skill',
  'model context protocol',
];
const GITHUB_URL_REGEX = /https?:\/\/github\.com\/[\w.-]+\/[\w.-]+/gi;
const NPM_URL_REGEX = /https?:\/\/(?:www\.)?npmjs\.com\/package\/[\w@/-]+/gi;

interface HnHit {
  objectID: string;
  title: string;
  url?: string;
  story_text?: string;
  comment_text?: string;
  author: string;
  created_at: string;
  points?: number;
}

function extractUrls(text: string): string[] {
  const github = text.match(GITHUB_URL_REGEX) ?? [];
  const npm = text.match(NPM_URL_REGEX) ?? [];
  return [...new Set([...github, ...npm])];
}

export const hnIngestor: Ingestor = {
  name: 'hn',
  async fetch({ since } = {}) {
    const sevenDaysAgo = since ?? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const results: RawSkillResult[] = [];
    const seenUrls = new Set<string>();

    for (const query of HN_QUERIES) {
      try {
        logger.info({ msg: 'Searching HN', query });
        const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=story&numericFilters=created_at_i>${Math.floor(new Date(sevenDaysAgo).getTime() / 1000)}&hitsPerPage=50`;
        const res = await fetchWithRetry(url);
        if (!res.ok) continue;
        const data = (await res.json()) as { hits: HnHit[] };

        for (const hit of data.hits ?? []) {
          const text = [hit.title, hit.url ?? '', hit.story_text ?? ''].join(' ');
          const urls = extractUrls(text);
          for (const extractedUrl of urls) {
            if (seenUrls.has(extractedUrl)) continue;
            seenUrls.add(extractedUrl);
            results.push({
              source: 'hn',
              sourceId: `hn-${hit.objectID}-${extractedUrl}`,
              name: hit.title,
              rawDescription: hit.story_text?.slice(0, 500) ?? hit.title,
              url: extractedUrl,
              author: hit.author,
              stars: hit.points ?? 0,
              updatedAt: hit.created_at,
            });
          }
        }
      } catch (err) {
        logger.error({ msg: 'HN search failed', query, error: String(err) });
      }
    }

    logger.info({ msg: 'HN ingestor complete', total: results.length });
    return results;
  },
};
