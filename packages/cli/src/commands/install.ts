import { execSync } from 'node:child_process';
import kleur from 'kleur';

const DATA_URL =
  'https://raw.githubusercontent.com/corazzione/skillpulse/main/data/snapshots/latest.json';

interface Entry {
  name: string;
  sourceUrl: string;
  kind: string;
  source: string;
}

export async function install(name: string): Promise<void> {
  const res = await fetch(DATA_URL);
  if (!res.ok) {
    console.error(kleur.red(`Failed to fetch registry: ${res.status}`));
    process.exit(1);
  }
  const snapshot = (await res.json()) as { entries: Entry[] };

  const matches = snapshot.entries.filter(
    (e) =>
      e.name.toLowerCase() === name.toLowerCase() ||
      e.name.toLowerCase().includes(name.toLowerCase()),
  );
  if (matches.length === 0) {
    console.error(kleur.red(`No match found for "${name}".`));
    console.log(kleur.dim('Try: skillpulse discover'));
    process.exit(1);
  }

  const entry = matches[0];
  if (!entry) {
    process.exit(1);
  }
  console.log(kleur.bold(`\n  Found: ${entry.name} (${entry.kind})`));
  console.log(kleur.dim(`  Source: ${entry.sourceUrl}\n`));

  if (entry.source === 'npm') {
    const pkg = entry.name;
    console.log(kleur.cyan(`  $ npm install -g ${pkg}`));
    execSync(`npm install -g ${pkg}`, { stdio: 'inherit' });
  } else if (entry.sourceUrl.includes('github.com')) {
    console.log(kleur.yellow('  GitHub repo — clone with:'));
    console.log(kleur.cyan(`  $ git clone ${entry.sourceUrl}`));
  } else {
    console.log(kleur.yellow(`  Install manually from: ${entry.sourceUrl}`));
  }
}
