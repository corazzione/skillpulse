# SkillPulse — Roadmap de Execução

> Atualizado automaticamente. Para uso de agentes futuros que continuem este projeto.

## Status das Etapas

| Etapa | Descrição | Status | Commit |
|-------|-----------|--------|--------|
| ETAPA 1 | Fundação, arquitetura e esqueleto | Concluído | v0.1.0 |
| ETAPA 2 | Ingestores (scrapers) | ✅ Concluído | v0.2.0 |
| ETAPA 3 | Classificador de IA e scoring | Pendente | — |
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

## Para continuar (ETAPA 3)

O próximo agente deve:
1. Ler `skillpulse-claude-code-plan.md` (seção ETAPA 3)
2. Estar na pasta `E:/skillpulse/`
3. Ter `ANTHROPIC_API_KEY` e `GITHUB_TOKEN` disponíveis
4. Implementar o classificador em `packages/classifier/`:
   - Usar Claude haiku-4-5 para classificar `RawSkillResult` em `SkillEntry`
   - Detectar `kind` (mcp-server, skill, plugin, prompt-pack, cli-tool)
   - Detectar `compat` (claude-code, cursor, codex-cli, etc.)
   - Calcular `pulseScore` e `trend`
5. Integrar classificador com dados de `data/raw/*.json`
6. Gerar `data/classified/*.json` com `DataSnapshot`

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
