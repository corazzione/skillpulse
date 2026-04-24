import { chromium } from 'playwright';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const outDir = join(process.cwd(), 'launch', 'img');
await mkdir(outDir, { recursive: true });

const html = `<!DOCTYPE html>
<html>
<head>
<style>
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap');
  body {
    margin: 0;
    background: #0a0a0a;
    padding: 40px;
    font-family: 'JetBrains Mono', monospace;
  }
  .term {
    background: #0F0F0F;
    border: 1px solid #2a2a2a;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    max-width: 900px;
    margin: 0 auto;
    overflow: hidden;
  }
  .titlebar {
    background: #1a1a1a;
    padding: 12px 16px;
    display: flex;
    gap: 8px;
    align-items: center;
    border-bottom: 1px solid #2a2a2a;
  }
  .dot { width: 12px; height: 12px; border-radius: 50%; }
  .dot.red { background: #ff5f57; }
  .dot.yellow { background: #febc2e; }
  .dot.green { background: #28c840; }
  .title { color: #6a6a6a; font-size: 12px; margin-left: 12px; }
  .body {
    padding: 20px 24px 28px;
    color: #e5e5e5;
    font-size: 13px;
    line-height: 1.55;
  }
  .prompt { color: #D4882A; }
  .user { color: #C9A84C; }
  .muted { color: #6a6a6a; }
  .green { color: #28c840; }
  .accent { color: #D4882A; }
  .gold { color: #C9A84C; }
  .white { color: #fafafa; font-weight: 600; }
  .tag-claude { color: #D4882A; }
  .tag-cursor { color: #C9A84C; }
  .tag-windsurf { color: #5eb3ff; }
  .kind { color: #888; font-style: italic; }
  .dim { opacity: 0.75; }
  .banner {
    background: rgba(212, 136, 42, 0.08);
    border-left: 3px solid #D4882A;
    padding: 10px 14px;
    margin: 10px 0 16px;
    color: #ccc;
  }
</style>
</head>
<body>
<div class="term">
  <div class="titlebar">
    <div class="dot red"></div>
    <div class="dot yellow"></div>
    <div class="dot green"></div>
    <div class="title">markus@dev — skillpulse share</div>
  </div>
  <div class="body">
    <div><span class="prompt">$</span> <span class="white">npx @skillpulse/cli share --dry-run</span></div>
    <br>
    <div class="banner">
      <span class="accent">SkillPulse</span> <span class="muted">v1.2.0</span><br>
      Scanning <span class="gold">Claude Code</span> · <span class="gold">Cursor</span> · <span class="gold">Windsurf</span> · <span class="gold">Codex CLI</span> · <span class="gold">Gemini CLI</span>…
    </div>
    <div>  <span class="green">✓</span> Found <span class="white">27</span> MCPs across <span class="accent">[Claude Code, Cursor, Windsurf]</span>:</div>
    <br>
    <div>    <span class="white">adapt</span> <span class="kind">(skill)</span> <span class="muted">—</span> detected by <span class="tag-claude">Claude Code</span></div>
    <div>    <span class="white">audit</span> <span class="kind">(skill)</span> <span class="muted">—</span> detected by <span class="tag-claude">Claude Code</span></div>
    <div>    <span class="white">frontend-design</span> <span class="kind">(skill)</span> <span class="muted">—</span> detected by <span class="tag-claude">Claude Code</span></div>
    <div>    <span class="white">harden</span> <span class="kind">(skill)</span> <span class="muted">—</span> detected by <span class="tag-claude">Claude Code</span></div>
    <div>    <span class="white">optimize</span> <span class="kind">(skill)</span> <span class="muted">—</span> detected by <span class="tag-claude">Claude Code</span></div>
    <div>    <span class="white">teach-impeccable</span> <span class="kind">(skill)</span> <span class="muted">—</span> detected by <span class="tag-claude">Claude Code</span></div>
    <div>    <span class="white">ui-ux-pro-max</span> <span class="kind">(skill)</span> <span class="muted">—</span> detected by <span class="tag-claude">Claude Code</span></div>
    <div>    <span class="white">cache</span> <span class="kind">(plugin)</span> <span class="muted">—</span> detected by <span class="tag-claude">Claude Code</span></div>
    <div>    <span class="white">marketplaces</span> <span class="kind">(plugin)</span> <span class="muted">—</span> detected by <span class="tag-claude">Claude Code</span></div>
    <div>    <span class="white">n8n</span> <span class="kind">(mcp-server)</span> <span class="muted">—</span> detected by <span class="tag-cursor">Cursor</span></div>
    <div>    <span class="white">global_rules</span> <span class="kind">(skill)</span> <span class="muted">—</span> detected by <span class="tag-windsurf">Windsurf</span></div>
    <div class="muted">    …and 16 more</div>
    <br>
    <div class="muted">  Dry run — nothing was shared.</div>
    <div class="muted">  Run without <span class="accent">--dry-run</span> to contribute (opens pre-filled GitHub issue, anonymous).</div>
    <br>
    <div><span class="prompt">$</span> <span style="background:#D4882A;width:8px;height:14px;display:inline-block;vertical-align:text-bottom;"></span></div>
  </div>
</div>
</body>
</html>`;

const tmpPath = join(outDir, '_cli.html');
await writeFile(tmpPath, html);

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1000, height: 720 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();
await page.goto(`file:///${tmpPath.replace(/\\/g, '/')}`);
await page.waitForTimeout(500);
// screenshot just the terminal card, with padding
const el = await page.locator('.term');
await el.screenshot({ path: join(outDir, '03-cli.png') });
await browser.close();
console.log('→ 03-cli.png');
