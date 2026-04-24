import { createLogger } from '@skillpulse/core';
import type { Ingestor, RawSkillResult } from './types.js';
import { fetchWithRetry } from './utils.js';

const logger = createLogger('ingestor:reddit');

const SUBREDDITS = ['ClaudeAI', 'LocalLLaMA', 'mcp'];
const GITHUB_URL_REGEX = /https?:\/\/github\.com\/[\w.-]+\/[\w.-]+/gi;

interface RedditPost {
  data: {
    id: string;
    title: string;
    url: string;
    selftext: string;
    author: string;
    score: number;
    created_utc: number;
  };
}

interface RedditListing {
  data: { children: RedditPost[] };
}

export const redditIngestor: Ingestor = {
  name: 'reddit',
  async fetch() {
    const results: RawSkillResult[] = [];
    const seenUrls = new Set<string>();

    for (const subreddit of SUBREDDITS) {
      try {
        logger.info({ msg: 'Fetching Reddit', subreddit });
        const url = `https://www.reddit.com/r/${subreddit}/top.json?t=week&limit=50`;
        const res = await fetchWithRetry(url, {
          headers: { Accept: 'application/json' },
        });
        if (!res.ok) continue;
        const data = (await res.json()) as RedditListing;

        for (const post of data.data?.children ?? []) {
          const { title, url: postUrl, selftext, author, score, created_utc, id } = post.data;
          const text = [title, postUrl, selftext].join(' ');
          const githubUrls = text.match(GITHUB_URL_REGEX) ?? [];

          for (const ghUrl of [...new Set(githubUrls)]) {
            if (seenUrls.has(ghUrl)) continue;
            seenUrls.add(ghUrl);
            results.push({
              source: 'reddit',
              sourceId: `reddit-${id}-${ghUrl}`,
              name: title,
              rawDescription: selftext.slice(0, 500) || title,
              url: ghUrl,
              author,
              stars: score,
              updatedAt: new Date(created_utc * 1000).toISOString(),
            });
          }
        }

        // Rate limit: wait between subreddits
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (err) {
        logger.error({ msg: 'Reddit fetch failed', subreddit, error: String(err) });
      }
    }

    logger.info({ msg: 'Reddit ingestor complete', total: results.length });
    return results;
  },
};
