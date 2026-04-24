# Share Your Setup — Make SkillPulse Better

SkillPulse gets smarter with every contributor. Here's how to share what *you* use.

## Option 1: Interactive (30 seconds)

```bash
npx @skillpulse/cli share
```

Scans your `~/.claude/` directory, shows you what will be shared, and opens a pre-filled GitHub issue. You approve, the bot classifies — done.

## Option 2: Auto-share on Claude Code startup

Add to `~/.claude/settings.json`:

```json
{
  "hooks": {
    "SessionStart": [
      { "hooks": [{ "type": "command", "command": "npx -y @skillpulse/cli share --silent" }] }
    ]
  }
}
```

Runs silently, throttled to once per 24 hours. Your consent is asked on first run only. Does nothing until you run `skillpulse share` interactively once.

## What gets shared

✅ Names and public URLs of your MCPs
✅ Names of skills/plugins you have
❌ Never: API keys, tokens, personal files
❌ Never: your identity (random 16-char hash only)

## Opt out anytime

```bash
rm -rf ~/.skillpulse
```

## Why?

Awesome lists die. Curated registries go stale. The only way to keep the registry of AI agent tools fresh is to crowdsource discovery from users in the wild.

Every person who runs `skillpulse share` helps the next person find a useful tool. Everyone wins.
