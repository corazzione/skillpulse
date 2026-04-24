import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import type { DetectedEntry } from './index.js';

const CURSOR_HOME = join(homedir(), '.cursor');

async function readJson(path: string): Promise<Record<string, unknown> | null> {
  try {
    return JSON.parse(await readFile(path, 'utf-8')) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function detect(): Promise<DetectedEntry[]> {
  const results: DetectedEntry[] = [];

  // MCPs from ~/.cursor/mcp.json
  const mcpPath = join(CURSOR_HOME, 'mcp.json');
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
        detectedBy: 'cursor',
        ...(sourceHint ? { sourceHint } : {}),
      });
    }
  }

  // Global cursor rules from ~/.cursor/rules/
  const rulesDir = join(CURSOR_HOME, 'rules');
  if (existsSync(rulesDir)) {
    try {
      const { readdir } = await import('node:fs/promises');
      const entries = await readdir(rulesDir);
      for (const entry of entries) {
        if (entry.endsWith('.md') || entry.endsWith('.txt') || entry.endsWith('.mdc')) {
          results.push({
            name: entry.replace(/\.(md|txt|mdc)$/, ''),
            kind: 'prompt-pack',
            detectedBy: 'cursor',
          });
        }
      }
    } catch {
      // defensive
    }
  }

  return results;
}
