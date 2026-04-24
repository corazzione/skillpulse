# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
