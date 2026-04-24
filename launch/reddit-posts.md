# Reddit Launch Posts

## r/ClaudeAI — v1.1

**Title:** I built a crowdsourced registry of Claude Code skills & MCPs — every user is a contributor

After getting frustrated with awesome lists that go stale, I built SkillPulse. The twist: it updates from *two* directions.

**Automated side** — Scrapes 7 sources every 6h (GitHub, npm, PyPI, HN, Reddit, Anthropic MCP Registry, Tokrepo) and uses Claude Haiku to classify everything.

**Community side** — one command turns any Claude Code user into a contributor:

```bash
npx @skillpulse/cli share
```

It scans your `~/.claude/settings.json` MCPs and `~/.claude/skills/` directory, shows you what will be shared, and opens a pre-filled GitHub issue. The bot dedupes, Claude classifies, it shows up in the registry within 6h.

Or add a hook to auto-share silently on Claude Code startup.

**Privacy:** anonymous (random 16-char hash), names and public URLs only, never keys/tokens, first-run consent required, `rm -rf ~/.skillpulse` to opt out.

The idea is: the most valuable MCPs are the ones people actually keep installed, not the ones trending on Twitter. A registry should reflect that.

MIT licensed. Would love people to `skillpulse share` to kick-start the community dataset.

https://github.com/corazzione/skillpulse

---

## r/LocalLLaMA

**Title:** Auto-updating registry of MCP servers and AI agent tools — built with Claude + GitHub Actions

Built a self-updating registry that scrapes 7 sources every 6 hours and uses Claude Haiku to classify each entry. Covers MCP servers, Claude Code skills, Cursor plugins, Codex CLI tools, Gemini CLI skills, and more.

Tech: TypeScript monorepo, Octokit for GitHub API, Zod for AI output validation, Astro for the static site. All data is versioned JSON in the repo.

https://github.com/corazzione/skillpulse

---

## r/programming

**Title:** SkillPulse: auto-updating AI agent skill registry using GitHub Actions + Claude API

Instead of maintaining yet another awesome list by hand, I built a pipeline that does it automatically. Every 6 hours it: scrapes GitHub/npm/PyPI/HN/Reddit, classifies entries with Claude, computes a Pulse Score, and rebuilds the README + static site.

MIT licensed, fully open source. Fork it for your own niche.

https://github.com/corazzione/skillpulse
