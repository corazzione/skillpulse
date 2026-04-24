# Frequently Asked Questions

## Why not use existing awesome lists?

Awesome lists are manually curated and go stale when the maintainer loses interest. SkillPulse is fully automated — it discovers, classifies, and ranks entries every 6 hours with no human bottleneck.

## How accurate is the AI classification?

Classifications use Claude Haiku with confidence scoring. Entries with confidence < 0.7 escalate to Claude Sonnet. All outputs are validated by a Zod schema. In practice, accuracy exceeds 90% for well-documented packages.

## How much does it cost to run?

Approximately **$5–20/month** running 24/7 at 6h cadence, thanks to 7-day classification caching. Most re-runs cost < $0.20. The monthly budget guard (default $50) protects against runaway costs.

## Can I fork this for another niche?

Yes! SkillPulse is MIT licensed. Fork it and adapt the ingestors for your niche (Cursor rules, VS Code extensions, LangChain tools, etc.). The architecture is designed to be modular.

## How do I submit a skill?

Open an issue using the [Submit a Skill template](https://github.com/corazzione/skillpulse/issues/new?template=submit-skill.yml). The bot validates and queues it automatically.

## How long until my submission appears?

Within 6 hours (the next refresh cycle). You'll get a comment on your issue when it's processed.

## Why TypeScript/pnpm instead of Python?

GitHub Actions runners are fast with Node 20. TypeScript gives type safety across the whole pipeline. pnpm's workspace protocol makes monorepo dependency management clean.

## Is the data reliable?

All data is sourced from official APIs (GitHub, npm, PyPI) and committed to the repo with full history. You can audit every change with `git log`.
