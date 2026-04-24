import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { type DataSnapshot, type SkillEntry, createLogger } from '@skillpulse/core';
import type { RawSkillResult } from '@skillpulse/ingestors';
import PQueue from 'p-queue';
import { getCacheStats, getCached, setCached } from './cache.js';
import { CANONICAL_CATEGORIES } from './categories.js';
import { classifyEntry } from './classify.js';
import { dedupeEntries } from './dedupe.js';
import { computePulseScore, computeTrend } from './scoring.js';

const logger = createLogger('pipeline');

function stableId(source: string, sourceId: string): string {
  return createHash('sha1').update(`${source}:${sourceId}`).digest('hex');
}

async function loadHistory(): Promise<SkillEntry[]> {
  try {
    const raw = await readFile(join(process.cwd(), 'data', 'snapshots', 'latest.json'), 'utf-8');
    const snapshot = JSON.parse(raw) as DataSnapshot;
    return snapshot.entries;
  } catch {
    return [];
  }
}

type ClassifyResult = Awaited<ReturnType<typeof classifyEntry>>;

function buildEntry(raw: RawSkillResult, id: string, classification: ClassifyResult): SkillEntry {
  if (!classification) throw new Error('classification is null');

  // Snap category to canonical list
  const category = (CANONICAL_CATEGORIES as readonly string[]).includes(classification.category)
    ? classification.category
    : 'other';

  return {
    id,
    name: raw.name,
    description: classification.description,
    kind: classification.kind,
    source: raw.source,
    sourceUrl: raw.url,
    author: raw.author,
    ...(raw.stars !== undefined ? { stars: raw.stars } : {}),
    ...(raw.downloads !== undefined ? { downloadsWeekly: raw.downloads } : {}),
    compat: classification.compat,
    category,
    tags: classification.tags,
    firstSeenAt: new Date().toISOString(),
    lastUpdatedAt: raw.updatedAt,
    pulseScore: 0, // will be computed after
    trend: 'new',
  };
}

export async function runClassificationPipeline(
  rawResults: RawSkillResult[],
): Promise<SkillEntry[]> {
  logger.info({ msg: 'Pipeline started', rawCount: rawResults.length });

  const history = await loadHistory();
  const queue = new PQueue({ concurrency: 5 });
  const entries: SkillEntry[] = [];
  let cacheHits = 0;
  let apiCalls = 0;

  await Promise.all(
    rawResults.map((raw) =>
      queue.add(async () => {
        const id = stableId(raw.source, raw.sourceId);
        const cacheKey = raw.readmeSnippet ?? raw.rawDescription;

        // Check cache
        const cached = await getCached(id, cacheKey);
        if (cached) {
          cacheHits++;
          const classification = cached as ClassifyResult;
          if (classification) {
            entries.push(buildEntry(raw, id, classification));
          }
          return;
        }

        // Classify via AI
        apiCalls++;
        const classification = await classifyEntry(raw);
        if (!classification) {
          logger.warn({ msg: 'Classification returned null, skipping', name: raw.name });
          return;
        }

        await setCached(id, cacheKey, classification);
        entries.push(buildEntry(raw, id, classification));
      }),
    ),
  );

  await queue.onIdle();

  const cacheStats = await getCacheStats();
  logger.info({
    msg: 'Classification complete',
    total: entries.length,
    cacheHits,
    apiCalls,
    cacheStats,
  });

  // Dedupe
  const deduped = dedupeEntries(entries);

  // Score and determine trend
  const scored = deduped.map((entry) => {
    const withScore = { ...entry, pulseScore: computePulseScore(entry, history) };
    return { ...withScore, trend: computeTrend(withScore, history) };
  });

  // Sort by score desc, then name asc
  scored.sort((a, b) => b.pulseScore - a.pulseScore || a.name.localeCompare(b.name));

  logger.info({ msg: 'Pipeline complete', final: scored.length });
  return scored;
}
