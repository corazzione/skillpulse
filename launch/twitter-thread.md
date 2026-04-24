# Twitter/X Thread — v1.1 launch

**T1:**
Awesome lists die when maintainers move on.

SkillPulse is a registry that *can't* die — because every user is a passive contributor.

```
npx @skillpulse/cli share
```

One command → you just added your entire MCP stack to the registry. 🧵

**T2:**
The registry updates from two sources:

🤖 Automated: scrapes GitHub, npm, PyPI, HN, Reddit, Anthropic's MCP Registry every 6h
👥 Community: every Claude Code user (opt-in) shares their local MCPs + skills anonymously

No curator. No single point of failure.

**T3:**
Privacy by design:
✓ Anonymous (random 16-char hash, not your identity)
✓ Names + public URLs only
✗ Never API keys, tokens, or file contents
✗ No network call until you consent once

First run = explicit consent prompt.
Opt out: `rm -rf ~/.skillpulse`

**T4:**
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

Now your tool stack helps every other Claude Code user.

**T5:**
Claude Haiku classifies each entry:
→ Kind (skill/MCP/plugin/prompt/CLI)
→ Category (22 canonical)
→ Agent compat (Claude Code/Cursor/Codex/Gemini/Windsurf)
→ Confidence → escalates to Sonnet if <0.7

Pulse Score: stars + growth + recency + cross-source + confidence

**T6:**
Stack:
• TypeScript monorepo (pnpm)
• Anthropic SDK + Octokit
• Astro static site → GitHub Pages
• GitHub Actions (6h refresh)
• Biome, Vitest, 30+ tests

Cost: ~$10/month. Free for public repos + Pages.
MIT licensed. Fork for your niche.

**T7:**
⭐ https://github.com/corazzione/skillpulse
🌐 https://corazzione.github.io/skillpulse
📦 https://www.npmjs.com/package/@skillpulse/cli

Would love your feedback. Drop your stack with `skillpulse share` to help kick-start it 🙏

— MC. ■
