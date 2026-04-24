# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
