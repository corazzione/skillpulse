import { createLogger } from '@skillpulse/core';
import type { Ingestor, RawSkillResult } from './types.js';
import { fetchWithRetry } from './utils.js';

const logger = createLogger('ingestor:pypi');

const PYPI_PACKAGES = [
  'mcp',
  'claude-tools',
  'anthropic-tools',
  'mcptools',
  'fastmcp',
  'mcp-server',
  'claude-mcp',
];

interface PypiInfo {
  info: {
    name: string;
    summary: string;
    home_page: string;
    author: string;
    project_urls: Record<string, string>;
    version: string;
    keywords: string;
    upload_time: string;
  };
}

export const pypiIngestor: Ingestor = {
  name: 'pypi',
  async fetch() {
    const results: RawSkillResult[] = [];

    for (const pkg of PYPI_PACKAGES) {
      try {
        logger.info({ msg: 'Fetching PyPI package', pkg });
        const res = await fetchWithRetry(`https://pypi.org/pypi/${pkg}/json`);
        if (!res.ok) continue;
        const data = (await res.json()) as PypiInfo;
        const info = data.info;
        const repoUrl =
          info.project_urls?.Source ??
          info.project_urls?.Repository ??
          info.home_page ??
          `https://pypi.org/project/${pkg}`;

        results.push({
          source: 'pypi',
          sourceId: info.name,
          name: info.name,
          rawDescription: info.summary ?? '',
          url: repoUrl,
          author: info.author ?? 'unknown',
          topics: info.keywords ? info.keywords.split(/[\s,]+/) : [],
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        logger.error({ msg: 'PyPI fetch failed', pkg, error: String(err) });
      }
    }

    logger.info({ msg: 'PyPI ingestor complete', total: results.length });
    return results;
  },
};
