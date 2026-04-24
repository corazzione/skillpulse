import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getCacheStats } from '../packages/classifier/src/cache.js';
import { runClassificationPipeline } from '../packages/classifier/src/index.js';
import type { RawSkillResult } from '../packages/ingestors/src/index.js';

async function main() {
  try {
    const { config } = await import('dotenv');
    config({ path: '.env.local' });
  } catch {
    /* dotenv optional */
  }

  const today = new Date().toISOString().split('T')[0] ?? 'unknown';
  const rawPath = join(process.cwd(), 'data', 'raw', `${today}.json`);

  let rawResults: RawSkillResult[];
  try {
    const raw = await readFile(rawPath, 'utf-8');
    rawResults = JSON.parse(raw) as RawSkillResult[];
  } catch {
    console.error(`No raw data found at ${rawPath}. Run pnpm ingest first.`);
    process.exit(1);
  }

  console.log(
    JSON.stringify({
      level: 'info',
      msg: 'Starting classification pipeline',
      count: rawResults.length,
    }),
  );

  const entries = await runClassificationPipeline(rawResults);

  const snapshot = {
    generatedAt: new Date().toISOString(),
    totalEntries: entries.length,
    entries,
  };

  const snapshotDir = join(process.cwd(), 'data', 'snapshots');
  await mkdir(snapshotDir, { recursive: true });
  await writeFile(join(snapshotDir, `${today}.json`), JSON.stringify(snapshot, null, 2));
  await writeFile(join(snapshotDir, 'latest.json'), JSON.stringify(snapshot, null, 2));

  const cacheStats = await getCacheStats();
  console.log(
    JSON.stringify({
      level: 'info',
      msg: 'Classification complete',
      entries: entries.length,
      outputPath: join(snapshotDir, `${today}.json`),
      cacheStats,
    }),
  );
}

main().catch((err) => {
  console.error(JSON.stringify({ level: 'error', msg: 'Classifier failed', error: String(err) }));
  process.exit(1);
});
