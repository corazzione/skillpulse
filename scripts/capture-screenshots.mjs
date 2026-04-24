import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const outDir = join(process.cwd(), 'launch', 'img');
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
  colorScheme: 'dark',
});
const page = await ctx.newPage();

async function shoot(url, filename, clip) {
  console.log(`→ ${filename}`);
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const opts = { path: join(outDir, filename), type: 'png' };
  if (clip) opts.clip = clip;
  else opts.fullPage = false;
  await page.screenshot(opts);
}

// 1. Hero — full desktop viewport of homepage
await shoot('https://corazzione.github.io/skillpulse/', '01-hero.png');

// 2. Stats page
await shoot('https://corazzione.github.io/skillpulse/stats/', '02-stats.png');

// 3. All-skills page (bonus — great for r/cursor showing filters)
await shoot('https://corazzione.github.io/skillpulse/all/', '05-all-skills.png');

// 4. README top section on GitHub — trending table
await page.goto('https://github.com/corazzione/skillpulse', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
// Scroll to the trending table
await page.evaluate(() => {
  const h = [...document.querySelectorAll('h2, h3')].find((el) =>
    el.textContent?.includes('Trending'),
  );
  if (h) h.scrollIntoView({ block: 'start' });
});
await page.waitForTimeout(500);
await page.screenshot({ path: join(outDir, '04-readme.png'), fullPage: false });

await browser.close();
console.log(`\nSaved 4 images → ${outDir}`);
