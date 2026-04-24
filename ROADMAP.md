# SkillPulse — Roadmap de Execução

> Atualizado automaticamente. Para uso de agentes futuros que continuem este projeto.

## Status das Etapas

| Etapa | Descrição | Status | Commit |
|-------|-----------|--------|--------|
| ETAPA 1 | Fundação, arquitetura e esqueleto | Concluído | v0.1.0 |
| ETAPA 2 | Ingestores (scrapers) | ✅ Concluído | v0.2.0 |
| ETAPA 3 | Classificador de IA e scoring | ✅ Concluído | v0.3.0 |
| ETAPA 4 | Gerador de README e site estático | Pendente | — |
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

## Para continuar (ETAPA 4)

O próximo agente deve implementar o gerador de README e site estático:

1. Ler `skillpulse-claude-code-plan.md` (seção ETAPA 4)
2. Estar na pasta `E:/skillpulse/`
3. O pipeline classificador já está funcional em `packages/classifier/`
4. O snapshot mais recente estará em `data/snapshots/latest.json` (formato `DataSnapshot`)
5. Implementar `packages/generator/` para:
   - Ler `data/snapshots/latest.json`
   - Gerar `README.md` atualizado na raiz com tabela de top skills por categoria
   - Gerar badges/shields dinâmicos
6. Inicializar site Astro em `site/` com:
   - Branding MC. (background `#0F0F0F`, accent `#D4882A`, dourado `#C9A84C`)
   - Tipografia: Outfit 800 (headings), Space Mono (código)
   - Listagem de skills por categoria, paginada
   - Página de detalhes por skill
   - Busca client-side
   - SSG (static site generation) com dados de `data/snapshots/latest.json`
7. Script `scripts/run-generator.ts` + `pnpm generate` no root

## Stack

- **Linguagem:** TypeScript (Node 20+, ESM, strict)
- **Package manager:** pnpm (lock file commitado)
- **Lint/format:** Biome
- **Testes:** Vitest
- **CI:** GitHub Actions
- **Site:** Astro (a ser inicializado na ETAPA 4)
- **IA:** Anthropic Claude haiku-4-5 / sonnet-4-6

## Branding (MC.)

- Background: `#0F0F0F`
- Accent laranja: `#D4882A`
- Dourado: `#C9A84C`
- Tipografia: Outfit 800 (headings), Space Mono (código)
- Assinatura: "MC." com quadrado laranja

## Repositório GitHub

https://github.com/corazzione/skillpulse
