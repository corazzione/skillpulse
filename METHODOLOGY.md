# SkillPulse Methodology

This document explains how SkillPulse discovers, classifies, scores, and ranks AI agent skills.

## Data Sources

| Source | Method | Frequency |
|--------|--------|-----------|
| GitHub | Search API + GraphQL (topics, keywords) | Every 6h |
| npm | Registry search API + download counts | Every 6h |
| PyPI | Package JSON API | Every 6h |
| Anthropic Registry | Official MCP registry JSON | Every 6h |
| Tokrepo | API (graceful fallback) | Every 6h |
| Hacker News | Algolia API (last 7 days) | Every 6h |
| Reddit | JSON endpoint (r/ClaudeAI, r/LocalLLaMA, r/mcp) | Every 6h |

## Classification

Each entry is classified by Claude Haiku (`claude-haiku-4-5`) using tool_use structured output validated by [Zod](https://zod.dev). Fields extracted:

- **description** — concise summary, 20–200 chars, no marketing language
- **kind** — one of: `skill`, `mcp-server`, `plugin`, `prompt-pack`, `cli-tool`
- **category** — snapped to 22 canonical categories (no AI-invented categories)
- **tags** — 1–8 lowercase hyphenated tags
- **compat** — which agent ecosystems can use this
- **confidence** — 0.0–1.0; if < 0.7, escalates to `claude-sonnet-4-6`

Results are validated by Zod schema. Invalid responses are retried up to 3 times.

### Canonical Categories

`developer-tooling`, `testing`, `database`, `design`, `observability`, `security`, `documentation`, `ci-cd`, `deployment`, `ai-ml`, `browser-automation`, `file-ops`, `version-control`, `content-creation`, `productivity`, `api-integration`, `data-analysis`, `translation`, `code-review`, `refactoring`, `orchestration`, `other`

## Deduplication

Entries are deduplicated by:
1. **Exact URL match** — normalized (lowercase, trailing slash removed)
2. **Fuzzy name match** — same author + Levenshtein distance < 3

When duplicates merge, the higher-star entry is kept as primary.

## Pulse Score (0–100)

```
pulseScore =
  0.30 × normalizedStars(log₁₀ scale, 10k stars = 100%)
+ 0.25 × growthRate(stars gained in 7d, normalized)
+ 0.20 × recencyBoost(new in 30d = 1.0, decays over 180d)
+ 0.15 × crossSourceBonus(appears in 2+ sources)
+ 0.10 × classificationConfidence
```

## Trend Labels

Compared against the 7-day-ago snapshot:
- **new** — didn't exist 7 days ago
- **rising** — Pulse Score grew > 15%
- **declining** — Pulse Score dropped > 15%
- **stable** — change within ±15%

## Caching

Classifications are cached for 7 days (key: entry ID + README snippet hash). This reduces API costs by ~80% on subsequent runs.

## Cost

Typical run: ~$0.05–0.20 USD (mostly cache hits). Monthly budget guard defaults to $50 USD.

## Code References

- Ingestors: [`packages/ingestors/src/`](packages/ingestors/src/)
- Classifier: [`packages/classifier/src/classify.ts`](packages/classifier/src/classify.ts)
- Scoring: [`packages/classifier/src/scoring.ts`](packages/classifier/src/scoring.ts)
- Dedup: [`packages/classifier/src/dedupe.ts`](packages/classifier/src/dedupe.ts)
