import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

async function main() {
  const snapshotPath = join(process.cwd(), 'data', 'snapshots', 'latest.json');
  let totalEntries = 0;
  if (existsSync(snapshotPath)) {
    const snap = JSON.parse(await readFile(snapshotPath, 'utf-8')) as { totalEntries: number };
    totalEntries = snap.totalEntries;
  }

  // Sum this month's costs
  let budgetUsedMonthUSD = 0;
  const logDir = join(process.cwd(), 'data', 'logs');
  if (existsSync(logDir)) {
    const { readdir } = await import('node:fs/promises');
    const now = new Date();
    const prefix = `cost-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const files = (await readdir(logDir)).filter(
      (f) => f.startsWith(prefix) && f.endsWith('.jsonl'),
    );
    for (const file of files) {
      const lines = (await readFile(join(logDir, file), 'utf-8'))
        .trim()
        .split('\n')
        .filter(Boolean);
      for (const line of lines) {
        try {
          budgetUsedMonthUSD += (JSON.parse(line) as { estimatedUSD?: number }).estimatedUSD ?? 0;
        } catch {
          /* */
        }
      }
    }
  }

  const health = {
    lastRefresh: new Date().toISOString(),
    totalEntries,
    failedIngestors: 0,
    budgetUsedMonthUSD: Number.parseFloat(budgetUsedMonthUSD.toFixed(4)),
  };

  await mkdir(join(process.cwd(), 'data'), { recursive: true });
  await writeFile(join(process.cwd(), 'data', 'health.json'), JSON.stringify(health, null, 2));
  console.log(JSON.stringify({ level: 'info', msg: 'Health file written', ...health }));
}

main().catch((err) => {
  console.error(String(err));
  process.exit(1);
});
