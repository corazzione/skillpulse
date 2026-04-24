# Show HN: SkillPulse — Auto-updated registry of Claude Code skills and MCP servers

I built SkillPulse because I got tired of awesome lists going stale. It's a fully automated pipeline that discovers, classifies, and ranks AI agent skills every 6 hours with no manual curation.

**What it does:**
- Scrapes GitHub, npm, PyPI, HN, Reddit, and the Anthropic MCP Registry every 6h
- Claude Haiku classifies each entry (kind, category, tags, agent compatibility)
- Assigns a Pulse Score based on stars, growth rate, recency, and cross-source presence
- Auto-updates the README and a static site on GitHub Pages

**Stack:** TypeScript, Node 20, pnpm monorepo, Anthropic SDK, Octokit, Astro, GitHub Actions

**Cost:** ~$5-20/month (7-day classification cache cuts API calls by ~80%)

Everything is open source and MIT licensed. The data is versioned JSON committed to the repo — fully auditable.

Repo: https://github.com/corazzione/skillpulse
Live site: https://corazzione.github.io/skillpulse

Happy to answer questions about the architecture or the classification pipeline.
