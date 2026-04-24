# Ready-to-Post Reddit Pack

Open each subreddit link below, paste the title + body, attach the image, submit.
All copy is polished and final. Images live in `launch/img/`.

Order of posting (best to last):
1. r/ClaudeAI — natural audience, highest engagement
2. r/cursor — 24-48h gap, leads with "Cursor supported"
3. r/LocalLLaMA — same-day OK after r/cursor
4. r/LLMDevs — 24h gap
5. r/OpenAI — position as "Codex CLI compatible"
6. r/programming — last (strictest mods; only if momentum is good)

**Spacing:** Reddit shadow-bans spam. Minimum 6h between posts, different subreddits only. Never cross-post the same title.

---

## 1 · r/ClaudeAI  🚀 post first

**URL:** https://www.reddit.com/r/ClaudeAI/submit?type=LINK  (then switch to "Images & Video" tab if image attached, or "Text" for a link-less post)
**Flair:** `Built with Claude` or `Showcase` (pick whichever is available)
**Image:** `launch/img/01-hero.png`

**Title** (86 chars, under the 300 limit):
```
I built a crowdsourced registry of MCPs and skills that works with every major AI coding agent
```

**Body:**
```
After getting frustrated with awesome lists that go stale, I built SkillPulse. The twist: it updates from *two* directions — automated scraping + every user of every AI coding agent is a passive contributor.

**Automated side** — Scrapes 7 sources every 6h (GitHub, npm, PyPI, HN, Reddit, Anthropic MCP Registry, Tokrepo) and uses Claude Haiku to classify everything.

**Community side** — one command turns any AI agent user into a contributor:

    npx @skillpulse/cli share

It scans your local MCP configs and skills across 5 IDEs, shows you what will be shared, and opens a pre-filled GitHub issue. The bot dedupes, Claude classifies, it shows up in the registry within 6h.

Supported agents:

- 🤖 **Claude Code** — `~/.claude/settings.json` + skills/ + plugins/
- 🎯 **Cursor** — `~/.cursor/mcp.json` + rules/
- 🌊 **Windsurf** — `~/.codeium/windsurf/mcp_config.json` + memories/
- 💻 **Codex CLI** — `~/.codex/config.toml`
- ✨ **Gemini CLI** — `~/.gemini/settings.json`

Or add a Claude Code hook to auto-share silently on session start.

**Privacy by design:** anonymous 16-char hash, names and public URLs only, never keys or tokens, first-run consent required, `rm -rf ~/.skillpulse` to opt out.

The idea: the most valuable MCPs are the ones people actually keep installed, not the ones trending on Twitter. A registry should reflect real usage across every agentic IDE.

MIT licensed. Would love people to `skillpulse share` to kick-start the community dataset.

🌐 https://corazzione.github.io/skillpulse
⭐ https://github.com/corazzione/skillpulse
```

---

## 2 · r/cursor

**URL:** https://www.reddit.com/r/cursor/submit
**Flair:** `Showcase` or `Tool`
**Image:** `launch/img/02-stats.png`  ← leads with proof that Cursor is first-class

**Title:**
```
Built a crowdsourced MCP/skills registry — full Cursor support, not just a Claude-only thing
```

**Body:**
```
Every discovery tool for MCP servers feels Claude-first. I built SkillPulse to actually treat Cursor as a first-class citizen: the CLI detects your `~/.cursor/mcp.json` + `~/.cursor/rules/` and contributes them (anonymously, with consent) so Cursor users push the ecosystem forward just by using it.

The "By Agent" chart on the stats page shows what's actually compatible with Cursor specifically — not aspirational, based on real configs scanned from real setups.

How it works:

- Scrapes 7 sources every 6h and uses Claude Haiku to classify (kind, category, agent compat)
- `npx @skillpulse/cli share` detects your MCPs + rules and opens a pre-filled GitHub issue
- Filter: `skillpulse discover --agent cursor` → only shows Cursor-compatible entries
- Pulse Score ranks by stars + growth + recency + cross-source + real install count

Privacy: anonymous hash, no keys, no file contents, opt-out with one command.

Open source, MIT. Fork for your own niche.

🌐 https://corazzione.github.io/skillpulse
⭐ https://github.com/corazzione/skillpulse
```

---

## 3 · r/LocalLLaMA

**URL:** https://www.reddit.com/r/LocalLLaMA/submit
**Flair:** `Resources` or `Tool`
**Image:** `launch/img/01-hero.png`

**Title:**
```
Self-updating registry of MCP servers + agent tools (scrapes 7 sources / 6h, classified by Claude Haiku)
```

**Body:**
```
Built a registry that auto-scrapes GitHub, npm, PyPI, HN, Reddit, Anthropic's MCP Registry, and Tokrepo every 6 hours. Claude Haiku classifies each entry into kind (skill/MCP/plugin/prompt/CLI), 22 canonical categories, and agent compat.

v1.2 adds local-config detection for 5 agentic IDEs — Claude Code, Cursor, Windsurf, Codex CLI, Gemini CLI — so users can contribute their setups anonymously in one command.

Pulse Score = 0.3·stars + 0.25·growth + 0.2·recency + 0.15·cross-source + 0.1·classification confidence. Cost ~$10/month on Haiku + free GitHub Actions.

Stack: TypeScript monorepo, Zod for AI output validation, Octokit, Astro static site, no database (all versioned JSON).

    npx @skillpulse/cli share     # contribute your stack (opt-in, anonymous)
    npx @skillpulse/cli discover  # browse the registry

⭐ https://github.com/corazzione/skillpulse
🌐 https://corazzione.github.io/skillpulse

MIT. Fork it for your niche (Ollama-specific registry? Local-model registry?).
```

---

## 4 · r/LLMDevs

**URL:** https://www.reddit.com/r/LLMDevs/submit
**Flair:** `Resource` or `Tools`
**Image:** `launch/img/02-stats.png`

**Title:**
```
Auto-updating MCP registry with AI classification + crowdsourced install telemetry (open source)
```

**Body:**
```
Problem: awesome-lists rot. npm trending is gamed. GitHub stars are vanity.
What we actually want: "which MCPs do people keep installed after the honeymoon phase?"

SkillPulse collects that signal. Two inputs:

1. Automated — 7 sources scraped every 6h, each entry classified by Claude Haiku (tool_use + Zod schema, escalates to Sonnet if confidence < 0.7)
2. Community — `npx @skillpulse/cli share` scans user's local IDE configs (Claude Code / Cursor / Windsurf / Codex / Gemini) and opens a pre-filled anonymous issue; bot aggregates these as real install signals

No database. All data lives as versioned JSON in the repo. Site is static (Astro → Pages). Whole pipeline costs ~$10/mo in Anthropic tokens.

Pulse Score formula: stars (30%) + 30-day growth (25%) + recency (20%) + cross-source (15%) + classification confidence (10%). v1.3 will add install count as a 6th factor.

Open source, MIT. Built as a reference architecture for "scraper + LLM classifier + static site + telemetry loop" that any vertical could fork.

⭐ https://github.com/corazzione/skillpulse
🌐 https://corazzione.github.io/skillpulse
```

---

## 5 · r/OpenAI

**URL:** https://www.reddit.com/r/OpenAI/submit
**Flair:** `Project` or `Discussion`
**Image:** `launch/img/01-hero.png`

**Title:**
```
Open source MCP/skills registry — Codex CLI is supported alongside Cursor / Claude Code / Gemini / Windsurf
```

**Body:**
```
If you're using Codex CLI and want to see what MCPs and tools other devs are actually running, SkillPulse is an auto-updating registry that treats Codex as a first-class citizen. The CLI detects your `~/.codex/config.toml` and contributes it anonymously to the community dataset.

`skillpulse discover --agent codex-cli` → Codex-compatible entries only.

Refreshes every 6h. Classification by Claude Haiku. Pulse Score ranks by stars + growth + recency + cross-source signal + real install count.

All data versioned in the repo. No tracking beyond anonymous install signals (consent required).

⭐ https://github.com/corazzione/skillpulse
🌐 https://corazzione.github.io/skillpulse

MIT. Fork welcome.
```

---

## 6 · r/programming (last — strictest)

**URL:** https://www.reddit.com/r/programming/submit
**Flair:** none (r/programming doesn't use flairs)
**Image:** `launch/img/04-readme.png` (READMEs resonate here)
**Mod caveat:** r/programming auto-removes posts perceived as self-promo. Post the **GitHub link only**, no body — community expands it. If you must add a body, frame it as "what I learned building X" not "what I built".

**Title:**
```
SkillPulse: auto-updating AI agent registry (TypeScript, Astro, GitHub Actions as a pipeline)
```

**Body (optional):** Leave blank — let the repo README do the talking.

Link: `https://github.com/corazzione/skillpulse`

---

## Post-submit checklist (per post)

- [ ] Verify image rendered inline, not as attachment
- [ ] Reply to first 3 comments within 30min (Reddit boosts posts with engagement)
- [ ] Don't reply with "thanks!" — respond with content (answer questions, share implementation detail)
- [ ] Do NOT upvote your own post from a second account
- [ ] Do NOT post the same link in the comments of other posts ("check out my tool!")
- [ ] After 24h, cross-post to r/selfhosted (wait 24h) and r/opensource if traction is good

## If a post gets removed

1. Read the removal reason in modmail
2. Most common: "self-promotion ratio" — comment more on other posts in that sub, re-submit in 7 days
3. Never argue with mods. Message politely asking what would make it acceptable.
4. r/programming removes anything perceived as marketing. If removed there, don't retry; post to r/webdev or r/coolgithubprojects instead.
