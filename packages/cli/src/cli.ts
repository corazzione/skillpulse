#!/usr/bin/env node
import kleur from 'kleur';
import { discover } from './commands/discover.js';
import { install } from './commands/install.js';
import { share } from './commands/share.js';

const args = process.argv.slice(2);
const [cmd, ...rest] = args;

function showHelp(): void {
  console.log(`
${kleur.bold().yellow('SkillPulse CLI')} — The living registry of AI agent skills

${kleur.bold('Commands:')}
  ${kleur.cyan('share')}            Share your local MCPs & skills (anonymous)
  ${kleur.cyan('share --silent')}   Queue share without prompts (for hooks)
  ${kleur.cyan('share --dry-run')}  Detect without sharing
  ${kleur.cyan('discover')}         Show top 20 trending skills
  ${kleur.cyan('discover --top 50 --category testing')}
  ${kleur.cyan('discover --agent cursor')}   Filter by IDE compatibility
  ${kleur.cyan('install <name>')}   Install a skill/MCP by name

${kleur.bold('Flags:')}
  --help, -h       Show this message
  --version, -v    Show version

${kleur.dim('Supported agents: claude-code, cursor, windsurf, codex-cli, gemini-cli')}
${kleur.dim('Learn more: https://corazzione.github.io/skillpulse')}
`);
}

async function main(): Promise<void> {
  if (!cmd || cmd === '--help' || cmd === '-h') {
    showHelp();
    return;
  }
  if (cmd === '--version' || cmd === '-v') {
    console.log('1.2.0');
    return;
  }

  switch (cmd) {
    case 'share': {
      const silent = rest.includes('--silent');
      const dryRun = rest.includes('--dry-run');
      if (dryRun) {
        // Dry-run: detect and print without sharing
        const { detect: detectClaude } = await import('./detectors/claude.js');
        const { detect: detectCursor } = await import('./detectors/cursor.js');
        const { detect: detectWindsurf } = await import('./detectors/windsurf.js');
        const { detect: detectCodex } = await import('./detectors/codex.js');
        const { detect: detectGemini } = await import('./detectors/gemini.js');
        const [claude, cursor, windsurf, codex, gemini] = await Promise.all([
          detectClaude(),
          detectCursor(),
          detectWindsurf(),
          detectCodex(),
          detectGemini(),
        ]);
        const all = [...claude, ...cursor, ...windsurf, ...codex, ...gemini];
        if (all.length === 0) {
          console.log(kleur.dim('  No local MCPs or skills detected.'));
        } else {
          const agentLabels: Record<string, string> = {
            'claude-code': 'Claude Code',
            cursor: 'Cursor',
            windsurf: 'Windsurf',
            'codex-cli': 'Codex CLI',
            'gemini-cli': 'Gemini CLI',
          };
          const agents = [...new Set(all.map((e) => e.detectedBy))];
          const agentList = agents.map((a) => agentLabels[a] ?? a).join(', ');
          console.log(kleur.green(`\n  Found ${all.length} MCPs across [${agentList}]:`));
          for (const e of all) {
            const label = agentLabels[e.detectedBy] ?? e.detectedBy;
            console.log(kleur.dim(`    ${e.name} (${e.kind}) — detected by ${label}`));
          }
          console.log();
          console.log(kleur.dim('  Dry run — nothing was shared.'));
        }
        break;
      }
      await share({ silent });
      break;
    }
    case 'discover': {
      const topIdx = rest.indexOf('--top');
      const catIdx = rest.indexOf('--category');
      const agentIdx = rest.indexOf('--agent');
      const json = rest.includes('--json');
      const topVal = topIdx >= 0 ? rest[topIdx + 1] : undefined;
      const catVal = catIdx >= 0 ? rest[catIdx + 1] : undefined;
      const agentVal = agentIdx >= 0 ? rest[agentIdx + 1] : undefined;
      await discover({
        ...(topVal ? { top: Number.parseInt(topVal, 10) } : {}),
        ...(catVal ? { category: catVal } : {}),
        ...(agentVal ? { agent: agentVal } : {}),
        json,
      });
      break;
    }
    case 'install': {
      const name = rest[0];
      if (!name) {
        console.error(kleur.red('Usage: skillpulse install <name>'));
        process.exit(1);
      }
      await install(name);
      break;
    }
    default:
      console.error(kleur.red(`Unknown command: ${cmd}`));
      showHelp();
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(kleur.red(String(err)));
  process.exit(1);
});
