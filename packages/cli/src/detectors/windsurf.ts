import { existsSync } from 'node:fs';
import { readFile, readdir, stat } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import type { DetectedEntry } from './index.js';

const WINDSURF_HOME = join(homedir(), '.codeium', 'windsurf');

async function readJson(path: string): Promise<Record<string, unknown> | null> {
  try {
    return JSON.parse(await readFile(path, 'utf-8')) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function detect(): Promise<DetectedEntry[]> {
  const results: DetectedEntry[] = [];

  // MCPs from ~/.codeium/windsurf/mcp_config.json
  const mcpPath = join(WINDSURF_HOME, 'mcp_config.json');
  const mcpConfig = await readJson(mcpPath);
  if (mcpConfig) {
    const mcpServers = (mcpConfig.mcpServers ?? {}) as Record<
      string,
      { command?: string; url?: string; args?: string[] }
    >;
    for (const [name, config] of Object.entries(mcpServers)) {
      const sourceHint =
        config.url ?? config.args?.find((a) => a.startsWith('http') || a.startsWith('@'));
      results.push({
        name,
        kind: 'mcp-server',
        detectedBy: 'windsurf',
        ...(sourceHint ? { sourceHint } : {}),
      });
    }
  }

  // Memories/skills from ~/.codeium/windsurf/memories/
  const memoriesDir = join(WINDSURF_HOME, 'memories');
  if (existsSync(memoriesDir)) {
    try {
      const entries = await readdir(memoriesDir);
      for (const entry of entries) {
        const memPath = join(memoriesDir, entry);
        const st = await stat(memPath);
        if (st.isFile() && (entry.endsWith('.md') || entry.endsWith('.txt'))) {
          results.push({
            name: entry.replace(/\.(md|txt)$/, ''),
            kind: 'skill',
            detectedBy: 'windsurf',
          });
        }
      }
    } catch {
      // defensive
    }
  }

  return results;
}
