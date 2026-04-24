import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { DataSnapshot, SkillEntry } from '@skillpulse/core';
import Handlebars from 'handlebars';

const __dirname = dirname(fileURLToPath(import.meta.url));

const KIND_EMOJI: Record<string, string> = {
  skill: '🧠',
  'mcp-server': '🔌',
  plugin: '🧩',
  'prompt-pack': '💬',
  'cli-tool': '⚡',
};

const TREND_EMOJI: Record<string, string> = {
  new: '🚀',
  rising: '📈',
  stable: '➡️',
  declining: '📉',
};

const AGENT_LABEL: Record<string, string> = {
  'claude-code': '🤖 Claude Code',
  cursor: '🎯 Cursor',
  'codex-cli': '💻 Codex CLI',
  'gemini-cli': '✨ Gemini CLI',
  windsurf: '🌊 Windsurf',
  generic: '🔧 Generic',
};

Handlebars.registerHelper('kindEmoji', (kind: string) => KIND_EMOJI[kind] ?? '🔧');
Handlebars.registerHelper('trendEmoji', (trend: string) => TREND_EMOJI[trend] ?? '➡️');
Handlebars.registerHelper('agentLabel', (agent: string) => AGENT_LABEL[agent] ?? agent);
Handlebars.registerHelper('categoryLabel', (cat: string) =>
  cat
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' '),
);
Handlebars.registerHelper('truncate', (str: string, len: number) =>
  str && str.length > len ? `${str.slice(0, len - 3)}...` : (str ?? ''),
);
Handlebars.registerHelper('orDash', (val: unknown) =>
  val !== undefined && val !== null ? val : '—',
);

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const AGENTS = ['claude-code', 'cursor', 'codex-cli', 'gemini-cli', 'windsurf', 'generic'] as const;

function addRank<T>(items: T[]): (T & { rank: number })[] {
  return items.map((item, i) => ({ ...item, rank: i + 1 }));
}

export async function generateReadme(snapshot: DataSnapshot): Promise<string> {
  const tplPath = join(__dirname, '../../templates/README.md.hbs');
  const source = await readFile(tplPath, 'utf-8');
  const template = Handlebars.compile(source);

  const { entries } = snapshot;

  const topTrending = addRank(
    entries
      .filter((e) => e.trend === 'rising' || e.trend === 'new')
      .sort((a, b) => b.pulseScore - a.pulseScore)
      .slice(0, 20),
  );

  const newThisWeek = addRank(
    entries
      .filter((e) => Date.now() - new Date(e.firstSeenAt).getTime() < SEVEN_DAYS_MS)
      .sort((a, b) => new Date(b.firstSeenAt).getTime() - new Date(a.firstSeenAt).getTime())
      .slice(0, 10),
  );

  const allTimeTop = addRank(
    [...entries].sort((a, b) => (b.stars ?? 0) - (a.stars ?? 0)).slice(0, 30),
  );

  const catMap = new Map<string, SkillEntry[]>();
  for (const e of entries) {
    const arr = catMap.get(e.category) ?? [];
    arr.push(e);
    catMap.set(e.category, arr);
  }
  const categories = [...catMap.entries()]
    .sort((a, b) => b[1].length - a[1].length)
    .map(([name, es]) => ({
      name,
      entries: addRank(es.sort((a, b) => b.pulseScore - a.pulseScore).slice(0, 10)),
    }));

  const agentSections = AGENTS.map((agent) => ({
    agent,
    entries: addRank(
      entries
        .filter((e) => e.compat.includes(agent))
        .sort((a, b) => b.pulseScore - a.pulseScore)
        .slice(0, 15),
    ),
  })).filter((s) => s.entries.length > 0);

  return template({
    generatedAt: new Date(snapshot.generatedAt).toUTCString(),
    totalEntries: snapshot.totalEntries,
    topTrending,
    newThisWeek,
    allTimeTop,
    categories,
    agentSections,
  });
}

export function applyToReadme(existingContent: string, generated: string): string {
  const START = '<!-- SKILLPULSE:START -->';
  const END = '<!-- SKILLPULSE:END -->';
  const si = existingContent.indexOf(START);
  const ei = existingContent.indexOf(END);
  if (si === -1 || ei === -1) return generated;
  return existingContent.slice(0, si) + generated + existingContent.slice(ei + END.length);
}
