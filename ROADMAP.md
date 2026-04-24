# SkillPulse — Roadmap de Execução

> Atualizado automaticamente. Para uso de agentes futuros que continuem este projeto.

## Status das Etapas

| Etapa | Descrição | Status | Commit |
|-------|-----------|--------|--------|
| ETAPA 1 | Fundação, arquitetura e esqueleto | Concluído | v0.1.0 |
| ETAPA 2 | Ingestores (scrapers) | ✅ Concluído | v0.2.0 |
| ETAPA 3 | Classificador de IA e scoring | ✅ Concluído | v0.3.0 |
| ETAPA 4 | Gerador de README e site estático | ✅ Concluído | v0.4.0 |
| ETAPA 5 | GitHub Actions e bot de issues | Pendente | — |
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

## Para continuar (ETAPA 5)

O próximo agente deve implementar GitHub Actions automação e bot de issues:

1. Estar na pasta `E:/skillpulse/`
2. O pipeline completo já está funcional:
   - Ingestores: `packages/ingestors/` + `scripts/run-ingestors.ts`
   - Classificador: `packages/classifier/` + `scripts/run-classifier.ts`
   - Gerador: `packages/generator/` + `scripts/build-everything.ts`
3. Implementar `.github/workflows/refresh.yml`:
   - Trigger: schedule (a cada 6h) + workflow_dispatch
   - Steps: pnpm install → ingest → classify → build:all → commit README e data → deploy site para GitHub Pages
   - Usar `ANTHROPIC_API_KEY` como secret
4. Implementar `packages/bot/` — bot de triagem de issues:
   - Ler issues com label `submit-skill`
   - Extrair URL do campo da issue
   - Ingerir URL individualmente via ingestor
   - Classificar e adicionar ao snapshot
   - Comentar na issue com resultado
   - Fechar issue como resolvida
5. Workflow `.github/workflows/bot.yml`:
   - Trigger: `issues` (opened, labeled)
   - Chamar o bot quando label `submit-skill` adicionada
6. Deploy para GitHub Pages:
   - Output do Astro build em `site/dist/`
   - Publicar via `actions/deploy-pages`
   - URL final: `https://corazzione.github.io/skillpulse`

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
