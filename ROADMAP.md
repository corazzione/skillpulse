# SkillPulse — Roadmap de Execução

> Atualizado automaticamente. Para uso de agentes futuros que continuem este projeto.

## Status das Etapas

| Etapa | Descrição | Status | Commit |
|-------|-----------|--------|--------|
| ETAPA 1 | Fundação, arquitetura e esqueleto | Concluído | v0.1.0 |
| ETAPA 2 | Ingestores (scrapers) | ✅ Concluído | v0.2.0 |
| ETAPA 3 | Classificador de IA e scoring | ✅ Concluído | v0.3.0 |
| ETAPA 4 | Gerador de README e site estático | ✅ Concluído | v0.4.0 |
| ETAPA 5 | GitHub Actions e bot de issues | Concluído | v0.5.0 |
| ETAPA 6 | Launch, SEO e distribuição | Pendente | — |

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

## Para continuar (ETAPA 6)

O próximo agente deve implementar launch, SEO e materiais de distribuição:

1. Estar na pasta `E:/skillpulse/`
2. Configurar GitHub Pages no repositório:
   - Settings → Pages → Source: GitHub Actions
   - Adicionar secret `ANTHROPIC_API_KEY` em Settings → Secrets
   - Adicionar variável `ANTHROPIC_MONTHLY_BUDGET_USD` em Settings → Variables (valor: `50`)
3. SEO e branding assets:
   - Criar `site/public/og-image.png` (1200x630, MC. dark theme)
   - Criar `site/public/favicon.ico` e `site/public/favicon.svg`
   - Verificar og:image, og:title, og:description em todas as páginas
   - Adicionar `site/public/robots.txt` e `site/public/sitemap.xml` (ou gerar via Astro)
4. Metodologia e documentação:
   - Criar `METHODOLOGY.md` explicando o pipeline e fórmula do Pulse Score
   - Atualizar `CONTRIBUTING.md` com processo de submissão via issues
   - Criar `.github/ISSUE_TEMPLATE/submit-skill.yml` e `report-stale.yml` se não existirem
5. Launch materials:
   - Criar post de launch para Hacker News (Show HN)
   - Criar post para Reddit r/MachineLearning / r/ClaudeAI
   - Criar announcement para GitHub Discussions
6. Monitoramento:
   - Verificar que `data/health.json` é atualizado após primeiro refresh
   - Testar bot de issues com issue real de submissão
   - Confirmar URL final: `https://corazzione.github.io/skillpulse`

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
