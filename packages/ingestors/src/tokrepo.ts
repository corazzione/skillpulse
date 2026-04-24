import { createLogger } from '@skillpulse/core';
import type { Ingestor, RawSkillResult } from './types.js';
import { fetchWithRetry } from './utils.js';

const logger = createLogger('ingestor:tokrepo');

// Tokrepo — attempt API first, fallback gracefully
export const tokrepoIngestor: Ingestor = {
  name: 'tokrepo',
  async fetch() {
    try {
      logger.info({ msg: 'Fetching Tokrepo' });
      // Attempt known API endpoint pattern
      const res = await fetchWithRetry('https://tokrepo.com/api/v1/mcp-servers', {
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        const data = (await res.json()) as {
          items?: Array<{
            name: string;
            description?: string;
            url?: string;
            github?: string;
            author?: string;
          }>;
        };
        const items = data.items ?? [];
        logger.info({ msg: 'Tokrepo API success', total: items.length });
        return items.map(
          (item): RawSkillResult => ({
            source: 'tokrepo',
            sourceId: item.name,
            name: item.name,
            rawDescription: item.description ?? '',
            url: item.github ?? item.url ?? '',
            author: item.author ?? 'unknown',
            updatedAt: new Date().toISOString(),
          }),
        );
      }

      logger.warn({ msg: 'Tokrepo API unavailable, skipping', status: res.status });
      return [];
    } catch (err) {
      logger.warn({ msg: 'Tokrepo ingestor skipped', error: String(err) });
      return [];
    }
  },
};
