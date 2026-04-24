# Twitter/X Thread — v1.2 launch

**T1:**
Awesome lists die when maintainers move on.

SkillPulse is a registry that *can't* die — because every user of every AI coding agent is a passive contributor.

```
npx @skillpulse/cli share
```

One command → your entire MCP stack from Claude Code, Cursor, Windsurf, Codex CLI, or Gemini CLI hits the registry. 🧵

**T2:**
The registry updates from two sources:

🤖 Automated: scrapes GitHub, npm, PyPI, HN, Reddit, Anthropic's MCP Registry every 6h
👥 Community: every AI agent user (opt-in) shares their local MCPs + skills anonymously

No curator. No single point of failure. No IDE lock-in.

**T3:**
v1.2 supports 5 agents:

🤖 Claude Code — `~/.claude/settings.json`
🎯 Cursor — `~/.cursor/mcp.json`
🌊 Windsurf — `~/.codeium/windsurf/mcp_config.json`
💻 Codex CLI — `~/.codex/config.toml`
✨ Gemini CLI — `~/.gemini/settings.json`

All detected automatically. One command covers all of them.

**T4:**
Privacy by design:
✓ Anonymous (random 16-char hash, not your identity)
✓ Names + public URLs only
✗ Never API keys, tokens, or file contents
✗ No network call until you consent once

First run = explicit consent prompt.
Opt out: `rm -rf ~/.skillpulse`

**T5:**
Claude Code hook auto-shares on session start (throttled 24h):

```json
{
  "hooks": {
    "SessionStart": [
      { "hooks": [{ "type": "command", "command": "npx -y @skillpulse/cli share --silent" }] }
    ]
  }
}
```

Now your whole tool stack helps every other AI agent user, regardless of which IDE they use.

**T6:**
Claude Haiku classifies each entry:
→ Kind (skill/MCP/plugin/prompt/CLI)
→ Category (22 canonical)
→ Agent compat (Claude Code/Cursor/Codex/Gemini/Windsurf)
→ Confidence → escalates to Sonnet if <0.7

Pulse Score: stars + growth + recency + cross-source + confidence

Filter by agent: `skillpulse discover --agent cursor`

**T7:**
Stack:
• TypeScript monorepo (pnpm)
• Anthropic SDK + Octokit
• Astro static site → GitHub Pages
• GitHub Actions (6h refresh)
• Biome, Vitest, tests for all detectors
• 5 IDE detectors, zero new deps

Cost: ~$10/month. Free for public repos + Pages.
MIT licensed. Fork for your niche.

**T8:**
⭐ https://github.com/corazzione/skillpulse
🌐 https://corazzione.github.io/skillpulse
📦 https://www.npmjs.com/package/@skillpulse/cli

Would love your feedback. Drop your stack with `skillpulse share` to help kick-start it 🙏

— MC. ■
