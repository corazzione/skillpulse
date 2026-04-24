import { existsSync } from 'node:fs';
import { readFile, readdir, stat } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import type { DetectedEntry } from './index.js';

const CLAUDE_HOME = join(homedir(), '.claude');

async function readJson(path: string): Promise<Record<string, unknown> | null> {
  try {
    return JSON.parse(await readFile(path, 'utf-8')) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function detect(): Promise<DetectedEntry[]> {
  const results: DetectedEntry[] = [];

  // MCPs from settings.json
  const settingsPath = join(CLAUDE_HOME, 'settings.json');
  const settings = await readJson(settingsPath);
  if (settings) {
    const mcpServers = (settings.mcpServers ?? {}) as Record<
      string,
      { command?: string; url?: string; args?: string[] }
    >;
    for (const [name, config] of Object.entries(mcpServers)) {
      const sourceHint =
        config.url ?? config.args?.find((a) => a.startsWith('http') || a.startsWith('@'));
      results.push({
        name,
        kind: 'mcp-server',
        detectedBy: 'claude-code',
        ...(sourceHint ? { sourceHint } : {}),
      });
    }
  }

  // Skills from ~/.claude/skills/
  const skillsDir = join(CLAUDE_HOME, 'skills');
  if (existsSync(skillsDir)) {
    try {
      const entries = await readdir(skillsDir);
      for (const entry of entries) {
        const skillPath = join(skillsDir, entry);
        const st = await stat(skillPath);
        if (!st.isDirectory()) continue;
        const skillMdPath = join(skillPath, 'SKILL.md');
        if (existsSync(skillMdPath)) {
          const content = await readFile(skillMdPath, 'utf-8');
          const nameMatch = content.match(/^name:\s*(.+)$/m);
          results.push({
            name: nameMatch?.[1]?.trim() ?? entry,
            kind: 'skill',
            detectedBy: 'claude-code',
          });
        }
      }
    } catch {
      // defensive — skip on any FS error
    }
  }

  // Plugins from ~/.claude/plugins/
  const pluginsDir = join(CLAUDE_HOME, 'plugins');
  if (existsSync(pluginsDir)) {
    try {
      const entries = await readdir(pluginsDir);
      for (const entry of entries) {
        const pluginPath = join(pluginsDir, entry);
        const st = await stat(pluginPath);
        if (!st.isDirectory()) continue;
        results.push({ name: entry, kind: 'plugin', detectedBy: 'claude-code' });
      }
    } catch {
      // defensive
    }
  }

  return results;
}
