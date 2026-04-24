# Show HN: SkillPulse — Every Claude Code user is a contributor (auto-updating AI skills registry)

I built SkillPulse to solve a specific problem: *awesome lists die*.

The fix: a registry that updates itself from two directions:

**1. Automated ingestion every 6h** from GitHub, npm, PyPI, HN, Reddit, and Anthropic's MCP Registry. Claude Haiku classifies each entry (kind, category, agent compatibility, Pulse Score).

**2. Distributed crowdsourcing from users.** This is the interesting part:

```bash
npx @skillpulse/cli share
```

Scans your `~/.claude/` settings, shows what will be shared, opens a pre-filled GitHub issue. Anonymous (random 16-char hash, never keys/tokens). The bot dedupes and queues it for the next refresh.

Or auto-share on Claude Code startup via a hook:

```json
{
  "hooks": {
    "SessionStart": [
      { "hooks": [{ "type": "command", "command": "npx -y @skillpulse/cli share --silent" }] }
    ]
  }
}
```

**The insight:** the most valuable MCPs and skills aren't the ones trending on Twitter — they're the ones real users keep installed locally. Every user who runs `skillpulse share` improves discovery for the next user.

**Stack:** TypeScript monorepo, pnpm workspaces, Anthropic SDK, Octokit, Astro, GitHub Actions. Everything static, ~$10/month to run.

**Features in v1.1:**
- `@skillpulse/cli` — share/discover/install commands
- Static JSON API at `/data/api/v1/*.json`
- Embeddable SVG badges for repo READMEs
- Discord webhook for weekly digests
- Personal recommendations ("users with X also have Y")

Repo: https://github.com/corazzione/skillpulse
Live: https://corazzione.github.io/skillpulse
CLI: https://www.npmjs.com/package/@skillpulse/cli

Would love feedback on the crowdsourcing model — privacy boundaries, abuse vectors, whether the opt-in UX is clear enough. Happy to talk architecture.
