# Twitter/X Launch Thread

**Tweet 1:**
Awesome lists die. They're maintained by humans who eventually move on.

I built SkillPulse — an auto-updating registry of Claude Code skills, MCP servers, and AI agent tools.

Refreshed every 6h. No curator bottleneck.

**Tweet 2:**
It scrapes 7 sources automatically:
- GitHub (topics: claude-code, mcp-server, agent-skill)
- npm (keywords: claude-skill, mcp-server)
- PyPI
- Anthropic's official MCP Registry
- Hacker News (last 7 days)
- Reddit (r/ClaudeAI, r/LocalLLaMA, r/mcp)

**Tweet 3:**
Claude Haiku classifies each entry:
→ Kind (skill / MCP server / plugin / prompt pack / CLI)
→ Category (22 canonical options)
→ Agent compatibility (Claude Code / Cursor / Codex / Gemini / Windsurf)
→ Confidence score

Low-confidence? Escalates to Sonnet automatically.

**Tweet 4:**
Each entry gets a Pulse Score (0–100):
- 30% stars (log scale)
- 25% growth rate (week-over-week)
- 20% recency boost
- 15% cross-source bonus
- 10% AI confidence

Trend: new / rising / stable / declining

**Tweet 5:**
Submit a skill via GitHub issue → bot validates the URL → queues it → next 6h run classifies it → issue auto-closes.

Zero manual review needed.

**Tweet 6:**
Stack: TypeScript, pnpm monorepo, Anthropic SDK, Octokit, Astro, GitHub Actions.

Cost: ~$10/month (7-day classification cache cuts API calls by 80%).

MIT licensed. Fork it for your niche.

https://github.com/corazzione/skillpulse
https://corazzione.github.io/skillpulse

**Tweet 7 (if trending):**
Wow this blew up. A few things people asked about:

Q: Why not [existing list]?
A: Lists die. This doesn't.

Q: How accurate is the AI?
A: >90% on well-documented packages. All outputs zod-validated.

Q: Can I fork it?
A: Yes, MIT license, that's the point.
