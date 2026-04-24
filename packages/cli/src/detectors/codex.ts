import { readFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import type { DetectedEntry } from './index.js';

const CODEX_CONFIG = join(homedir(), '.codex', 'config.toml');

/**
 * Minimal TOML parser for [section.name] tables + key = "value" lines.
 * No external deps. Only parses what Codex CLI config.toml uses for MCP servers.
 *
 * Handles:
 *   [mcp_servers.my-server]
 *   command = "npx"
 *   args = ["-y", "@some/mcp"]
 */
function parseMcpServersFromToml(
  toml: string,
): Record<string, { command?: string; url?: string; args?: string[] }> {
  const servers: Record<string, { command?: string; url?: string; args?: string[] }> = {};
  let currentSection: string | null = null;

  for (const rawLine of toml.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    // Section header: [mcp_servers.name] or [mcp_servers."name"]
    const sectionMatch = line.match(/^\[mcp_servers\.["']?([^"'\]]+)["']?\]$/);
    if (sectionMatch) {
      currentSection = sectionMatch[1]?.trim() ?? null;
      if (currentSection) {
        servers[currentSection] = {};
      }
      continue;
    }

    // Non-mcp_servers section — stop tracking
    if (line.startsWith('[') && !line.startsWith('[mcp_servers.')) {
      currentSection = null;
      continue;
    }

    if (!currentSection) continue;

    // key = "value"
    const kvMatch = line.match(/^(\w+)\s*=\s*"([^"]*)"$/);
    if (kvMatch) {
      const key = kvMatch[1];
      const value = kvMatch[2] ?? '';
      const server = servers[currentSection];
      if (server && key === 'command') server.command = value;
      if (server && key === 'url') server.url = value;
      continue;
    }

    // args = ["-y", "@some/mcp"] — extract string elements
    const argsMatch = line.match(/^args\s*=\s*\[([^\]]*)\]$/);
    if (argsMatch) {
      const server = servers[currentSection];
      if (server) {
        const inner = argsMatch[1] ?? '';
        server.args = [...inner.matchAll(/"([^"]*)"/g)].map((m) => m[1] ?? '');
      }
    }
  }

  return servers;
}

export async function detect(): Promise<DetectedEntry[]> {
  const results: DetectedEntry[] = [];

  let tomlContent: string;
  try {
    tomlContent = await readFile(CODEX_CONFIG, 'utf-8');
  } catch {
    return results;
  }

  try {
    const servers = parseMcpServersFromToml(tomlContent);
    for (const [name, config] of Object.entries(servers)) {
      const sourceHint =
        config.url ?? config.args?.find((a) => a.startsWith('http') || a.startsWith('@'));
      results.push({
        name,
        kind: 'mcp-server',
        detectedBy: 'codex-cli',
        ...(sourceHint ? { sourceHint } : {}),
      });
    }
  } catch {
    // defensive — malformed TOML
  }

  return results;
}
