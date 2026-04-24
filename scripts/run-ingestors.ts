import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { runAllIngestors } from '../packages/ingestors/src/index.js';

async function main() {
  // Load .env.local if it exists
  try {
    const { config } = await import('dotenv');
    config({ path: '.env.local' });
  } catch {
    // dotenv not required
  }

  console.log(JSON.stringify({ level: 'info', msg: 'Starting ingestor run' }));
  const start = Date.now();

  const results = await runAllIngestors();

  const today = new Date().toISOString().split('T')[0];
  const rawDir = join(process.cwd(), 'data', 'raw');
  await mkdir(rawDir, { recursive: true });

  const outputPath = join(rawDir, `${today}.json`);
  await writeFile(outputPath, JSON.stringify(results, null, 2), 'utf-8');

  const duration = Date.now() - start;
  console.log(
    JSON.stringify({
      level: 'info',
      msg: 'Ingestor run complete',
      total: results.length,
      outputPath,
      durationMs: duration,
    }),
  );
  console.log(`\nSummary: ${results.length} entries written to ${outputPath} in ${duration}ms`);
}

main().catch((err) => {
  console.error(JSON.stringify({ level: 'error', msg: 'Ingestor run failed', error: String(err) }));
  process.exit(1);
});
