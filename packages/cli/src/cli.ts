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
  ${kleur.cyan('discover')}         Show top 20 trending skills
  ${kleur.cyan('discover --top 50 --category testing')}
  ${kleur.cyan('install <name>')}   Install a skill/MCP by name

${kleur.bold('Flags:')}
  --help, -h       Show this message
  --version, -v    Show version

${kleur.dim('Learn more: https://corazzione.github.io/skillpulse')}
`);
}

async function main(): Promise<void> {
  if (!cmd || cmd === '--help' || cmd === '-h') {
    showHelp();
    return;
  }
  if (cmd === '--version' || cmd === '-v') {
    console.log('1.1.0');
    return;
  }

  switch (cmd) {
    case 'share': {
      const silent = rest.includes('--silent');
      await share({ silent });
      break;
    }
    case 'discover': {
      const topIdx = rest.indexOf('--top');
      const catIdx = rest.indexOf('--category');
      const json = rest.includes('--json');
      const topVal = topIdx >= 0 ? rest[topIdx + 1] : undefined;
      const catVal = catIdx >= 0 ? rest[catIdx + 1] : undefined;
      await discover({
        ...(topVal ? { top: Number.parseInt(topVal, 10) } : {}),
        ...(catVal ? { category: catVal } : {}),
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
