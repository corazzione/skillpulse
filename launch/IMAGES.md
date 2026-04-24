# Launch Images — Capture Guide

4 images cover every channel. Capture once, reuse everywhere.

---

## Image 1 — Hero Site Screenshot ⭐ (most important)

**URL:** https://corazzione.github.io/skillpulse/
**Viewport:** 1440×900 (desktop, clean)
**Must show:**
- "SkillPulse" wordmark with orange accent square
- Tagline "The living registry of AI agent skills, MCPs, and prompts"
- The "Works with 🤖 Claude Code · 🎯 Cursor · 🌊 Windsurf · 💻 Codex CLI · ✨ Gemini CLI" line
- "Browse All 33 Skills" CTA button
- First row of the Top Trending grid (context7, playwright-mcp, fastmcp visible)

**Used in:** r/ClaudeAI, r/cursor, r/LocalLLaMA, r/programming, Twitter T1, Product Hunt gallery slot 1

**Capture:** Firefox / Chrome devtools → responsive mode → 1440×900 → screenshot full viewport. Crop if header area has empty space.

---

## Image 2 — Stats Page "By Agent" Chart

**URL:** https://corazzione.github.io/skillpulse/stats/
**Viewport:** 1440×900
**Must show:**
- "Ecosystem Stats" header with total count
- "By Kind" bar chart (orange bars, MCP/skill/cli-tool/prompt-pack)
- "By Agent" bar chart immediately below (this is the key v1.2 visual — shows multi-IDE support is real)

**Used in:** r/cursor (leads with "yes, Cursor is supported"), Twitter T3, HN post comment

**Crop:** Just the stats cards + first two bar chart sections. Drop "Top Categories" below the fold.

---

## Image 3 — CLI Terminal Screenshot

**Command to run:** `npx @skillpulse/cli share --dry-run` on your real machine
**Terminal:** Dark theme, Space Mono / JetBrains Mono, 100-col wide
**Must show:**
- The consent banner / "Found 27 MCPs across [Claude Code, Cursor, Windsurf]" line
- A few entries listed with `[claude-code]`, `[cursor]`, `[windsurf]` tags next to them
- The final "ready to share anonymously?" prompt

**Used in:** r/ClaudeAI (proves "this actually works"), Twitter T1 or T5, Product Hunt gallery slot 2

**Capture:** Windows Terminal / iTerm → maximize → screenshot → crop to the command + output block. If output is ugly on Windows, grab from a Mac/Linux shell where glyphs render clean.

**Bonus (optional):** Record a 10-second GIF with [asciinema](https://asciinema.org) + [agg](https://github.com/asciinema/agg) — higher engagement than a static image on Twitter.

---

## Image 4 — README Ranking Table

**Source:** https://github.com/corazzione/skillpulse (top of README)
**Must show:**
- The "Top 20 Trending This Week" table header
- First 5-8 rows with emoji kind, pulse scores, trend arrows
- The "Last updated" timestamp line above it

**Used in:** r/programming (devs love a live-updated README), Twitter T6, HN post, Product Hunt description

**Capture:** GitHub dark mode → screenshot of the table section only. Keep it narrow so it's readable in Reddit's inline preview.

---

## Per-channel cheat sheet

| Channel | Image 1 | Image 2 | Image 3 | Image 4 |
|---|---|---|---|---|
| r/ClaudeAI | ✅ hero | — | ✅ CLI | — |
| r/cursor | — | ✅ stats (leads) | ✅ CLI | — |
| r/LocalLLaMA | ✅ hero | — | — | ✅ README |
| r/programming | ✅ hero | — | — | ✅ README |
| r/OpenAI (Codex angle) | ✅ hero | ✅ stats | — | — |
| r/LLMDevs | ✅ hero | ✅ stats | ✅ CLI | — |
| Twitter thread | T1 hero | T3 stats | T5 CLI | T6 README |
| Hacker News | — | — | — | — (text-only) |
| Product Hunt | slot 1 hero | slot 3 stats | slot 2 CLI | slot 4 README |

---

## Rules of thumb

- **No logos/branding overlays** on top of screenshots. Reddit/HN audiences distrust marketing polish.
- **Dark theme everywhere.** Site is already dark (#0F0F0F). Terminal should match.
- **Show real data, not mockups.** The 33 seed entries are all real MCPs — that's the point.
- **Keep text readable at 2× Reddit inline size** (~600px wide). Don't capture full 4K if content is small.
- **PNG for screenshots, GIF for CLI demo.** JPEG will blur the terminal glyphs.

---

## After capture

Drop the 4 PNGs in `launch/img/`:
- `launch/img/01-hero.png`
- `launch/img/02-stats.png`
- `launch/img/03-cli.png` (or `.gif`)
- `launch/img/04-readme.png`

Reference them in the launch markdown files via `![hero](img/01-hero.png)` so future-you can regenerate posts without redoing image work.
