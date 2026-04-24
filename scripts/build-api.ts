import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { DataSnapshot, SkillEntry } from '../packages/core/src/types.js';

async function main(): Promise<void> {
  const snapshotPath = join(process.cwd(), 'data', 'snapshots', 'latest.json');
  if (!existsSync(snapshotPath)) {
    console.log('No snapshot; skipping API build.');
    return;
  }

  const snap: DataSnapshot = JSON.parse(await readFile(snapshotPath, 'utf-8'));
  const apiDir = join(process.cwd(), 'data', 'api', 'v1');
  await mkdir(apiDir, { recursive: true });

  // /api/v1/all.json
  await writeFile(
    join(apiDir, 'all.json'),
    JSON.stringify(
      {
        generatedAt: snap.generatedAt,
        total: snap.totalEntries,
        entries: snap.entries,
      },
      null,
      2,
    ),
  );

  // /api/v1/trending.json
  const trending = snap.entries
    .filter((e) => e.trend === 'rising' || e.trend === 'new')
    .sort((a, b) => b.pulseScore - a.pulseScore)
    .slice(0, 50);
  await writeFile(join(apiDir, 'trending.json'), JSON.stringify({ entries: trending }, null, 2));

  // /api/v1/new.json
  const sevenDaysAgo = Date.now() - 7 * 24 * 3600 * 1000;
  const newEntries = snap.entries
    .filter((e) => new Date(e.firstSeenAt).getTime() > sevenDaysAgo)
    .sort((a, b) => new Date(b.firstSeenAt).getTime() - new Date(a.firstSeenAt).getTime());
  await writeFile(join(apiDir, 'new.json'), JSON.stringify({ entries: newEntries }, null, 2));

  // /api/v1/by-category/{cat}.json
  const catDir = join(apiDir, 'by-category');
  await mkdir(catDir, { recursive: true });
  const byCat = new Map<string, SkillEntry[]>();
  for (const e of snap.entries) {
    const arr = byCat.get(e.category) ?? [];
    arr.push(e);
    byCat.set(e.category, arr);
  }
  for (const [cat, entries] of byCat) {
    await writeFile(
      join(catDir, `${cat}.json`),
      JSON.stringify({ category: cat, entries }, null, 2),
    );
  }

  // /api/v1/by-agent/{agent}.json
  const agentDir = join(apiDir, 'by-agent');
  await mkdir(agentDir, { recursive: true });
  const agents = ['claude-code', 'cursor', 'codex-cli', 'gemini-cli', 'windsurf', 'generic'];
  for (const agent of agents) {
    const entries = snap.entries
      .filter((e) => e.compat.includes(agent as SkillEntry['compat'][number]))
      .sort((a, b) => b.pulseScore - a.pulseScore);
    await writeFile(join(agentDir, `${agent}.json`), JSON.stringify({ agent, entries }, null, 2));
  }

  // /api/v1/stats.json
  await writeFile(
    join(apiDir, 'stats.json'),
    JSON.stringify(
      {
        total: snap.totalEntries,
        byKind: snap.entries.reduce<Record<string, number>>((a, e) => {
          a[e.kind] = (a[e.kind] ?? 0) + 1;
          return a;
        }, {}),
        byCategory: Object.fromEntries(Array.from(byCat.entries()).map(([k, v]) => [k, v.length])),
        byTrend: snap.entries.reduce<Record<string, number>>((a, e) => {
          a[e.trend] = (a[e.trend] ?? 0) + 1;
          return a;
        }, {}),
        generatedAt: snap.generatedAt,
      },
      null,
      2,
    ),
  );

  console.log(`API built: ${snap.totalEntries} entries, ${byCat.size} categories`);
}

main().catch((err) => {
  console.error(String(err));
  process.exit(1);
});
