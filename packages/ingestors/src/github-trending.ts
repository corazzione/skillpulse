import { Octokit } from '@octokit/rest';
import { createLogger } from '@skillpulse/core';
import PQueue from 'p-queue';
import type { Ingestor, RawSkillResult } from './types.js';

const logger = createLogger('ingestor:github');

const SEARCH_QUERIES = [
  'topic:claude-code stars:>5',
  'topic:mcp-server stars:>5',
  'topic:claude-skill stars:>2',
  'topic:agent-skill stars:>2',
  'topic:model-context-protocol stars:>5',
  '"claude-code" in:name,description stars:>10',
  '"mcp-server" in:name,description stars:>5',
  '"claude skill" in:name,description stars:>5',
];

interface GithubRepo {
  full_name: string;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  updated_at: string;
  language: string | null;
  topics: string[];
  owner: { login: string };
}

export const githubTrendingIngestor: Ingestor = {
  name: 'github-trending',
  async fetch({ since } = {}) {
    const token = process.env.GITHUB_TOKEN;
    if (!token) throw new Error('GITHUB_TOKEN is required');

    const octokit = new Octokit({ auth: token });
    const queue = new PQueue({ concurrency: 4 });
    const repoMap = new Map<string, GithubRepo>();

    const dateFilter = since ? ` pushed:>${since}` : '';

    const searches = SEARCH_QUERIES.map((q) =>
      queue.add(async () => {
        try {
          logger.info({ msg: 'Searching GitHub', query: q });
          const results = await octokit.paginate(
            octokit.rest.search.repos,
            {
              q: q + dateFilter,
              sort: 'stars',
              order: 'desc',
              per_page: 100,
            },
            (response) => response.data,
          );
          for (const repo of results) {
            if (!repoMap.has(repo.full_name)) {
              repoMap.set(repo.full_name, repo as unknown as GithubRepo);
            }
          }
          logger.info({ msg: 'Search complete', query: q, count: results.length });
        } catch (err) {
          logger.error({ msg: 'Search failed', query: q, error: String(err) });
        }
      }),
    );

    await Promise.all(searches);
    await queue.onIdle();

    const repos = [...repoMap.values()].slice(0, 500);
    logger.info({ msg: 'GitHub ingestor complete', total: repos.length });

    return repos.map(
      (repo): RawSkillResult => ({
        source: 'github',
        sourceId: repo.full_name,
        name: repo.name,
        rawDescription: repo.description ?? '',
        url: repo.html_url,
        author: repo.owner.login,
        stars: repo.stargazers_count,
        topics: repo.topics ?? [],
        updatedAt: repo.updated_at,
        ...(repo.language !== null ? { language: repo.language } : {}),
      }),
    );
  },
};
