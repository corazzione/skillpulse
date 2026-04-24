import kleur from 'kleur';

const DATA_URL =
  'https://raw.githubusercontent.com/corazzione/skillpulse/main/data/snapshots/latest.json';

interface Entry {
  name: string;
  description: string;
  kind: string;
  sourceUrl: string;
  stars?: number;
  pulseScore: number;
  trend: string;
  category: string;
  compat?: string[];
}

export async function discover(
  opts: { top?: number; category?: string; agent?: string; json?: boolean } = {},
): Promise<void> {
  const top = opts.top ?? 20;
  const res = await fetch(DATA_URL);
  if (!res.ok) {
    console.error(kleur.red(`Failed to fetch registry: ${res.status}`));
    process.exit(1);
  }
  const snapshot = (await res.json()) as { entries: Entry[]; generatedAt: string };

  let entries = snapshot.entries;
  if (opts.category) {
    entries = entries.filter((e) => e.category === opts.category);
  }
  if (opts.agent) {
    const agent = opts.agent.toLowerCase();
    entries = entries.filter((e) => e.compat?.some((c) => c.toLowerCase() === agent));
  }
  entries = entries.sort((a, b) => b.pulseScore - a.pulseScore).slice(0, top);

  if (opts.json) {
    console.log(JSON.stringify(entries, null, 2));
    return;
  }

  const agentLabel = opts.agent ? ` for ${opts.agent}` : '';
  const catLabel = opts.category ? ` in ${opts.category}` : '';

  const kindEmoji: Record<string, string> = {
    skill: '🧠',
    'mcp-server': '🔌',
    plugin: '🧩',
    'prompt-pack': '💬',
    'cli-tool': '⚡',
  };
  const trendEmoji: Record<string, string> = {
    new: '🚀',
    rising: '📈',
    stable: '➡️',
    declining: '📉',
  };

  console.log(kleur.bold().yellow(`\n  SkillPulse — Top ${top}${catLabel}${agentLabel}\n`));
  for (const [i, e] of entries.entries()) {
    const rank = String(i + 1).padStart(2, ' ');
    const pulse = kleur.yellow(`${e.pulseScore}/100`);
    const trend = trendEmoji[e.trend] ?? '';
    const kind = kindEmoji[e.kind] ?? '🔧';
    console.log(`  ${kleur.dim(rank)}. ${kind} ${trend} ${kleur.bold(e.name)} — ${pulse}`);
    console.log(`      ${kleur.dim(e.description.slice(0, 80))}`);
    console.log(`      ${kleur.cyan(e.sourceUrl)}`);
    console.log();
  }
  console.log(kleur.dim('  Browse full registry: https://corazzione.github.io/skillpulse'));
}
