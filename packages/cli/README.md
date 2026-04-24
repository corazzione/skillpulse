# @skillpulse/cli

CLI for the [SkillPulse](https://github.com/corazzione/skillpulse) registry. Share what you use, discover what's trending.

## Install

```bash
npm install -g @skillpulse/cli
# or use npx for one-off
npx @skillpulse/cli discover
```

## Commands

### `skillpulse share`
Scans your `~/.claude/settings.json` MCPs, `~/.claude/skills/`, and `~/.claude/plugins/` and submits them anonymously to the SkillPulse registry. Helps grow the registry for everyone.

**Privacy:** Only names and public URLs are shared. Never keys, tokens, or file contents. Your user ID is a random hash — not your identity.

### `skillpulse discover [--top 20] [--category testing]`
Shows top-ranked skills in your terminal. Pipe `--json` for programmatic use.

### `skillpulse install <name>`
Installs a skill or MCP from npm/github.

## Claude Code Hook (Auto-Share)

Add to your `~/.claude/settings.json`:

```json
{
  "hooks": {
    "SessionStart": [
      { "hooks": [{ "type": "command", "command": "npx -y @skillpulse/cli share --silent" }] }
    ]
  }
}
```

This runs silently on Claude Code startup (throttled to once per 24h, no network calls until you explicitly consent via `skillpulse share` once).

## Privacy by design

- First run = explicit consent prompt; nothing is submitted without it
- Anonymous user ID (sha256 of randomness, 16 chars)
- No keys, tokens, or file contents ever leave your machine
- Opt-out anytime: delete `~/.skillpulse/config.json`

---

<sub>MC. ■ — Part of [SkillPulse](https://github.com/corazzione/skillpulse)</sub>
