import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

async function main() {
  const budget = Number.parseFloat(process.env.ANTHROPIC_MONTHLY_BUDGET_USD ?? '50');
  const logDir = join(process.cwd(), 'data', 'logs');

  if (!existsSync(logDir)) {
    console.log(JSON.stringify({ level: 'info', msg: 'No cost logs found, budget OK', budget }));
    return;
  }

  const now = new Date();
  const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const files = (await readdir(logDir)).filter(
    (f) => f.startsWith('cost-') && f.includes(monthPrefix) && f.endsWith('.jsonl'),
  );

  let totalUSD = 0;
  for (const file of files) {
    const lines = (await readFile(join(logDir, file), 'utf-8')).trim().split('\n').filter(Boolean);
    for (const line of lines) {
      try {
        const entry = JSON.parse(line) as { estimatedUSD?: number };
        totalUSD += entry.estimatedUSD ?? 0;
      } catch {
        /* malformed line */
      }
    }
  }

  console.log(
    JSON.stringify({
      level: 'info',
      msg: 'Budget check',
      totalUSD: totalUSD.toFixed(4),
      budget,
      remaining: (budget - totalUSD).toFixed(4),
      withinBudget: totalUSD < budget,
    }),
  );

  if (totalUSD >= budget) {
    console.error(
      JSON.stringify({
        level: 'error',
        msg: `Budget exceeded! Spent $${totalUSD.toFixed(2)} of $${budget} monthly limit. Aborting classifier.`,
      }),
    );
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(JSON.stringify({ level: 'error', error: String(err) }));
  process.exit(1);
});
