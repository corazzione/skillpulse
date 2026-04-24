import { createLogger } from '@skillpulse/core';
import type { Ingestor, RawSkillResult } from './types.js';
import { fetchWithRetry } from './utils.js';

const logger = createLogger('ingestor:anthropic-registry');

// Official MCP registry on GitHub
const REGISTRY_URL =
  'https://raw.githubusercontent.com/modelcontextprotocol/registry/main/registry.json';

interface RegistryEntry {
  name: string;
  description?: string;
  url?: string;
  github?: string;
  npm?: string;
  author?: string;
  tags?: string[];
}

export const anthropicRegistryIngestor: Ingestor = {
  name: 'anthropic-registry',
  async fetch() {
    try {
      logger.info({ msg: 'Fetching Anthropic MCP registry' });
      const res = await fetchWithRetry(REGISTRY_URL);
      if (!res.ok) {
        logger.warn({ msg: 'Registry not available', status: res.status });
        return [];
      }
      const data = (await res.json()) as { servers?: RegistryEntry[] } | RegistryEntry[];
      const entries: RegistryEntry[] = Array.isArray(data) ? data : (data.servers ?? []);

      const results: RawSkillResult[] = entries.map(
        (entry): RawSkillResult => ({
          source: 'anthropic-registry',
          sourceId: entry.name,
          name: entry.name,
          rawDescription: entry.description ?? '',
          url: entry.github ?? entry.npm ?? entry.url ?? '',
          author: entry.author ?? 'unknown',
          topics: entry.tags ?? [],
          updatedAt: new Date().toISOString(),
        }),
      );

      logger.info({ msg: 'Anthropic registry ingestor complete', total: results.length });
      return results;
    } catch (err) {
      logger.error({ msg: 'Anthropic registry fetch failed', error: String(err) });
      return [];
    }
  },
};
