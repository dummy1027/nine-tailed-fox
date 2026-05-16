import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, 'screenshots');
fs.mkdirSync(OUT, { recursive: true });

const BASE = process.env.SITE_BASE || 'http://localhost:5174';
const routes = [
  { name: 'home',          path: '/' },
  { name: 'basics',        path: '/basics' },
  { name: 'community',     path: '/community' },
  { name: 'workbook',      path: '/workbook' },
  { name: 'ranking',       path: '/ranking' },
  { name: 'server-status', path: '/server-status' },
  { name: 'c-preview',     path: '/c-preview' },
];

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 1.25,
});
const page = await ctx.newPage();

for (const r of routes) {
  const url = BASE + r.path;
  process.stdout.write(`  ${r.name.padEnd(15)} ${url}  `);
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(800);
    const file = path.join(OUT, `${r.name}.png`);
    await page.screenshot({ path: file, fullPage: false });
    console.log('✓');
  } catch (e) {
    console.log('실패:', e.message);
  }
}

await browser.close();
console.log('완료:', OUT);
