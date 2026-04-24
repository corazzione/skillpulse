# Reddit Launch Posts

## r/ClaudeAI — v1.2

**Title:** I built a crowdsourced registry that works with every major AI coding agent — Claude Code, Cursor, Windsurf, Codex CLI, Gemini CLI

After getting frustrated with awesome lists that go stale, I built SkillPulse. The twist: it updates from *two* directions — and now from *five* different AI coding agents.

**Automated side** — Scrapes 7 sources every 6h (GitHub, npm, PyPI, HN, Reddit, Anthropic MCP Registry, Tokrepo) and uses Claude Haiku to classify everything.

**Community side** — one command turns any AI agent user into a contributor:

```bash
npx @skillpulse/cli share
```

It scans your local MCP configs and skills across all five supported IDEs, shows you what will be shared, and opens a pre-filled GitHub issue. The bot dedupes, Claude classifies, it shows up in the registry within 6h.

Supported agents:
- 🤖 **Claude Code** — `~/.claude/settings.json` mcpServers + `~/.claude/skills/` + `~/.claude/plugins/`
- 🎯 **Cursor** — `~/.cursor/mcp.json` mcpServers + `~/.cursor/rules/`
- 🌊 **Windsurf** — `~/.codeium/windsurf/mcp_config.json` + `~/.codeium/windsurf/memories/`
- 💻 **Codex CLI** — `~/.codex/config.toml` [mcp_servers.*] tables
- ✨ **Gemini CLI** — `~/.gemini/settings.json` mcpServers

Or add a hook to auto-share silently on startup.

**Privacy:** anonymous (random 16-char hash), names and public URLs only, never keys/tokens, first-run consent required, `rm -rf ~/.skillpulse` to opt out.

The idea is: the most valuable MCPs are the ones people actually keep installed, not the ones trending on Twitter. A registry should reflect actual usage across *every* agentic IDE.

MIT licensed. Would love people to `skillpulse share` to kick-start the community dataset.

https://github.com/corazzione/skillpulse

---

## r/LocalLLaMA

**Title:** Auto-updating registry of MCP servers and AI agent tools — works with Claude Code, Cursor, Windsurf, Codex CLI, Gemini CLI

Built a self-updating registry that scrapes 7 sources every 6 hours and uses Claude Haiku to classify each entry. Covers MCP servers, Claude Code skills, Cursor plugins, Codex CLI tools, Gemini CLI skills, and more.

v1.2 now detects your local MCP/skill configs from all 5 major agentic IDEs and contributes them anonymously with one command: `npx @skillpulse/cli share`

Tech: TypeScript monorepo, Octokit for GitHub API, Zod for AI output validation, Astro for the static site. All data is versioned JSON in the repo.

https://github.com/corazzione/skillpulse

---

## r/programming

**Title:** SkillPulse v1.2: auto-updating AI agent skill registry now supporting 5 IDEs (Claude Code, Cursor, Windsurf, Codex CLI, Gemini CLI)

Instead of maintaining yet another awesome list by hand, I built a pipeline that does it automatically. Every 6 hours it: scrapes GitHub/npm/PyPI/HN/Reddit, classifies entries with Claude, computes a Pulse Score, and rebuilds the README + static site.

The community contribution flywheel now works across every major AI coding agent — every IDE user is a potential contributor.

MIT licensed, fully open source. Fork it for your own niche.

https://github.com/corazzione/skillpulse
