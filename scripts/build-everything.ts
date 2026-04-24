import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { DataSnapshot } from '../packages/core/src/types.js';
import { applyToReadme, generateReadme } from '../packages/generator/src/readme.js';

async function main() {
  try {
    const { config } = await import('dotenv');
    config({ path: '.env.local' });
  } catch {
    /* optional */
  }

  const isDryRun = process.argv.includes('--dry-run');
  const snapshotPath = join(process.cwd(), 'data', 'snapshots', 'latest.json');

  if (!existsSync(snapshotPath)) {
    const empty: DataSnapshot = {
      generatedAt: new Date().toISOString(),
      totalEntries: 0,
      entries: [],
    };
    await mkdir(join(process.cwd(), 'data', 'snapshots'), { recursive: true });
    await writeFile(snapshotPath, JSON.stringify(empty, null, 2));
  }

  const snapshot: DataSnapshot = JSON.parse(await readFile(snapshotPath, 'utf-8'));
  console.log(
    JSON.stringify({ level: 'info', msg: 'Generating README', entries: snapshot.totalEntries }),
  );

  const generated = await generateReadme(snapshot);
  const readmePath = join(process.cwd(), 'README.md');
  let existing = '';
  try {
    existing = await readFile(readmePath, 'utf-8');
  } catch {
    /* new */
  }
  const final = applyToReadme(existing, generated);

  if (!isDryRun) {
    await writeFile(readmePath, final, 'utf-8');
    console.log(JSON.stringify({ level: 'info', msg: 'README written' }));
    try {
      execSync('pnpm --filter site build', { stdio: 'inherit', cwd: process.cwd() });
    } catch (err) {
      console.error(
        JSON.stringify({ level: 'error', msg: 'Site build failed', error: String(err) }),
      );
    }
  } else {
    console.log(JSON.stringify({ level: 'info', msg: 'Dry run — skipping writes' }));
  }
  console.log(JSON.stringify({ level: 'info', msg: 'Done', entries: snapshot.totalEntries }));
}

main().catch((err) => {
  console.error(String(err));
  process.exit(1);
});
