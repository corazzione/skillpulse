import { createLogger } from '@skillpulse/core';
import { anthropicRegistryIngestor } from './anthropic-registry.js';
import { githubTrendingIngestor } from './github-trending.js';
import { hnIngestor } from './hn.js';
import { npmIngestor } from './npm.js';
import { pypiIngestor } from './pypi.js';
import { redditIngestor } from './reddit.js';
import { tokrepoIngestor } from './tokrepo.js';
import type { Ingestor, RawSkillResult } from './types.js';
import { dedupeByUrl } from './utils.js';

const logger = createLogger('orchestrator');

const ALL_INGESTORS: Ingestor[] = [
  githubTrendingIngestor,
  npmIngestor,
  pypiIngestor,
  anthropicRegistryIngestor,
  tokrepoIngestor,
  hnIngestor,
  redditIngestor,
];

export async function runAllIngestors(opts: { since?: string } = {}): Promise<RawSkillResult[]> {
  logger.info({ msg: 'Starting all ingestors', count: ALL_INGESTORS.length });

  const results = await Promise.allSettled(
    ALL_INGESTORS.map(async (ingestor) => {
      const start = Date.now();
      try {
        const items = await ingestor.fetch(opts);
        logger.info({
          msg: 'Ingestor succeeded',
          name: ingestor.name,
          count: items.length,
          durationMs: Date.now() - start,
        });
        return items;
      } catch (err) {
        logger.error({
          msg: 'Ingestor failed',
          name: ingestor.name,
          error: String(err),
          durationMs: Date.now() - start,
        });
        return [];
      }
    }),
  );

  const allItems: RawSkillResult[] = [];
  for (const result of results) {
    if (result.status === 'fulfilled') {
      allItems.push(...result.value);
    }
  }

  const deduped = dedupeByUrl(allItems.filter((item) => item.url && item.url.length > 0));

  logger.info({
    msg: 'Orchestrator complete',
    totalRaw: allItems.length,
    afterDedupe: deduped.length,
  });

  return deduped;
}
