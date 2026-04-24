import { readFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import type { DetectedEntry } from './index.js';

const GEMINI_SETTINGS = join(homedir(), '.gemini', 'settings.json');

async function readJson(path: string): Promise<Record<string, unknown> | null> {
  try {
    return JSON.parse(await readFile(path, 'utf-8')) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function detect(): Promise<DetectedEntry[]> {
  const results: DetectedEntry[] = [];

  const settings = await readJson(GEMINI_SETTINGS);
  if (!settings) return results;

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
      detectedBy: 'gemini-cli',
      ...(sourceHint ? { sourceHint } : {}),
    });
  }

  return results;
}
