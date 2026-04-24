import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createLogger } from '@skillpulse/core';

const logger = createLogger('cache');
const CACHE_PATH = join(process.cwd(), 'data', 'cache', 'classifications.json');
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

interface CacheEntry {
  result: unknown;
  cachedAt: string;
  inputHash: string;
}

type CacheStore = Record<string, CacheEntry>;

let _cache: CacheStore | null = null;

async function loadCache(): Promise<CacheStore> {
  if (_cache) return _cache;
  try {
    const raw = await readFile(CACHE_PATH, 'utf-8');
    _cache = JSON.parse(raw) as CacheStore;
  } catch {
    _cache = {};
  }
  return _cache;
}

async function saveCache(store: CacheStore): Promise<void> {
  await mkdir(join(process.cwd(), 'data', 'cache'), { recursive: true });
  await writeFile(CACHE_PATH, JSON.stringify(store, null, 2), 'utf-8');
}

function makeKey(id: string, snippet: string): string {
  return createHash('sha1').update(`${id}:${snippet}`).digest('hex');
}

export async function getCached(id: string, inputSnippet: string): Promise<unknown | null> {
  const store = await loadCache();
  const key = makeKey(id, inputSnippet);
  const entry = store[key];
  if (!entry) return null;
  if (Date.now() - new Date(entry.cachedAt).getTime() > CACHE_TTL_MS) return null;
  return entry.result;
}

export async function setCached(id: string, inputSnippet: string, result: unknown): Promise<void> {
  const store = await loadCache();
  const key = makeKey(id, inputSnippet);
  store[key] = { result, cachedAt: new Date().toISOString(), inputHash: key };
  await saveCache(store);
  logger.debug({ msg: 'Cache set', key });
}

export async function getCacheStats(): Promise<{ total: number; fresh: number }> {
  const store = await loadCache();
  const total = Object.keys(store).length;
  const fresh = Object.values(store).filter(
    (e) => Date.now() - new Date(e.cachedAt).getTime() <= CACHE_TTL_MS,
  ).length;
  return { total, fresh };
}
