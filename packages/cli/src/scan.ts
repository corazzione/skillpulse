import { existsSync } from 'node:fs';
import { readFile, readdir, stat } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';

export interface LocalSkill {
  name: string;
  path: string;
  kind: 'skill' | 'mcp-server' | 'plugin';
  description?: string;
  url?: string;
}

const CLAUDE_HOME = join(homedir(), '.claude');

async function readJson(path: string): Promise<Record<string, unknown> | null> {
  try {
    return JSON.parse(await readFile(path, 'utf-8')) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function scanLocalMcps(): Promise<LocalSkill[]> {
  const results: LocalSkill[] = [];
  const settingsPath = join(CLAUDE_HOME, 'settings.json');
  const settings = await readJson(settingsPath);
  if (!settings) return results;

  const mcpServers = (settings.mcpServers ?? {}) as Record<
    string,
    {
      command?: string;
      url?: string;
      args?: string[];
    }
  >;

  for (const [name, config] of Object.entries(mcpServers)) {
    const url =
      config.url ?? config.args?.find((a) => a.startsWith('http') || a.startsWith('@')) ?? '';
    results.push({
      name,
      path: settingsPath,
      kind: 'mcp-server',
      url,
    });
  }
  return results;
}

export async function scanLocalSkills(): Promise<LocalSkill[]> {
  const results: LocalSkill[] = [];
  const skillsDir = join(CLAUDE_HOME, 'skills');
  if (!existsSync(skillsDir)) return results;

  const entries = await readdir(skillsDir);
  for (const entry of entries) {
    const skillPath = join(skillsDir, entry);
    const st = await stat(skillPath);
    if (!st.isDirectory()) continue;

    const skillMdPath = join(skillPath, 'SKILL.md');
    if (existsSync(skillMdPath)) {
      const content = await readFile(skillMdPath, 'utf-8');
      const nameMatch = content.match(/^name:\s*(.+)$/m);
      const descMatch = content.match(/^description:\s*(.+)$/m);
      results.push({
        name: nameMatch?.[1]?.trim() ?? entry,
        path: skillPath,
        kind: 'skill',
        ...(descMatch?.[1] ? { description: descMatch[1].trim() } : {}),
      });
    }
  }
  return results;
}

export async function scanLocalPlugins(): Promise<LocalSkill[]> {
  const results: LocalSkill[] = [];
  const pluginsDir = join(CLAUDE_HOME, 'plugins');
  if (!existsSync(pluginsDir)) return results;

  const entries = await readdir(pluginsDir);
  for (const entry of entries) {
    const pluginPath = join(pluginsDir, entry);
    const st = await stat(pluginPath);
    if (!st.isDirectory()) continue;
    results.push({ name: entry, path: pluginPath, kind: 'plugin' });
  }
  return results;
}

export async function scanAll(): Promise<LocalSkill[]> {
  const [mcps, skills, plugins] = await Promise.all([
    scanLocalMcps(),
    scanLocalSkills(),
    scanLocalPlugins(),
  ]);
  return [...mcps, ...skills, ...plugins];
}
