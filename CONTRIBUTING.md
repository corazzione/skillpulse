# Contributing to SkillPulse

## How to Submit a Skill

Use the [Submit a Skill issue template](https://github.com/corazzione/skillpulse/issues/new?template=submit-skill.yml). The bot will validate and queue your submission automatically.

## How the Bot Works

1. You open an issue using the submission template
2. The bot validates the URL and checks for duplicates
3. If valid, your submission is queued for the next 6-hour refresh cycle
4. Once ingested and classified, the issue closes automatically

## Local Dev Setup

### Prerequisites
- Node.js 20+
- pnpm 9+

### Setup

```bash
git clone https://github.com/corazzione/skillpulse.git
cd skillpulse
pnpm install
pnpm lint
pnpm -r typecheck
pnpm -r test
```

### Environment Variables

Copy `.env.example` to `.env.local` (gitignored):

```
GITHUB_TOKEN=your_github_pat
ANTHROPIC_API_KEY=your_anthropic_key
```

## Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for the full architecture overview.
