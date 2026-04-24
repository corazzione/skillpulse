import { createLogger } from '@skillpulse/core';
import type { Ingestor, RawSkillResult } from './types.js';
import { fetchWithRetry } from './utils.js';

const logger = createLogger('ingestor:npm');

const NPM_QUERIES = [
  'keywords:claude-code',
  'keywords:mcp-server',
  'keywords:claude-skill',
  'keywords:model-context-protocol',
  'keywords:agent-skill',
];

interface NpmSearchResult {
  package: {
    name: string;
    description: string;
    version: string;
    links: { npm: string; repository?: string };
    publisher: { username: string };
    keywords?: string[];
    date: string;
  };
}

interface NpmDownloads {
  downloads: number;
}

async function getWeeklyDownloads(name: string): Promise<number> {
  try {
    const res = await fetchWithRetry(
      `https://api.npmjs.org/downloads/point/last-week/${encodeURIComponent(name)}`,
    );
    if (!res.ok) return 0;
    const data = (await res.json()) as NpmDownloads;
    return data.downloads ?? 0;
  } catch {
    return 0;
  }
}

export const npmIngestor: Ingestor = {
  name: 'npm',
  async fetch() {
    const packageMap = new Map<string, NpmSearchResult['package']>();

    for (const query of NPM_QUERIES) {
      try {
        logger.info({ msg: 'Searching npm', query });
        const url = `https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(query)}&size=250`;
        const res = await fetchWithRetry(url);
        if (!res.ok) continue;
        const data = (await res.json()) as { objects: NpmSearchResult[] };
        for (const obj of data.objects ?? []) {
          if (!packageMap.has(obj.package.name)) {
            packageMap.set(obj.package.name, obj.package);
          }
        }
        logger.info({ msg: 'npm search complete', query, count: data.objects?.length ?? 0 });
      } catch (err) {
        logger.error({ msg: 'npm search failed', query, error: String(err) });
      }
    }

    const packages = [...packageMap.values()];
    logger.info({ msg: 'npm ingestor: fetching downloads', total: packages.length });

    const results: RawSkillResult[] = [];
    for (const pkg of packages) {
      const downloads = await getWeeklyDownloads(pkg.name);
      results.push({
        source: 'npm',
        sourceId: pkg.name,
        name: pkg.name,
        rawDescription: pkg.description ?? '',
        url: pkg.links.repository ?? pkg.links.npm,
        author: pkg.publisher?.username ?? 'unknown',
        downloads,
        topics: pkg.keywords ?? [],
        updatedAt: pkg.date,
      });
    }

    logger.info({ msg: 'npm ingestor complete', total: results.length });
    return results;
  },
};
