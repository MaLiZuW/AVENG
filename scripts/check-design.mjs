#!/usr/bin/env node
// Structural design/accessibility gate for the static export.
// Usage: node scripts/check-design.mjs [--out=out]
// Checks what can be verified from HTML/CSS (not visual quality, not real contrast).
import fs from 'node:fs';
import path from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).map((a) => a.replace(/^--/, '').split('=')));
const OUT = path.resolve(args.out || 'out');
const fails = [];
const warns = [];
const fail = (m) => fails.push(m);
const warn = (m) => warns.push(m);

if (!fs.existsSync(OUT)) {
  console.error(`Missing ${OUT}. Run "npm run build" first.`);
  process.exit(1);
}

const seo = JSON.parse(fs.readFileSync(path.resolve('docs/content-v2/seo.json'), 'utf8'));
const routes = Object.keys(seo);
const PROJECTS = [
  '/sluzby/procesny-audit-identifikacia-problemu/',
  '/sluzby/projekt-zmeny-eco/',
  '/sluzby/sprava-dokumentacie-a-schvalovanie/',
  '/sluzby/rozvoj-liderov-koucing/',
  '/optimalizacia-a-ai/',
];
const file = (r) => path.join(OUT, r === '/' ? '' : r, 'index.html');
const strip = (s) => s.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

for (const route of routes) {
  const f = file(route);
  const tag = `[${route}]`;
  if (!fs.existsSync(f)) {
    warn(`${tag} not built (skipped)`);
    continue;
  }
  const html = fs.readFileSync(f, 'utf8');

  // landmarks
  const mains = (html.match(/<main[\s>]/gi) || []).length;
  if (mains !== 1) fail(`${tag} expected exactly one <main>, found ${mains}`);
  if (!/<header[\s>]/i.test(html)) fail(`${tag} missing <header>`);
  if (!/<footer[\s>]/i.test(html)) fail(`${tag} missing <footer>`);
  if (!/<nav[\s>]/i.test(html)) fail(`${tag} missing <nav>`);
  if (!/<meta[^>]+name="viewport"/i.test(html)) fail(`${tag} missing viewport meta`);

  // skip link
  if (!/<a[^>]+href="#(main|content|obsah)"/i.test(html)) fail(`${tag} missing skip link to #main`);
  if (!/id="(main|content|obsah)"/i.test(html)) fail(`${tag} no element with id="main"`);

  // active navigation item
  if (!/aria-current="page"/i.test(html)) fail(`${tag} no aria-current="page" in navigation`);

  // heading order
  const levels = [...html.matchAll(/<h([1-6])[\s>]/gi)].map((m) => Number(m[1]));
  if (levels.length && levels[0] !== 1) fail(`${tag} first heading is h${levels[0]}, expected h1`);
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] - levels[i - 1] > 1) {
      fail(`${tag} heading level skips from h${levels[i - 1]} to h${levels[i]}`);
      break;
    }
  }

  // images
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    const t = m[0];
    if (!/\balt=/i.test(t)) fail(`${tag} <img> without alt: ${t.slice(0, 80)}`);
    if (!/\bwidth=/i.test(t) || !/\bheight=/i.test(t)) fail(`${tag} <img> without width/height: ${t.slice(0, 80)}`);
  }

  // tiny text utility classes
  if (/text-\[(?:[0-9]|1[01])px\]/.test(html)) fail(`${tag} font size below 12px (text-[Npx])`);

  // conversion path
  const header = (html.match(/<header[\s\S]*?<\/header>/i) || [''])[0];
  if (route !== '/kontakt/' && !/href="\/kontakt\/?(\?[^"]*)?"/i.test(header)) fail(`${tag} header lacks the primary CTA to /kontakt/`);
  const mainHtml = (html.match(/<main[\s\S]*?<\/main>/i) || [''])[0];
  if (route !== '/kontakt/' && !/href="\/kontakt\/?(\?[^"]*)?"/i.test(mainHtml)) fail(`${tag} no link to /kontakt/ inside <main>`);

  // footer project links
  const footer = (html.match(/<footer[\s\S]*?<\/footer>/i) || [''])[0];
  for (const p of PROJECTS) if (!footer.includes(`href="${p}"`)) fail(`${tag} footer lacks link to ${p}`);

  // route-specific
  if (route === '/self-audit/') {
    if (/Cenová ponuka podľa rozsahu/.test(strip(html))) fail(`${tag} Level 3 label must be "Podľa dohody"`);
    const starts = (strip(mainHtml).match(/Spustiť audit/g) || []).length;
    if (starts > 1) warn(`${tag} "Spustiť audit" appears ${starts} times in main (expected 1 button)`);
  }
  if (route === '/sluzby/' && /Pravidlá hry/.test(strip(html))) fail(`${tag} heading must be "Pravidlá spolupráce"`);
}

// CSS checks
const cssDir = path.join(OUT, '_next', 'static', 'css');
let css = '';
if (fs.existsSync(cssDir)) for (const f of fs.readdirSync(cssDir)) if (f.endsWith('.css')) css += fs.readFileSync(path.join(cssDir, f), 'utf8');
if (!css) warn('no CSS found under out/_next/static/css (CSS checks skipped)');
else {
  if (!/prefers-reduced-motion/.test(css)) fail('CSS has no prefers-reduced-motion rule');
  if (!/:focus-visible|focus-visible\\:/.test(css)) fail('CSS has no :focus-visible styles');
  if (!/scroll-padding-top|scroll-pt-/.test(css)) warn('CSS has no scroll-padding-top (sticky header may cover focused elements)');
  const tiny = [...css.matchAll(/font-size:\s*(\d+(?:\.\d+)?)px/g)].filter((m) => Number(m[1]) < 12);
  if (tiny.length) warn(`CSS has ${tiny.length} font-size declaration(s) below 12px`);
}

console.log(`Checked ${routes.length} routes.`);
for (const w of warns) console.log('WARN  ' + w);
for (const f of fails) console.log('FAIL  ' + f);
console.log(fails.length ? `\n${fails.length} failure(s).` : '\nAll design checks passed.');
process.exit(fails.length ? 1 : 0);
