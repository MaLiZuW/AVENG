#!/usr/bin/env node
// Content/SEO gate for the static export. Usage: node scripts/check-content.mjs [--phase=1..4] [--out=out]
// Node built-ins only. Exit code 1 on any failure.
import fs from 'node:fs';
import path from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).map((a) => a.replace(/^--/, '').split('=')));
const PHASE = Number(args.phase || 1);
const OUT = path.resolve(args.out || 'out');
const SPEC = path.resolve('docs/content-v2');
const BASE = 'https://www.addvalueengineering.sk';

const fails = [];
const warns = [];
const fail = (m) => fails.push(m);
const warn = (m) => warns.push(m);

const ENT = { '&nbsp;': ' ', '&amp;': '&', '&quot;': '"', '&#x27;': "'", '&#39;': "'", '&lt;': '<', '&gt;': '>', '&ndash;': '–', '&mdash;': '—' };
const decode = (s) =>
  s
    .replace(/&(nbsp|amp|quot|lt|gt|ndash|mdash);|&#x27;|&#39;/g, (m) => ENT[m] ?? m)
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)));
const norm = (s) => decode(s).replace(/[  ]/g, ' ').replace(/\s+/g, ' ').trim();
const stripTags = (s) => s.replace(/<[^>]*>/g, ' ');
const visibleText = (html) =>
  norm(stripTags(html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<!--[\s\S]*?-->/g, ' ')));

if (!fs.existsSync(OUT)) {
  console.error(`Missing ${OUT}. Run "npm run build" first.`);
  process.exit(1);
}

// ---- spec ----
const seo = JSON.parse(fs.readFileSync(path.join(SPEC, 'seo.json'), 'utf8'));
const OPTIONAL = new Set(['/znalosti/', '/znalosti/co-je-eco/']);
const specH1 = {};
for (const f of fs.readdirSync(path.join(SPEC, 'pages'))) {
  const t = fs.readFileSync(path.join(SPEC, 'pages', f), 'utf8');
  const route = (t.match(/^route:\s*(\S+)/m) || [])[1];
  const h1 = (t.match(/^# H1:\s*(.+)$/m) || [])[1];
  if (route && h1) specH1[route] = norm(h1);
}
const routes = Object.keys(seo).filter((r) => PHASE >= 4 || !OPTIONAL.has(r));

// ---- helpers ----
const pageFile = (route) => path.join(OUT, route === '/' ? '' : route, 'index.html');
const metaTags = (html) =>
  [...html.matchAll(/<meta\s+([^>]*?)\/?>/gi)].map((m) => {
    const attrs = {};
    for (const a of m[1].matchAll(/([a-zA-Z:_-]+)\s*=\s*"([^"]*)"/g)) attrs[a[1].toLowerCase()] = a[2];
    return attrs;
  });
const metaVal = (tags, key, by = 'name') => (tags.find((t) => t[by] === key) || {}).content;

const FORBIDDEN = [
  [/fractional/i, 'fractional'],
  [/head of engineering/i, 'Head of Engineering'],
  [/powered by/i, 'Powered by'],
  [/gemba walk/i, 'Gemba Walk'],
  [/morav/i, 'Morava'],
  [/hodinov/i, 'hodinová sadzba'],
  [/€\s*\/\s*h|eur\s*\/\s*h/i, '€/h'],
  [/\bpilier|\bpiliere|pilieri/i, 'pilier'],
];

// ---- per-page checks ----
for (const route of routes) {
  const file = pageFile(route);
  const tag = `[${route}]`;
  if (!fs.existsSync(file)) {
    OPTIONAL.has(route) ? warn(`${tag} not built (optional phase 4)`) : fail(`${tag} missing ${path.relative(process.cwd(), file)}`);
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  const tags = metaTags(html);
  const spec = seo[route];

  if (!/<html[^>]*\slang="sk(-SK)?"/i.test(html)) fail(`${tag} <html lang="sk"> missing`);

  const title = norm((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || '');
  if (!title) fail(`${tag} no <title>`);
  else {
    if (title !== norm(spec.title)) fail(`${tag} title differs from seo.json: "${title}"`);
    if (/\|\s*AVENG\b/.test(title)) fail(`${tag} title uses "AVENG"`);
    if (title.length > 70) fail(`${tag} title too long (${title.length})`);
  }
  const desc = norm(metaVal(tags, 'description') || '');
  if (!desc) fail(`${tag} no meta description`);
  else if (desc !== norm(spec.description)) fail(`${tag} description differs from seo.json`);

  const canon = (html.match(/<link\s+[^>]*rel="canonical"[^>]*>/i) || [''])[0];
  const canonHref = (canon.match(/href="([^"]*)"/) || [])[1];
  if (canonHref !== BASE + route) fail(`${tag} canonical is "${canonHref}", expected "${BASE + route}"`);
  if ((html.match(/rel="canonical"/gi) || []).length !== 1) fail(`${tag} must have exactly one canonical`);

  for (const k of ['og:title', 'og:description', 'og:url', 'og:image', 'og:image:alt']) {
    if (!metaVal(tags, k, 'property')) fail(`${tag} missing ${k}`);
  }
  if (!metaVal(tags, 'twitter:card')) fail(`${tag} missing twitter:card`);
  if (tags.some((t) => t.name === 'googlebot')) warn(`${tag} redundant meta googlebot`);

  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => norm(stripTags(m[1])));
  if (h1s.length !== 1) fail(`${tag} expected exactly one <h1>, found ${h1s.length}`);
  else if (specH1[route] && h1s[0] !== specH1[route]) fail(`${tag} H1 differs from spec: "${h1s[0]}"`);

  const text = visibleText(html);
  for (const [re, name] of FORBIDDEN) {
    if (re.test(text)) {
      // audit question bank may legitimately contain lean terms
      if (route === '/self-audit/' && name === 'Gemba Walk') warn(`${tag} "${name}" present (check it is only in audit questions)`);
      else fail(`${tag} forbidden term "${name}"`);
    }
  }
  if (route !== '/self-audit/') {
    // "Level 2 290 €" must not be read as "2 290 €"
    const priceText = text.replace(/Level\s*[123]/gi, 'Level');
    for (const m of priceText.matchAll(/(\d[\d\s.,]*)\s?€/g)) {
      if (norm(m[1]) !== '290') fail(`${tag} unexpected price "${m[0]}" (only 290 € allowed)`);
    }
  }
  if (/linkedin\.com|facebook\.com|instagram\.com|twitter\.com|[\/.]x\.com\//i.test(html.replace(/<script[\s\S]*?<\/script>/gi, ''))) {
    fail(`${tag} social-network link found`);
  }

  // phase 2: JSON-LD
  const blocks = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
  const types = [];
  const parsed = [];
  for (const b of blocks) {
    try {
      const j = JSON.parse(b);
      for (const node of Array.isArray(j) ? j : j['@graph'] || [j]) {
        parsed.push(node);
        [].concat(node['@type']).forEach((t) => types.push(t));
      }
    } catch {
      fail(`${tag} invalid JSON-LD`);
    }
  }
  if (PHASE >= 2) {
    if (route === '/' && !types.includes('ProfessionalService')) fail(`${tag} missing ProfessionalService`);
    if (route === '/' && !types.includes('WebSite')) fail(`${tag} missing WebSite`);
    if (route !== '/' && !types.includes('BreadcrumbList')) fail(`${tag} missing BreadcrumbList`);
    if (/^\/(sluzby\/.+|optimalizacia-a-ai\/)$/.test(route) && !types.includes('Service')) fail(`${tag} missing Service`);
    if (route === '/znalosti/co-je-eco/' && !types.includes('Article')) fail(`${tag} missing Article`);
    if (parsed.some((n) => n.offers || n.aggregateRating || n.review || n.sameAs)) fail(`${tag} JSON-LD contains offers/ratings/reviews/sameAs`);
    const faq = parsed.find((n) => [].concat(n['@type']).includes('FAQPage'));
    const visibleFaqs = (html.match(/<summary/gi) || []).length;
    if (faq) {
      const q = (faq.mainEntity || []).length;
      if (visibleFaqs && q !== visibleFaqs) fail(`${tag} FAQPage has ${q} questions but page shows ${visibleFaqs}`);
    } else if (visibleFaqs) {
      fail(`${tag} visible FAQ but no FAQPage JSON-LD`);
    }
  }

  // phase 3: breadcrumbs, related projects
  if (PHASE >= 3 && route !== '/') {
    if (!/aria-label="Drobečková navigácia"/.test(html)) fail(`${tag} breadcrumb nav missing`);
    if (/^\/(sluzby\/.+|optimalizacia-a-ai\/)$/.test(route) && !/Súvisiace projekty/.test(text)) fail(`${tag} "Súvisiace projekty" missing`);
  }
}

// ---- broken internal links across the whole export ----
const allHtml = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.name === '_next') continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) allHtml.push(p);
  }
})(OUT);
const exists = (u) => {
  const p = path.join(OUT, u);
  return fs.existsSync(p) && (fs.statSync(p).isFile() || fs.existsSync(path.join(p, 'index.html')));
};
const broken = new Set();
for (const f of allHtml) {
  const html = fs.readFileSync(f, 'utf8');
  for (const m of html.matchAll(/<a\s[^>]*href="([^"#?]+)[^"]*"/gi)) {
    const h = m[1];
    if (!h.startsWith('/') || h.startsWith('//')) continue;
    if (!exists(h)) broken.add(`${path.relative(OUT, f)} → ${h}`);
  }
}
for (const b of broken) fail(`broken internal link: ${b}`);

// ---- sitemap, robots, htaccess ----
const sm = path.join(OUT, 'sitemap.xml');
if (!fs.existsSync(sm)) fail('sitemap.xml missing');
else {
  const x = fs.readFileSync(sm, 'utf8');
  for (const r of routes) if (!x.includes(`<loc>${BASE}${r}</loc>`)) fail(`sitemap.xml lacks ${r}`);
  for (const old of ['/sluzby/fractional-technical-leadership/', '/sluzby/zavadzanie-procesov-plm-pdm/', '/sluzby/riadenie-zmien-eco/'])
    if (x.includes(old)) fail(`sitemap.xml still lists legacy ${old}`);
}
const rb = path.join(OUT, 'robots.txt');
if (!fs.existsSync(rb)) fail('robots.txt missing');
else if (!/Sitemap:\s*https:\/\/www\.addvalueengineering\.sk\/sitemap\.xml/i.test(fs.readFileSync(rb, 'utf8'))) fail('robots.txt lacks Sitemap line');
const ht = path.join(OUT, '.htaccess');
if (!fs.existsSync(ht)) fail('out/.htaccess missing (must come from public/.htaccess)');
else {
  const x = fs.readFileSync(ht, 'utf8');
  for (const k of ['fractional-technical-leadership', 'zavadzanie-procesov-plm-pdm', 'riadenie-zmien-eco'])
    if (!x.includes(k)) fail(`.htaccess lacks 301 rule for ${k}`);
}

// ---- report ----
console.log(`Checked ${routes.length} routes, phase ${PHASE}.`);
for (const w of warns) console.log('WARN  ' + w);
for (const f of fails) console.log('FAIL  ' + f);
console.log(fails.length ? `\n${fails.length} failure(s).` : '\nAll checks passed.');
process.exit(fails.length ? 1 : 0);
