# Reddit Launch Posts

## r/ClaudeAI

**Title:** I built an auto-updating registry of Claude Code skills and MCP servers

I got frustrated with awesome lists going stale, so I built SkillPulse — an automated pipeline that scrapes GitHub, npm, PyPI, HN, Reddit, and the Anthropic MCP Registry every 6 hours and uses Claude to classify everything.

It tracks Claude Code skills, MCP servers, plugins, prompt packs, and CLI tools. You can browse by category or agent compatibility, and submit new entries via GitHub issue (the bot handles it automatically).

The whole thing runs on GitHub Actions — zero infra, ~$10/month in Anthropic API costs.

Repo: https://github.com/corazzione/skillpulse
Site: https://corazzione.github.io/skillpulse

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
