import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { DataSnapshot } from '../packages/core/src/types.js';

async function main() {
  const snapshotPath = join(process.cwd(), 'data', 'snapshots', 'latest.json');
  if (!existsSync(snapshotPath)) {
    console.log('No snapshot found, skipping digest.');
    return;
  }

  const snapshot: DataSnapshot = JSON.parse(await readFile(snapshotPath, 'utf-8'));
  const entries = snapshot.entries;

  const now = new Date();
  const week = `${now.getFullYear()}-W${String(Math.ceil(now.getDate() / 7)).padStart(2, '0')}`;

  const top10New = entries
    .filter((e) => e.trend === 'new')
    .sort((a, b) => b.pulseScore - a.pulseScore)
    .slice(0, 10);

  const top5Rising = entries
    .filter((e) => e.trend === 'rising')
    .sort((a, b) => b.pulseScore - a.pulseScore)
    .slice(0, 5);

  const digest = `# SkillPulse Weekly Digest — ${week}

*Generated ${now.toUTCString()}*

## Top 10 New This Week

${top10New.map((e, i) => `${i + 1}. **[${e.name}](${e.sourceUrl})** — ${e.description}`).join('\n')}

## Top 5 Risers

${top5Rising.map((e, i) => `${i + 1}. **[${e.name}](${e.sourceUrl})** — Pulse ${e.pulseScore}/100`).join('\n')}

---

*[View full registry](https://corazzione.github.io/skillpulse) · [Submit a skill](https://github.com/corazzione/skillpulse/issues/new?template=submit-skill.yml)*

<sub>MC. ■</sub>
`;

  const digestDir = join(process.cwd(), 'digests');
  await mkdir(digestDir, { recursive: true });
  await writeFile(join(digestDir, `${week}.md`), digest);
  console.log(JSON.stringify({ level: 'info', msg: 'Digest written', week }));

  // Post to Discord if webhook configured
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (webhookUrl && top10New.length > 0) {
    try {
      const content = `📊 **SkillPulse Weekly Digest — ${week}**\n\n🆕 **New This Week (Top 3):**\n${top10New
        .slice(0, 3)
        .map((e) => `• [${e.name}](<${e.sourceUrl}>) — ${e.description.slice(0, 80)}`)
        .join(
          '\n',
        )}\n\n[Full digest](<https://github.com/corazzione/skillpulse/blob/main/digests/${week}.md>)`;
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          username: 'SkillPulse',
          avatar_url:
            'https://raw.githubusercontent.com/corazzione/skillpulse/main/.github/assets/logo.svg',
        }),
      });
    } catch (err) {
      console.error('Discord webhook failed:', String(err));
    }
  }
}

main().catch((err) => {
  console.error(String(err));
  process.exit(1);
});
