import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { DataSnapshot } from '../packages/core/src/types.js';

function badgeSvg(label: string, value: string, color = 'D4882A'): string {
  const labelWidth = label.length * 6 + 10;
  const valueWidth = value.length * 7 + 10;
  const total = labelWidth + valueWidth;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${total}" height="20" role="img" aria-label="${label}: ${value}">
  <linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient>
  <rect width="${total}" height="20" rx="3" fill="#555"/>
  <rect x="${labelWidth}" width="${valueWidth}" height="20" rx="3" fill="#${color}"/>
  <rect width="${total}" height="20" rx="3" fill="url(#s)"/>
  <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
    <text x="${labelWidth / 2}" y="15">${label}</text>
    <text x="${labelWidth + valueWidth / 2}" y="15">${value}</text>
  </g>
</svg>`;
}

async function main(): Promise<void> {
  const snapshotPath = join(process.cwd(), 'data', 'snapshots', 'latest.json');
  if (!existsSync(snapshotPath)) return;

  const snap: DataSnapshot = JSON.parse(await readFile(snapshotPath, 'utf-8'));
  const badgeDir = join(process.cwd(), 'data', 'api', 'v1', 'badges');
  await mkdir(badgeDir, { recursive: true });

  // Overall entries
  await writeFile(join(badgeDir, 'entries.svg'), badgeSvg('skillpulse', String(snap.totalEntries)));

  // Per-entry "trending" badge for embed on repo READMEs
  for (const entry of snap.entries) {
    const safeId = entry.id.slice(0, 12);
    await writeFile(
      join(badgeDir, `${safeId}.svg`),
      badgeSvg(
        'pulse',
        `${entry.pulseScore}/100`,
        entry.trend === 'rising' || entry.trend === 'new' ? 'D4882A' : '888888',
      ),
    );
  }

  console.log(`Badges generated: ${snap.entries.length + 1}`);
}

main().catch((err) => {
  console.error(String(err));
  process.exit(1);
});
