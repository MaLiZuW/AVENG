/**
 * Manual IndexNow submit after FTP deploy (Bing-based engines).
 * Google does not use IndexNow.
 *
 * Usage (after build + deploy of public key file):
 *   npx tsx scripts/indexnow.ts
 *
 * Env:
 *   NEXT_PUBLIC_SITE_URL — site origin (default from company)
 *   INDEXNOW_KEY — must match public/{key}.txt contents (default: file below)
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { load } from "cheerio";

const DEFAULT_KEY = "a7c3e91f4b2d48e0a1f65c8d3e7b2094";
const KEY_FILE = "public/aveng-indexnow-key.txt";

function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return "https://www.addvalueengineering.sk";
}

function readKey(): string {
  const fromEnv = process.env.INDEXNOW_KEY?.trim();
  if (fromEnv) return fromEnv;
  const path = resolve(KEY_FILE);
  if (!existsSync(path)) {
    throw new Error(`Missing ${KEY_FILE}`);
  }
  return readFileSync(path, "utf8").trim();
}

function urlsFromSitemap(origin: string): string[] {
  const sitemapPath = resolve("out/sitemap.xml");
  if (!existsSync(sitemapPath)) {
    throw new Error("out/sitemap.xml missing — run npm run build first");
  }
  const xml = readFileSync(sitemapPath, "utf8");
  const $ = load(xml, { xmlMode: true });
  const urls: string[] = [];
  $("url > loc").each((_, el) => {
    const loc = $(el).text().trim();
    if (loc) urls.push(loc);
  });
  if (urls.length === 0) {
    // Fallback if sitemap shape differs
    urls.push(`${origin}/`);
  }
  return urls;
}

async function main(): Promise<void> {
  const host = siteOrigin().replace(/^https?:\/\//, "");
  const key = readKey();
  const keyLocation = `${siteOrigin()}/aveng-indexnow-key.txt`;
  const urlList = urlsFromSitemap(siteOrigin());

  const body = {
    host,
    key,
    keyLocation,
    urlList,
  };

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });

  console.log(`IndexNow status ${res.status} (${urlList.length} URLs)`);
  const text = await res.text().catch(() => "");
  if (text) console.log(text);
  if (!res.ok && res.status !== 202) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
