import { beforeEach, describe, expect, it, vi } from 'vitest';

// ---------------------------------------------------------------------------
// Helpers — mock node:fs and node:fs/promises so no real FS is touched
// ---------------------------------------------------------------------------

vi.mock('node:fs', () => ({
  existsSync: vi.fn(() => false),
}));

vi.mock('node:fs/promises', () => ({
  readFile: vi.fn(async () => {
    throw new Error('ENOENT');
  }),
  readdir: vi.fn(async () => []),
  stat: vi.fn(async () => ({ isDirectory: () => false, isFile: () => false })),
  mkdir: vi.fn(async () => undefined),
  writeFile: vi.fn(async () => undefined),
}));

// Re-import after mocking
const { detect: detectClaude } = await import('../detectors/claude.js');
const { detect: detectCursor } = await import('../detectors/cursor.js');
const { detect: detectWindsurf } = await import('../detectors/windsurf.js');
const { detect: detectCodex } = await import('../detectors/codex.js');
const { detect: detectGemini } = await import('../detectors/gemini.js');

describe('detectors — absent config returns []', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('claude: returns [] when ~/.claude/settings.json is absent', async () => {
    const results = await detectClaude();
    expect(Array.isArray(results)).toBe(true);
    expect(results).toHaveLength(0);
  });

  it('cursor: returns [] when ~/.cursor/mcp.json is absent', async () => {
    const results = await detectCursor();
    expect(Array.isArray(results)).toBe(true);
    expect(results).toHaveLength(0);
  });

  it('windsurf: returns [] when mcp_config.json is absent', async () => {
    const results = await detectWindsurf();
    expect(Array.isArray(results)).toBe(true);
    expect(results).toHaveLength(0);
  });

  it('codex: returns [] when ~/.codex/config.toml is absent', async () => {
    const results = await detectCodex();
    expect(Array.isArray(results)).toBe(true);
    expect(results).toHaveLength(0);
  });

  it('gemini: returns [] when ~/.gemini/settings.json is absent', async () => {
    const results = await detectGemini();
    expect(Array.isArray(results)).toBe(true);
    expect(results).toHaveLength(0);
  });
});

describe('codex TOML parser — inline unit', () => {
  it('parseMcpServersFromToml handles valid TOML section', async () => {
    // Test the TOML parser directly via a stub that returns real content
    const { readFile } = await import('node:fs/promises');
    vi.mocked(readFile).mockResolvedValueOnce(
      `
[mcp_servers.my-server]
command = "npx"
args = ["-y", "@some/mcp-server"]
` as never,
    );

    const results = await detectCodex();
    expect(results).toHaveLength(1);
    expect(results[0]?.name).toBe('my-server');
    expect(results[0]?.kind).toBe('mcp-server');
    expect(results[0]?.detectedBy).toBe('codex-cli');
    expect(results[0]?.sourceHint).toBe('@some/mcp-server');
  });

  it('parseMcpServersFromToml returns [] for empty TOML', async () => {
    const { readFile } = await import('node:fs/promises');
    vi.mocked(readFile).mockResolvedValueOnce('' as never);

    const results = await detectCodex();
    expect(results).toHaveLength(0);
  });
});

describe('cursor detector — inline unit', () => {
  it('returns mcp-server entries from mcp.json', async () => {
    const { readFile } = await import('node:fs/promises');
    vi.mocked(readFile).mockResolvedValueOnce(
      JSON.stringify({
        mcpServers: {
          'my-cursor-mcp': { command: 'npx', args: ['-y', '@cursor/mcp'] },
        },
      }) as never,
    );

    const results = await detectCursor();
    expect(results).toHaveLength(1);
    expect(results[0]?.name).toBe('my-cursor-mcp');
    expect(results[0]?.detectedBy).toBe('cursor');
    expect(results[0]?.kind).toBe('mcp-server');
  });
});

describe('gemini detector — inline unit', () => {
  it('returns mcp-server entries from settings.json', async () => {
    const { readFile } = await import('node:fs/promises');
    vi.mocked(readFile).mockResolvedValueOnce(
      JSON.stringify({
        mcpServers: {
          'gemini-mcp': { url: 'https://example.com/mcp' },
        },
      }) as never,
    );

    const results = await detectGemini();
    expect(results).toHaveLength(1);
    expect(results[0]?.name).toBe('gemini-mcp');
    expect(results[0]?.detectedBy).toBe('gemini-cli');
    expect(results[0]?.sourceHint).toBe('https://example.com/mcp');
  });
});
