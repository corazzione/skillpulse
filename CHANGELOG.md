# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2026-04-24

### Added — Growth Layer
- **`@skillpulse/cli`** npm package: `share`, `discover`, `install` commands
- **Distributed contribution**: Claude Code users can share local MCPs/skills anonymously via `npx @skillpulse/cli share`
- **Claude Code hook**: one-line addition to `~/.claude/settings.json` enables silent auto-share on session start (throttled 24h, consent required first run)
- **Telemetry issue handler**: bot parses `telemetry:anonymous` issues from the CLI and queues URLs for classification
- **Static JSON API** at `data/api/v1/`: `all.json`, `trending.json`, `new.json`, `by-category/{cat}.json`, `by-agent/{agent}.json`, `stats.json`
- **Embeddable SVG badges** for repo READMEs (`data/api/v1/badges/*.svg`)
- **Recommendation engine**: `recommendSimilar()` and `recommendForUser()` helpers
- **Discord webhook** for weekly digest (optional via `DISCORD_WEBHOOK_URL` secret)
- **docs/SHARE-YOUR-SETUP.md** privacy policy and setup guide
- **Updated launch materials** with the "every user is a contributor" angle
- scripts/build-api.ts and scripts/build-badges.ts integrated into refresh workflow

## [1.0.0] - 2026-04-24

### Added
- METHODOLOGY.md — full algorithm documentation with code references
- ARCHITECTURE.md — Mermaid-style data flow diagram and folder structure
- FAQ.md — common questions answered
- launch/ — HN post, Reddit posts, Twitter thread, Product Hunt copy, launch checklist
- .github/assets/ — banner.svg, logo.svg
- scripts/setup-repo.ts — sets GitHub repo description and topics via API
- releases/v1.0.0.md — full feature summary

### Changed
- README polished for public launch with hero section and clear CTAs
- CHANGELOG.md complete from v0.1.0 to v1.0.0

## [0.5.0] - 2026-04-24

### Added
- GitHub Actions: refresh.yml (every 6h), deploy-site.yml, bot.yml, weekly-digest.yml
- CI workflow updated with --dry-run build check
- Issue bot: submission queuing, duplicate detection, stale URL verification
- Budget guard: scripts/check-budget.ts aborts classifier if monthly spend exceeded
- scripts/write-health.ts: data/health.json updated every refresh
- scripts/generate-digest.ts: weekly markdown digest in digests/
- Dependabot config for npm + actions

## [0.4.0] - 2026-04-24

### Added
- README generator (`@skillpulse/generator`) with Handlebars templates
- Sections: Trending, New This Week, All-Time Top 30, By Category, By Agent
- Marker-based partial README updates (SKILLPULSE:START/END preserved)
- Astro static site: index, /all (Fuse.js search + category filter), /about, /stats pages
- MC. dark theme (Outfit + Space Mono, #0F0F0F bg, #D4882A accent)
- Keyboard shortcut / to focus search
- SEO meta tags, Open Graph, sitemap, robots.txt
- Health banner on /stats when refresh > 12h stale
- Integration script `scripts/build-everything.ts`

## [0.3.0] - 2026-04-24

### Added
- AI classifier package (`@skillpulse/classifier`)
- Anthropic SDK wrapper with haiku/sonnet escalation, cost logging
- Classification via tool_use with zod schema validation
- 22 canonical categories (no AI-invented categories)
- Deduplication: exact URL match, fuzzy name+author match
- Pulse score formula: stars (30%), growth (25%), recency (20%), cross-source (15%), confidence (10%)
- Trend computation: rising/stable/declining/new
- File-based 7-day classification cache
- Integration script `scripts/run-classifier.ts`

## [0.2.0] - 2026-04-24

### Added
- Data ingestor package (`@skillpulse/ingestors`)
- 7 ingestors: GitHub Trending, npm, PyPI, Anthropic Registry, Tokrepo, HN, Reddit
- Orchestrator with parallel execution and URL deduplication
- Shared utilities: `fetchWithRetry` (p-retry, AbortController 30s), `dedupeByUrl`
- Unit tests for utils and orchestrator
- Integration script `scripts/run-ingestors.ts`

## [0.1.0] - 2026-04-24

### Added
- Initial repository scaffolding
- TypeScript monorepo-light structure with pnpm workspaces
- Core package with shared types (`SkillEntry`, `DataSnapshot`, `SkillKind`, `AgentCompat`)
- JSON logger via pino with module tagging
- Package stubs: ingestors, classifier, generator, bot
- Biome config for linting and formatting
- TypeScript strict mode config
- MIT License
- CONTRIBUTING.md, CODE_OF_CONDUCT.md, CHANGELOG.md, SECURITY.md
- GitHub issue templates (submit-skill, report-stale, bug)
- CI workflow (lint, typecheck, test on PR)
- Placeholder README with MC. branding
