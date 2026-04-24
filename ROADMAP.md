# SkillPulse — Roadmap de Execução

> Atualizado automaticamente. Para uso de agentes futuros que continuem este projeto.

## Status das Etapas

| Etapa | Descrição | Status | Commit |
|-------|-----------|--------|--------|
| ETAPA 1 | Fundação, arquitetura e esqueleto | ✅ Concluído | v0.1.0 |
| ETAPA 2 | Ingestores (scrapers) | ✅ Concluído | v0.2.0 |
| ETAPA 3 | Classificador de IA e scoring | ✅ Concluído | v0.3.0 |
| ETAPA 4 | Gerador de README e site estático | ✅ Concluído | v0.4.0 |
| ETAPA 5 | GitHub Actions e bot de issues | ✅ Concluído | v0.5.0 |
| ETAPA 6 | Launch, SEO e distribuição | ✅ Concluído | v1.0.0 |
| ETAPA 7 | Growth & Distribution (CLI, hooks, API, badges) | ✅ Concluído | v1.1.0 |

## O que foi criado na ETAPA 1

### Estrutura de diretórios
- `packages/core/` — tipos compartilhados, logger (pino)
- `packages/ingestors/` — stub vazio
- `packages/classifier/` — stub vazio
- `packages/generator/` — stub vazio
- `packages/bot/` — stub vazio
- `data/` — vazio (aguarda ETAPA 2)
- `scripts/` — vazio (aguarda ETAPA 2)
- `.github/workflows/` — CI workflow
- `.github/ISSUE_TEMPLATE/` — templates de issue

### Arquivos de config
- `pnpm-workspace.yaml` — monorepo pnpm
- `tsconfig.base.json` — TypeScript strict ES2022
- `biome.json` — linting + formatting
- `.gitignore`, `.nvmrc`, `.editorconfig`

### Governança
- `LICENSE` — MIT, Markus Corazzione 2026
- `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `CHANGELOG.md`, `SECURITY.md`
- `README.md` — placeholder com branding MC.

## O que foi criado na ETAPA 4

### Gerador de README (`packages/generator/`)
- `src/readme.ts` — Handlebars template engine: seções Trending, New This Week, All-Time Top 30, By Category, By Agent
- `src/site-data.ts` — helpers para filtrar/buscar snapshots
- `src/index.ts` — re-exports públicos
- `templates/README.md.hbs` — template com marcadores SKILLPULSE:START/END para updates parciais
- Testes: `src/__tests__/readme.test.ts`, `src/__tests__/site-data.test.ts` (6 testes)

### Site Astro (`site/`)
- `src/pages/index.astro` — hero + top trending grid
- `src/pages/all.astro` — listagem completa com Fuse.js search e filtro por categoria
- `src/pages/about.astro` — como funciona o pipeline
- `src/pages/stats.astro` — métricas do ecossistema (by kind, by category)
- `src/layouts/Base.astro` — layout com header/footer, SEO meta, Open Graph
- `src/components/EntryCard.astro` — card de skill reutilizável
- MC. dark theme: bg `#0F0F0F`, accent `#D4882A`, gold `#C9A84C`, Outfit + Space Mono
- Atalho `/` para focar busca

### Script de integração
- `scripts/build-everything.ts` — gera README + build do site em sequência
- `pnpm build:all` no root

## O que foi criado na ETAPA 5

### GitHub Actions Workflows
- `.github/workflows/refresh.yml` — cron 6h: ingest → budget check → classify → build → write-health → commit → deploy
- `.github/workflows/deploy-site.yml` — deploy on push to site/data/generator paths
- `.github/workflows/bot.yml` — issue bot trigger (opened + comment)
- `.github/workflows/weekly-digest.yml` — Monday 12 UTC digest generation
- `.github/workflows/ci.yml` — updated with --dry-run build step

### Bot de Issues (`packages/bot/`)
- `src/types.ts` — IssueOpenedPayload, IssueCommentPayload, GitHubPayload
- `src/handlers/on-issue-opened.ts` — submission queuing, duplicate detection, stale URL verification
- `src/handlers/on-comment.ts` — /refresh command handler
- `src/index.ts` — event dispatcher (GITHUB_EVENT_PATH)
- `src/__tests__/bot.test.ts` — unit tests

### Scripts adicionais
- `scripts/check-budget.ts` — monthly spend guard, exits 1 if over limit
- `scripts/write-health.ts` — writes data/health.json after every refresh
- `scripts/generate-digest.ts` — weekly markdown digest in digests/

### Outros
- `.github/dependabot.yml` — npm + actions weekly updates
- `digests/.gitkeep` — placeholder para digestos semanais

## O que foi criado na ETAPA 6

### Documentação
- `METHODOLOGY.md` — scoring algorithm, classification pipeline, dedup, caching, cost
- `ARCHITECTURE.md` — data flow diagram, monorepo structure, key design decisions
- `FAQ.md` — common questions answered (stale lists, accuracy, cost, forking, submissions)

### Branding Assets
- `.github/assets/banner.svg` — 1200x400 hero banner (MC. dark theme)
- `.github/assets/logo.svg` — 512x512 square logo with SP monogram

### Launch Materials
- `launch/HN-post.md` — Show HN submission copy
- `launch/reddit-posts.md` — Posts for r/ClaudeAI, r/LocalLLaMA, r/programming
- `launch/twitter-thread.md` — 7-tweet launch thread
- `launch/producthunt.md` — Product Hunt tagline, description, gallery captions
- `launch/launch-checklist.md` — T-24h / T-1h / T-0 / T+1h / T+24h / T+7d checklist

### Scripts
- `scripts/setup-repo.ts` — sets GitHub repo description and topics via Octokit API

### Release
- `releases/v1.0.0.md` — full feature summary for v1.0.0 public launch

### README
- Polished for public launch: hero banner, badges, clear CTAs, methodology links

## ETAPA 7 — Growth & Distribution (v1.1.0)

The "growth layer" that turns every Claude Code user into a passive contributor.

### `@skillpulse/cli` (`packages/cli/`)
- `skillpulse share` — interactive scan of `~/.claude/` (MCPs via settings.json, skills via SKILL.md, plugins) with first-run consent flow and anonymous user hash
- `skillpulse share --silent` — hook-friendly; queues payload locally, throttled 24h, no prompts
- `skillpulse discover [--top N --category X --json]` — fetches `data/snapshots/latest.json` and prints top-ranked entries
- `skillpulse install <name>` — resolves npm/github source and installs
- Privacy-first: 16-char sha256 user id, names + public URLs only, never keys/tokens
- Opt-out: `rm -rf ~/.skillpulse`

### Claude Code hook integration
- Documented one-line addition to `~/.claude/settings.json` that auto-shares on SessionStart
- `docs/SHARE-YOUR-SETUP.md` — privacy policy + setup

### Static JSON API (`data/api/v1/`)
- `all.json`, `trending.json`, `new.json`, `stats.json`
- `by-category/{cat}.json`, `by-agent/{agent}.json`
- Built by `scripts/build-api.ts`, wired into refresh.yml

### Embeddable SVG badges (`data/api/v1/badges/*.svg`)
- Per-entry pulse badge + overall entries badge
- Built by `scripts/build-badges.ts`, wired into refresh.yml

### Bot telemetry handler
- `packages/bot/src/handlers/on-issue-opened.ts` parses issues with label `telemetry:anonymous`, extracts embedded JSON, appends URLs to pending-submissions, auto-closes

### Discord webhook
- Weekly digest posts to `DISCORD_WEBHOOK_URL` (optional secret) with top-3 new entries

### Recommendation engine (`packages/generator/src/recommend.ts`)
- `recommendSimilar(snapshot, entry, n)` — category/tags/compat/kind similarity
- `recommendForUser(snapshot, userHas, n)` — boosts by shared category/tags

### Launch materials updated
- `launch/HN-post.md`, `launch/twitter-thread.md`, `launch/reddit-posts.md` re-angled around "every user is a contributor"
- `launch/README.md` — asset index

## Post-Launch Ideas

Ideas for future iterations after v1.0.0:

- **More sources** — VS Code Marketplace, Cursor Directory, OpenAI plugin store, Smithery registry
- **Discord webhook** — post top new entries to a community Discord channel on each refresh
- **REST API endpoint** — serve `data/snapshots/latest.json` via a simple read API (Cloudflare Workers)
- **CLI tool** — `npx skillpulse search <query>` to query the registry from the terminal
- **Email digest** — weekly top-10 digest via Resend or Buttondown
- **Plausible analytics** — privacy-friendly traffic tracking on the static site
- **GitHub Discussions** — auto-post weekly digest as a Discussion for community engagement
- **Contributor leaderboard** — track who submits the most skills via issues
- **RSS feed** — `data/feed.xml` with new entries for feed readers

## Stack

- **Linguagem:** TypeScript (Node 20+, ESM, strict)
- **Package manager:** pnpm (lock file commitado)
- **Lint/format:** Biome
- **Testes:** Vitest
- **CI:** GitHub Actions
- **Site:** Astro 5 (SSG, `site/`, deploy para GitHub Pages)
- **IA:** Anthropic Claude haiku-4-5 / sonnet-4-6

## Branding (MC.)

- Background: `#0F0F0F`
- Accent laranja: `#D4882A`
- Dourado: `#C9A84C`
- Tipografia: Outfit 800 (headings), Space Mono (código)
- Assinatura: "MC." com quadrado laranja

## Repositório GitHub

https://github.com/corazzione/skillpulse
