# SkillPulse — Plano de Execução para Claude Code

> Autor: Markus Corazzione (MC.)
> Alvo: repositório GitHub auto-sustentável, posicionado para o top global de stars
> Executor: Claude Code (sonnet/opus) rodando localmente
> Modelo de execução: 6 etapas sequenciais, cada uma um prompt auto-contido

---

## Contexto do projeto (leia isto antes de começar cada etapa)

**O que é SkillPulse:**
Um agregador vivo e auto-atualizado de **skills, MCP servers, plugins e prompts** do ecossistema de agentes de IA (Claude Code, Cursor, Codex CLI, Gemini CLI, Windsurf, etc.). O repositório se atualiza a cada 6 horas via GitHub Actions, sem intervenção humana.

**Stack obrigatória:**
- **Linguagem:** TypeScript (Node 20+, ESM, strict mode)
- **Runtime:** Node.js — roda em GitHub Actions Ubuntu runners
- **Package manager:** pnpm (lock file commitado)
- **APIs externas:** GitHub REST + GraphQL via Octokit, Anthropic SDK, npm registry, PyPI JSON, HN Algolia, Reddit JSON
- **IA classificadora:** Anthropic Claude (modelo `claude-haiku-4-5` pra economia, `claude-sonnet-4-6` só pra casos ambíguos)
- **Persistência:** JSON files commitados no próprio repo (`data/`) — zero banco externo
- **Site:** Astro estático em `site/`, deployed via GitHub Pages
- **Testes:** Vitest
- **Lint/format:** Biome (mais rápido que ESLint+Prettier e um único config)
- **CI:** GitHub Actions

**Filosofia de código:**
- Modular, cada ingestor é um arquivo isolado com interface comum
- Zero dependências pesadas (sem Next.js, sem frameworks de backend)
- Tudo idempotente e determinístico (mesmo input → mesmo output)
- Rate limits respeitados, retries com backoff exponencial
- Logs estruturados (JSON) pra facilitar debug em GitHub Actions

**Princípios de branding (MC.):**
- Cores: `#0F0F0F` background, `#D4882A` laranja accent, `#C9A84C` dourado secundário
- Tipografia: Outfit (800) para headings, Space Mono para código
- Assinatura "MC." com quadrado laranja em rodapé do site e README

**Regras duras:**
- NUNCA comitar secrets. Use `${{ secrets.* }}` no Actions e `.env.local` local (em `.gitignore`)
- NUNCA scrapear HTML quando tem API — use API oficial sempre que disponível
- NUNCA fazer requisições sem timeout e retry
- NUNCA gerar descrições com IA sem validar tamanho e conteúdo (anti-hallucination guard)
- SEMPRE rodar `pnpm test` e `pnpm lint` antes de commitar
- SEMPRE atualizar `CHANGELOG.md` ao final de cada etapa

---

## ETAPA 1 — Fundação, arquitetura e esqueleto

**Objetivo:** Criar a estrutura completa do repositório com todos os arquivos de governança, config, types e CI mínimo. Nada funcional ainda — só o esqueleto rodável.

**Prompt para Claude Code:**

```
Create the skeleton of the skillpulse repository.

REQUIREMENTS:

1. Initialize a TypeScript monorepo-light structure with pnpm:
   - Root package.json with workspaces: ["packages/*", "site"]
   - packages/core — shared types, utils, logger
   - packages/ingestors — scraper modules (empty stubs for now)
   - packages/classifier — AI classification pipeline (stub)
   - packages/generator — README and data file generators (stub)
   - packages/bot — GitHub issue/PR bot (stub)
   - site/ — Astro static site (initialize with `pnpm create astro@latest` minimal config, no examples)
   - data/ — will hold the JSON datasets (create empty with a .gitkeep)
   - scripts/ — standalone ops scripts

2. Root config files:
   - tsconfig.base.json — strict mode, ES2022 target, moduleResolution: bundler, paths for @skillpulse/*
   - biome.json — format + lint, 2 spaces, single quotes, trailing commas all, arrow parens always
   - .gitignore — node_modules, dist, .env*, *.log, .astro, .DS_Store
   - .nvmrc — 20
   - .editorconfig
   - pnpm-workspace.yaml

3. Types in packages/core/src/types.ts:
   ```ts
   export type SkillKind = 'skill' | 'mcp-server' | 'plugin' | 'prompt-pack' | 'cli-tool';
   export type AgentCompat = 'claude-code' | 'cursor' | 'codex-cli' | 'gemini-cli' | 'windsurf' | 'generic';

   export interface SkillEntry {
     id: string;                    // stable hash: sha1(source + sourceId)
     name: string;
     description: string;           // AI-generated, max 200 chars
     kind: SkillKind;
     source: 'github' | 'npm' | 'pypi' | 'tokrepo' | 'anthropic-registry' | 'hn' | 'reddit';
     sourceUrl: string;
     author: string;
     stars?: number;
     downloadsWeekly?: number;
     compat: AgentCompat[];
     category: string;              // e.g. "testing", "design", "database", "observability"
     tags: string[];
     firstSeenAt: string;           // ISO
     lastUpdatedAt: string;         // ISO
     pulseScore: number;            // 0-100, scoring algo in classifier
     trend: 'rising' | 'stable' | 'declining' | 'new';
   }

   export interface DataSnapshot {
     generatedAt: string;
     totalEntries: number;
     entries: SkillEntry[];
   }
   ```

4. Logger in packages/core/src/logger.ts — simple JSON logger using pino, with module tag.

5. README.md at root — placeholder with hero section, MC. branding, badges (build status, last update, entry count), "Work in progress" notice. Use the color palette #D4882A and #C9A84C for any inline styling hints. Include:
   - Hero with title "SkillPulse" and tagline "The living registry of AI agent skills, MCPs, and prompts. Refreshed every 6h."
   - Placeholder sections: Top Trending, Rising Stars, New This Week, By Category
   - Contribution section pointing to CONTRIBUTING.md
   - MC. signature at the bottom

6. Governance files:
   - LICENSE — MIT, Markus Corazzione 2026
   - CONTRIBUTING.md — how to suggest a skill via issue template, how the bot works, local dev setup
   - CODE_OF_CONDUCT.md — contributor covenant v2.1
   - CHANGELOG.md — Keep a Changelog format, entry for "v0.1.0 - Scaffolding"
   - SECURITY.md — how to report vulnerabilities

7. .github/ directory:
   - ISSUE_TEMPLATE/submit-skill.yml — structured form (name, url, kind, why)
   - ISSUE_TEMPLATE/report-stale.yml — report a dead entry
   - ISSUE_TEMPLATE/bug.yml
   - PULL_REQUEST_TEMPLATE.md
   - workflows/ci.yml — runs on PR: pnpm install, lint, typecheck, test

8. Placeholder test in packages/core (vitest) that checks the logger exports exist.

9. Initialize git: `git init`, first commit message "feat: initial scaffolding (v0.1.0)".

DO NOT:
- Implement any ingestor logic yet
- Add Anthropic SDK yet
- Initialize the Astro site beyond minimum

ACCEPTANCE CRITERIA:
- `pnpm install` works from root
- `pnpm lint` passes with zero errors
- `pnpm -r typecheck` passes
- `pnpm -r test` passes (with the one placeholder test)
- `gh repo view` (if gh CLI is set up) or `git log` shows one clean commit
- Tree output matches the structure above

END OF ETAPA 1.
```

---

## ETAPA 2 — Ingestores (scrapers)

**Objetivo:** Implementar os coletores de dados de cada fonte. Cada um é um módulo isolado que exporta uma função `fetch()` que retorna um array tipado de resultados crus.

**Prompt para Claude Code:**

```
Implement the data ingestors for SkillPulse.

REQUIREMENTS:

1. Install runtime dependencies in packages/ingestors:
   - @octokit/rest
   - @octokit/graphql
   - undici (native fetch wrapper with better timeouts/retries)
   - p-retry
   - p-queue

2. Create a shared interface in packages/ingestors/src/types.ts:
   ```ts
   export interface RawSkillResult {
     source: SkillEntry['source'];
     sourceId: string;          // unique within source (e.g. github owner/repo, npm package name)
     name: string;
     rawDescription: string;    // original, not yet processed
     url: string;
     author: string;
     stars?: number;
     downloads?: number;
     stargazersThisWeek?: number;
     topics?: string[];
     updatedAt: string;
     language?: string;
     readmeSnippet?: string;    // first 2000 chars of README, used by classifier
   }

   export interface Ingestor {
     name: string;
     fetch(opts: { since?: string }): Promise<RawSkillResult[]>;
   }
   ```

3. Implement these ingestors:

   a) packages/ingestors/src/github-trending.ts
      - Uses GitHub Search API with queries like:
        `topic:claude-code created:>YYYY-MM-DD sort:stars`
        `topic:mcp-server sort:stars-desc`
        `topic:claude-skill`
        `topic:agent-skill`
        `claude-code in:name,description,readme stars:>10`
        `mcp-server in:name,description,readme stars:>5`
      - Runs all queries in parallel with p-queue (concurrency 4)
      - Deduplicates by repo full_name
      - Fetches README snippet for the top 100 results via GraphQL
      - Returns up to 500 results per run

   b) packages/ingestors/src/npm.ts
      - Searches npm registry API (https://registry.npmjs.org/-/v1/search?text=...) for:
        `keywords:claude-code`, `keywords:mcp-server`, `keywords:claude-skill`, `@modelcontextprotocol/*`
      - For each package, fetch weekly downloads from https://api.npmjs.org/downloads/point/last-week/{pkg}
      - Normalize to RawSkillResult

   c) packages/ingestors/src/pypi.ts
      - Queries PyPI JSON for packages matching patterns (mcp, claude, agent-skill)
      - Uses https://pypi.org/simple/ and https://pypi.org/pypi/{pkg}/json
      - Less priority, gather top 50

   d) packages/ingestors/src/anthropic-registry.ts
      - Fetches the official MCP registry from Anthropic (discover current URL at https://docs.claude.com — search for "MCP registry" or "modelcontextprotocol/registry" on GitHub as fallback)
      - Parses the registry JSON/YAML
      - Returns all registered servers

   e) packages/ingestors/src/tokrepo.ts
      - Scrapes or uses API of tokrepo.com if available (fallback to HTML parse with cheerio ONLY if no API)
      - Returns skills and MCPs registered there

   f) packages/ingestors/src/hn.ts
      - Uses HN Algolia API (https://hn.algolia.com/api/v1/search?query=claude+code&tags=story)
      - Also queries for "MCP server", "claude skill", "agent skill"
      - Filters posts from last 7 days
      - Extracts GitHub/npm URLs from post text and comments
      - Returns those as RawSkillResult with source='hn'

   g) packages/ingestors/src/reddit.ts
      - Uses Reddit JSON endpoints (no auth, .json suffix): /r/ClaudeAI, /r/LocalLLaMA, /r/mcp
      - Scans top posts of the week
      - Extracts GitHub URLs with regex
      - Rate limit carefully (Reddit blocks aggressive polls)

4. All ingestors MUST:
   - Have p-retry with 3 attempts, exponential backoff (factor 2, min 1s, max 30s)
   - Use AbortController timeout of 30s per request
   - Log start, end, result count, errors as JSON via the core logger
   - Use env vars: GITHUB_TOKEN (required), ANTHROPIC_API_KEY (required later)
   - Fail soft: if one ingestor throws, others continue (orchestrator handles it)

5. Create packages/ingestors/src/orchestrator.ts:
   - Exports `runAllIngestors(): Promise<RawSkillResult[]>`
   - Runs all ingestors in parallel
   - Dedupes results by normalized URL (github.com/x/y same across sources)
   - Returns merged array with a `sources: string[]` field for cross-source tracking
   - Handles individual ingestor failures gracefully (logs, continues)

6. Write unit tests for each ingestor using vitest with mocked fetch (use `msw` or `vi.fn().mockResolvedValue`):
   - Happy path returns expected structure
   - 500 error retries 3 times then gives up
   - Empty result set handled

7. Add an integration script scripts/run-ingestors.ts that:
   - Loads .env.local
   - Calls orchestrator
   - Writes raw results to data/raw/YYYY-MM-DD.json
   - Prints summary to stdout

8. Update CHANGELOG.md with "v0.2.0 - Ingestors" entry.

ACCEPTANCE CRITERIA:
- `GITHUB_TOKEN=... pnpm tsx scripts/run-ingestors.ts` produces a JSON file with 100+ entries
- All tests pass (`pnpm -r test`)
- Lint passes, typecheck passes
- No secrets committed (grep for "ghp_", "sk-ant", hardcoded tokens)

END OF ETAPA 2.
```

---

## ETAPA 3 — Classificador de IA e scoring

**Objetivo:** Transformar resultados crus em `SkillEntry` enriquecidos: categoria inferida, descrição limpa, compatibilidade, deduplicação semântica, e score de ranking.

**Prompt para Claude Code:**

```
Implement the AI classifier and scoring pipeline.

REQUIREMENTS:

1. Install in packages/classifier:
   - @anthropic-ai/sdk
   - zod (for validating AI outputs)

2. Create packages/classifier/src/ai-client.ts:
   - Wraps Anthropic SDK with defaults
   - Default model: claude-haiku-4-5 (cheap, fast)
   - Escalation model: claude-sonnet-4-6 (only when ambiguous)
   - Max tokens per classification: 500
   - Retry on 429/529 with exponential backoff (p-retry)
   - Cost tracking: log input/output tokens per call to data/logs/cost-YYYY-MM-DD.jsonl

3. Create packages/classifier/src/classify.ts:
   - Exports `classifyEntry(raw: RawSkillResult): Promise<ClassificationResult>`
   - ClassificationResult = { description, kind, category, tags, compat, confidence }
   - Uses a structured prompt with system message that defines the schema
   - Validates response with zod:
     ```ts
     const schema = z.object({
       description: z.string().min(20).max(200),
       kind: z.enum(['skill', 'mcp-server', 'plugin', 'prompt-pack', 'cli-tool']),
       category: z.string().min(3).max(40),
       tags: z.array(z.string()).min(1).max(8),
       compat: z.array(z.enum(['claude-code', 'cursor', 'codex-cli', 'gemini-cli', 'windsurf', 'generic'])).min(1),
       confidence: z.number().min(0).max(1),
     });
     ```
   - If confidence < 0.7, retry with sonnet model once
   - Uses tool_use / JSON mode for structured output (not text parsing)

4. Canonical categories (hardcoded list, don't let AI invent — snap to closest):
   - developer-tooling, testing, database, design, observability, security,
     documentation, ci-cd, deployment, ai-ml, browser-automation, file-ops,
     version-control, content-creation, productivity, api-integration,
     data-analysis, translation, code-review, refactoring, orchestration, other
   - Include this list in the system prompt, instruct AI to pick the closest match

5. Create packages/classifier/src/dedupe.ts:
   - Exports `dedupeEntries(entries: SkillEntry[]): SkillEntry[]`
   - Dedupes by:
     a) Exact normalized URL match (github.com/x/y regardless of source)
     b) Same author + very similar name (levenshtein distance < 3)
     c) Same package name across npm/pypi (merge, keep higher-star source as primary)
   - Merged entries get a `sources: string[]` field combining all origins

6. Create packages/classifier/src/scoring.ts:
   - Exports `computePulseScore(entry: SkillEntry, history: SkillEntry[]): number`
   - Score formula (0–100):
     ```
     0.30 * normalizedStars (log scale, capped at 10k stars = 100%)
     0.25 * growthRate (stars gained in last 7d, normalized)
     0.20 * recencyBoost (new in last 30d = 1.0, older = decays)
     0.15 * crossSourceBonus (appears in 2+ sources = +15)
     0.10 * classificationConfidence
     ```
   - Also computes `trend`: compare score to 7-day ago snapshot
     - 'new': didn't exist 7 days ago
     - 'rising': score grew >15%
     - 'declining': score dropped >15%
     - 'stable': between

7. Create packages/classifier/src/pipeline.ts:
   - Exports `runClassificationPipeline(rawResults: RawSkillResult[]): Promise<SkillEntry[]>`
   - Steps:
     1. Load previous snapshot from data/snapshots/latest.json (for history/scoring)
     2. Classify each raw result with p-queue (concurrency 5, to respect Anthropic rate limits)
     3. Generate stable IDs: sha1(source + ':' + sourceId)
     4. Dedupe
     5. Score each entry
     6. Determine trend
     7. Return sorted array (highest score first)

8. Add caching layer in packages/classifier/src/cache.ts:
   - File-based cache at data/cache/classifications.json
   - Key: entry ID + readmeSnippet hash
   - If same input in last 7 days, skip AI call
   - Cache hit rate should be logged

9. Add integration script scripts/run-classifier.ts:
   - Reads data/raw/{today}.json
   - Runs pipeline
   - Writes data/snapshots/{today}.json and data/snapshots/latest.json
   - Prints cost summary (total tokens, USD estimate using Haiku pricing)

10. Write tests:
    - Mock Anthropic SDK with vitest
    - Test happy path, malformed AI response (fallback), dedupe edge cases, scoring bounds

11. Update CHANGELOG.md with "v0.3.0 - Classifier".

ACCEPTANCE CRITERIA:
- `ANTHROPIC_API_KEY=... GITHUB_TOKEN=... pnpm tsx scripts/run-ingestors.ts && pnpm tsx scripts/run-classifier.ts` produces a valid snapshot
- Cost per full run < $1 USD (log must confirm)
- All entries validated by zod (no malformed data in output)
- Dedupe actually merges cross-source duplicates (verify in output)
- Tests pass, lint passes, typecheck passes

END OF ETAPA 3.
```

---

## ETAPA 4 — Gerador de README dinâmico e site estático

**Objetivo:** Transformar o snapshot JSON em README markdown automaticamente reescrito E num site estático com busca, hospedado em GitHub Pages.

**Prompt para Claude Code:**

```
Build the README generator and the Astro site.

REQUIREMENTS:

1. README Generator (packages/generator):

   a) Install: handlebars (templating)

   b) Create packages/generator/src/readme.ts:
      - Exports `generateReadme(snapshot: DataSnapshot): string`
      - Uses a Handlebars template at packages/generator/templates/README.md.hbs
      - Template sections (in order):
        1. Hero banner (ASCII art of "SKILLPULSE" generated at build time, or static SVG link)
        2. Tagline + key stats (total entries, last updated, refresh cadence)
        3. Dynamic badges (shields.io):
           - Entry count: https://img.shields.io/badge/entries-{N}-D4882A
           - Last updated: https://img.shields.io/github/last-commit/{repo}
           - Build status
           - Stars
        4. "🔥 Top 20 Trending This Week" — top 20 by pulseScore where trend=rising or new
        5. "✨ New This Week" — top 10 by firstSeenAt in last 7 days
        6. "🏆 All-Time Top 30" — sorted by stars desc
        7. "📚 By Category" — grouped tables, one per category, top 10 per category
        8. "🤖 By Agent Compatibility" — 5 sub-sections (claude-code, cursor, etc), top 15 each
        9. How it works (3-sentence explainer + link to site)
        10. Contributing (link to CONTRIBUTING.md, link to issue templates)
        11. MC. footer with orange square SVG signature

   c) Entry row format in tables:
      ```
      | Rank | Name | Kind | Stars | Pulse | Trend | Description |
      |------|------|------|-------|-------|-------|-------------|
      ```
      Name is a link to sourceUrl. Kind is a badge emoji (🧠 skill, 🔌 mcp, 🧩 plugin, 💬 prompt, ⚡ cli). Trend is an emoji (🚀 new, 📈 rising, ➡️ stable, 📉 declining). Pulse shown as number/100.

   d) The template MUST be idempotent — same snapshot → same README → clean git diffs. Sort deterministically (by pulseScore desc, then by name asc).

   e) Preserve a "manually-edited header" block:
      ```
      <!-- SKILLPULSE:START -->
      ...everything auto-generated here...
      <!-- SKILLPULSE:END -->
      ```
      Anything outside these markers is preserved (for future manual edits by Markus).

2. Write tests: snapshot → README → assert contains expected headers and no broken links.

3. Astro site (site/):

   a) Initialize properly with:
      ```
      pnpm create astro@latest site -- --template minimal --no-install --no-git
      ```
      Then install with pnpm.

   b) Install site deps:
      - @astrojs/tailwind
      - tailwindcss
      - fuse.js (for fuzzy client-side search)
      - lucide-astro (icons)

   c) Tailwind config with MC. palette:
      ```
      colors: {
        bg: '#0F0F0F',
        surface: '#161616',
        accent: '#D4882A',
        gold: '#C9A84C',
        text: '#EEEEEE',
      }
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      }
      ```

   d) Load fonts from Google Fonts in base layout.

   e) Pages:
      - index.astro — hero + top 20 + CTA to browse all
      - all.astro — paginated list (50 per page), client-side search via Fuse.js
      - category/[slug].astro — dynamic per category
      - agent/[slug].astro — dynamic per agent compat
      - about.astro — how it works, methodology, open-source link
      - stats.astro — pretty charts of ecosystem growth (use canvas or simple SVG, no heavy chart libs)

   f) Data source: reads data/snapshots/latest.json at build time (Astro content collection or static import).

   g) Every entry card shows: name, kind badge, pulse score, trend arrow, stars, description, "View source" button, category chip.

   h) Dark theme only (matches MC. brand). Keyboard navigation (/, j/k to move between entries). No cookies, no analytics by default (add an opt-in Plausible snippet as a comment).

   i) MC. signature in footer: `MC.` wordmark in Outfit 800, tiny orange square to the left.

   j) SEO:
      - Proper meta tags per page (generate from entry data)
      - Open Graph images — generate dynamically at build time using satori or canvas-based SVG
      - sitemap.xml via @astrojs/sitemap
      - robots.txt allowing all

4. Create packages/generator/src/site-data.ts:
   - Exports helpers the Astro site imports
   - Provides typed getters: getTopTrending(n), getByCategory(cat), getByAgent(agent), search(query)

5. Integration script scripts/build-everything.ts:
   - Reads latest snapshot
   - Regenerates README.md at root
   - Triggers Astro build into site/dist
   - Prints summary

6. Update CHANGELOG.md with "v0.4.0 - Generator + Site".

ACCEPTANCE CRITERIA:
- `pnpm tsx scripts/build-everything.ts` regenerates README and builds site
- README.md diff is stable (re-running with same data produces zero-byte diff)
- `pnpm --filter site dev` serves the site locally, all pages render
- Lighthouse score > 95 on index.astro (test with `pnpm --filter site build && pnpm dlx serve site/dist`)
- No broken links in generated README (validate with a simple HEAD-check script or leave for CI)
- Tests pass, lint passes, typecheck passes

END OF ETAPA 4.
```

---

## ETAPA 5 — Automação (GitHub Actions) e bot de issues

**Objetivo:** Tudo orquestrado por workflows que rodam a cada 6h. Bot responde issues e promove submissões para PRs automaticamente.

**Prompt para Claude Code:**

```
Wire up all automation via GitHub Actions and implement the issue bot.

REQUIREMENTS:

1. Workflow: .github/workflows/refresh.yml
   - Triggers:
     - `schedule: cron: '0 */6 * * *'` (every 6h)
     - `workflow_dispatch` (manual trigger)
   - Permissions: contents: write, pages: write, id-token: write
   - Steps:
     1. Checkout with fetch-depth 0
     2. Setup Node 20 with pnpm cache
     3. `pnpm install --frozen-lockfile`
     4. Run `pnpm tsx scripts/run-ingestors.ts` (env: GITHUB_TOKEN)
     5. Run `pnpm tsx scripts/run-classifier.ts` (env: ANTHROPIC_API_KEY)
     6. Run `pnpm tsx scripts/build-everything.ts`
     7. If README.md or data/** changed, commit with message `chore(data): refresh YYYY-MM-DD HH:MM UTC` using github-actions[bot] identity
     8. Push to main
     9. Separate job: deploy site to GitHub Pages (only if data changed)

2. Workflow: .github/workflows/deploy-site.yml
   - Triggered by push to main when site/** or data/** changes (path filters)
   - Builds Astro site
   - Uploads artifact via actions/upload-pages-artifact
   - Deploys via actions/deploy-pages

3. Workflow: .github/workflows/ci.yml (already exists from Etapa 1, extend):
   - On PR: install, lint, typecheck, test
   - Also run `pnpm tsx scripts/build-everything.ts --dry-run` to catch generator errors

4. Workflow: .github/workflows/bot.yml
   - Triggers: issues.opened, issue_comment.created
   - Runs the bot script

5. Bot (packages/bot):

   a) Install: @octokit/rest, @octokit/webhooks-types

   b) packages/bot/src/handlers/on-issue-opened.ts:
      - If issue used `submit-skill.yml` template:
        - Parse form fields (name, url, kind, why)
        - Validate URL resolves (HEAD request)
        - Check if already exists in latest snapshot
        - If exists: comment "Already tracked as entry #{rank} — see README. Closing." and close
        - If valid and new: comment "Queued for next refresh cycle (runs every 6h). This issue will auto-close once the entry appears in the dataset. Thank you!" and add label `submission:queued`
        - Add the URL to data/pending-submissions.json (ingestors will pick it up)
      - If issue used `report-stale.yml`:
        - Check if URL still resolves
        - If 404: add to data/flagged-stale.json, comment "Confirmed. Will be removed on next refresh.", close
        - If alive: comment "URL still resolves. Can you provide more details?"
      - If issue is just text/bug:
        - Comment with friendly welcome + link to CONTRIBUTING.md
        - Don't close, wait for maintainer

   c) packages/bot/src/handlers/on-comment.ts:
      - If a queued submission has been refreshed and entry now exists, close with success comment
      - If maintainer comments `/refresh` on any issue, re-run validation

   d) packages/bot/src/index.ts:
      - Entry point called by bot.yml workflow
      - Reads GITHUB_EVENT_PATH, dispatches to handler by event type
      - All actions use the GITHUB_TOKEN of the workflow

6. Modify ingestors to read data/pending-submissions.json and include those URLs:
   - Treat them as a separate source ('user-submitted')
   - Fetch their metadata (github/npm/pypi depending on URL)
   - After successful classification, remove from pending

7. Add a weekly summary workflow: .github/workflows/weekly-digest.yml
   - Runs Monday 12:00 UTC
   - Generates a markdown digest (top 10 new, top 5 risers, biggest faller) from week-over-week snapshot diff
   - Creates a GitHub Discussion in the "Announcements" category with the digest
   - Also writes to `digests/YYYY-WW.md` in the repo

8. Add status badge URLs to README generator output and to site footer.

9. Add rate limit / cost guard:
   - scripts/check-budget.ts — runs before classifier, aborts if monthly Anthropic spend > $50
   - Reads data/logs/cost-*.jsonl, sums the month
   - Set budget as env var ANTHROPIC_MONTHLY_BUDGET_USD (default 50)
   - Workflow fails loudly if budget exceeded (protects Markus)

10. Update CHANGELOG.md with "v0.5.0 - Automation + Bot".

ACCEPTANCE CRITERIA:
- All workflow YAMLs pass `actionlint` validation
- Bot handler unit tests pass (mock Octokit)
- Refresh workflow can be triggered manually via `gh workflow run refresh.yml` and completes successfully
- Budget guard correctly blocks when synthetic cost log exceeds threshold
- First real refresh cycle commits a data update within 10 minutes
- Site deploys to `https://{username}.github.io/skillpulse` successfully

END OF ETAPA 5.
```

---

## ETAPA 6 — Launch, SEO, distribuição e growth

**Objetivo:** Polir tudo para o lançamento público, otimizar para descoberta orgânica, e preparar assets de distribuição. Esta etapa é o empurrão que move o projeto do "existe" pro "está no trending".

**Prompt para Claude Code:**

```
Finalize SkillPulse for public launch.

REQUIREMENTS:

1. README polish (packages/generator/templates/README.md.hbs):

   a) Hero section:
      - ASCII art or banner image link (SVG in repo at .github/assets/banner.svg, dark bg, MC. colors)
      - Tagline: "The living registry of AI agent skills, MCPs, and prompts — refreshed every 6h by a bot that never sleeps."
      - One-line value props (3 bullets):
        • 📡 Auto-updated from GitHub, npm, PyPI, HN, Reddit, Anthropic Registry
        • 🧠 AI-classified and scored — no manual curation bottleneck
        • 🤖 Submit via issue, auto-promoted to the registry
      - Clear CTAs: "⭐ Star this repo" + "🌐 Visit skillpulse.dev" (or actual pages URL) + "➕ Submit a skill"

   b) "Why this exists" — 2 paragraphs. Pain: awesome lists die. Solution: live automation. Trust: open-source, transparent scoring, all data versioned.

   c) "How it works" — 3-step diagram (ASCII or SVG):
      ```
      [Sources] → [Ingest every 6h] → [AI classify + score] → [README + site rebuild]
      ```

   d) Methodology section: link to a METHODOLOGY.md explaining the scoring formula, dedup rules, category taxonomy. Trust through transparency.

2. Create METHODOLOGY.md with the full algorithm explanation. Reproducible, sourced with code links.

3. Create .github/assets/:
   - banner.svg — 1200x400 dark banner, "SKILLPULSE" wordmark in Outfit 800, tagline, MC. signature
   - logo.svg — 512x512 square, orange square + "SP" monogram
   - demo.gif — (placeholder, actual GIF will be recorded manually later) — link with a caption "demo coming soon"
   - og-image.png — 1200x630 for social previews, auto-generated per-page on the site

4. SEO setup:
   - Repo description: "Auto-updated registry of Claude Code skills, MCP servers, Cursor rules, and AI agent prompts. Refreshed every 6 hours."
   - GitHub topics: claude-code, mcp, mcp-server, claude-skill, agent-skill, awesome-list, cursor, codex-cli, gemini-cli, ai-agent, model-context-protocol, llm-tools
   - Script scripts/setup-repo.ts that uses GitHub API to set description and topics programmatically (so Markus just runs it once)

5. package.json metadata for future npm publish of a CLI (optional future):
   - Reserve the name `skillpulse` on npm with a placeholder package (optional, mention in FAQ)

6. Launch assets in /launch/ folder (docs for Markus, not public):

   a) launch/HN-post.md — Show HN post draft:
      - Title: "Show HN: SkillPulse — Auto-updated registry of Claude Code skills and MCP servers"
      - Body: 4-paragraph explanation, honest, no hype. Link to repo + site. Mention stack + that it's fully open-source.

   b) launch/reddit-posts.md — 3 drafts:
      - r/ClaudeAI
      - r/LocalLLaMA
      - r/mcp (if subreddit exists, otherwise r/programming)
      Each with subreddit-appropriate tone.

   c) launch/twitter-thread.md — 6-tweet thread:
      1. Problem (awesome lists die)
      2. Solution (live auto-updated)
      3. Stack (TS, Actions, Anthropic API)
      4. How to submit
      5. Numbers (N entries at launch)
      6. Link + ask to star

   d) launch/producthunt.md — PH launch page copy: tagline, description, gallery caption suggestions.

   e) launch/launch-checklist.md:
      - T-24h: verify all workflows green, site live, data fresh
      - T-1h: sanity check README, site loads
      - T-0: post HN, Twitter, Reddit in this order (wait 30min between)
      - T+1h: monitor HN comments, respond within 10min
      - T+24h: if top 10 HN, crosspost to dev.to and hashnode
      - T+7d: weekly digest auto-posts, verify it ran

7. Performance optimizations:
   - Ensure site bundle < 100KB on initial load (measure with Astro)
   - Preload fonts
   - Compress SVGs with svgo
   - Generate a 50KB-max og-image per page using satori

8. Accessibility pass:
   - All interactive elements reachable by keyboard
   - Contrast ratios meet WCAG AA (verify #D4882A on #0F0F0F, adjust if needed)
   - Skip-to-content link
   - Proper heading hierarchy on every page
   - alt text on every image

9. Security hardening:
   - Pin all GitHub Actions to SHA (not just @v4) — use dependabot to keep updated
   - Add `.github/dependabot.yml` for npm + actions
   - Review workflow permissions (principle of least privilege)
   - No `pull_request_target` anywhere
   - Add a .github/CODEOWNERS with @markus-corazzione covering everything

10. Final docs:
    - Expand CONTRIBUTING.md with: how to submit, how to self-host a fork, architecture overview with folder explainer
    - Create ARCHITECTURE.md with a Mermaid diagram of the data flow
    - Create FAQ.md covering: "Why not use existing awesome lists?", "How accurate is the AI classification?", "How much does it cost to run?", "Can I fork this for another niche?"

11. Observability:
    - Add a /health endpoint equivalent: a JSON file at data/health.json updated every refresh with {lastRefresh, totalEntries, failedIngestors, budgetUsedMonthUSD}
    - Displayed on the site /stats page
    - If lastRefresh > 12h old, add a red banner to the site "⚠️ Auto-refresh paused — maintainer notified"

12. Final test suite — add E2E test scripts/e2e-smoke.ts:
    - Runs full pipeline against a small seed of known skills
    - Asserts output JSON shape matches contract
    - Asserts README contains expected sections
    - Used in CI on every PR

13. Tag release v1.0.0 with a release notes file at /releases/v1.0.0.md summarizing the feature set.

14. Update CHANGELOG.md with "v1.0.0 - Public Launch" section covering all features from Etapa 1 to 6.

ACCEPTANCE CRITERIA:
- Repo description and topics set (verify with `gh repo view`)
- Site passes Lighthouse 95+ across Performance, Accessibility, Best Practices, SEO
- All launch docs in /launch/ exist and are polished
- Dependabot PRs enabled
- README renders beautifully on github.com mobile and desktop
- OG image preview looks professional when shared on Twitter/LinkedIn
- `git tag v1.0.0 && git push --tags` succeeds
- One final refresh cycle runs green end-to-end

END OF ETAPA 6. Project ready for public launch.
```

---

## Sequência de execução recomendada

Executar as 6 etapas em ordem, no mesmo workspace (Claude Code mantém contexto do repo entre sessões). Entre etapas, rodar:

```bash
pnpm install
pnpm lint
pnpm -r typecheck
pnpm -r test
git log --oneline
```

E commitar cada etapa como marco separado. Se alguma etapa falhar, corrigir ANTES de avançar — as etapas não são idempotentes entre si.

## Secrets necessários

Configurar no GitHub repo antes da Etapa 5:

- `ANTHROPIC_API_KEY` — chave da Anthropic API (usar conta com budget alert em $50/mês)
- `GITHUB_TOKEN` — já é fornecido automaticamente pelos workflows, sem setup

Opcional:
- `DISCORD_WEBHOOK_URL` — se quiser push de updates pro Discord
- `TWITTER_API_TOKEN` — se quiser auto-post

## Custos estimados (rodando 24/7, cadência 6h)

- GitHub Actions: **zero** (repo público, grátis)
- GitHub Pages: **zero**
- Anthropic API: **$5–20/mês** (com cache de 7 dias, a maioria das classificações é cache hit)
- Domínio custom (opcional): ~$12/ano

## Métricas de sucesso

- **Semana 1**: 100+ stars, apareceu no GitHub Trending da categoria
- **Mês 1**: 1k+ stars, 50+ submissões via issue
- **Mês 3**: 10k+ stars, menções em newsletters (TLDR, Bytes.dev)
- **Mês 6**: top 100 trending global na categoria AI/awesome-list

---

**Autor do plano:** Markus Corazzione — MC.
**Versão:** 1.0
**Data:** 2026-04-24
