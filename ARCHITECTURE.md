# SkillPulse Architecture

## Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                    GitHub Actions (every 6h)             │
│                                                          │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐           │
│  │ Ingestors│───▶│Classifier│───▶│Generator │           │
│  │(7 sources)│    │(AI + Zod)│    │(README + │           │
│  └──────────┘    └──────────┘    │  Astro)  │           │
│                                  └────┬─────┘           │
└───────────────────────────────────────┼─────────────────┘
                                        │
                     ┌──────────────────┼──────────────┐
                     ▼                  ▼              ▼
               README.md         GitHub Pages      data/*.json
               (auto-updated)    (static site)    (versioned)
```

## Monorepo Structure

```
skillpulse/
├── packages/
│   ├── core/          # Shared types (SkillEntry, DataSnapshot) + logger
│   ├── ingestors/     # 7 data source scrapers + orchestrator
│   ├── classifier/    # AI classification, dedup, scoring, caching
│   ├── generator/     # README generator (Handlebars) + site-data helpers
│   └── bot/           # GitHub issue bot (submission handling)
├── site/              # Astro static site (GitHub Pages)
├── scripts/           # CLI runners (ingest, classify, build, digest)
├── data/
│   ├── snapshots/     # JSON snapshots (latest.json + dated)
│   ├── raw/           # Raw ingestor output (gitignored)
│   ├── cache/         # Classification cache (gitignored)
│   └── health.json    # System health status
├── digests/           # Weekly markdown digests
└── .github/
    ├── workflows/     # CI, refresh, deploy, bot, digest
    └── ISSUE_TEMPLATE/ # Submit skill, report stale, bug
```

## Key Design Decisions

- **Zero external DB** — all data persisted as versioned JSON in the repo
- **Idempotent pipeline** — same input always produces same output
- **Fail-soft ingestors** — one failing source doesn't stop others
- **7-day classification cache** — minimizes API costs
- **Marker-based README** — `<!-- SKILLPULSE:START/END -->` preserves manual edits
