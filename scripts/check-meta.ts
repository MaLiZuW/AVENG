/**
 * Fails when exported HTML metadata regresses (titles, canonical, OG, Twitter).
 * Run after `npm run build`: npx tsx scripts/check-meta.ts
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { load } from "cheerio";

const OUT_DIR = "out";
const MAX_TITLE_LENGTH = 65;
const DOUBLED_BRAND = "AVENG | AVENG";

function walkIndexHtml(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...walkIndexHtml(full));
    } else if (entry === "index.html") {
      files.push(full);
    }
  }
  return files;
}

function attrValues(
  $: ReturnType<typeof load>,
  selector: string,
  attr: string,
): string[] {
  const values: string[] = [];
  $(selector).each((_, el) => {
    const value = $(el).attr(attr);
    if (value != null) values.push(value);
  });
  return values;
}

function isAbsoluteWithTrailingSlash(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      (parsed.protocol === "https:" || parsed.protocol === "http:") &&
      parsed.pathname.endsWith("/")
    );
  } catch {
    return false;
  }
}

function ogImageFile(raw: string, base: string): string {
  const parsed = new URL(raw, base);
  const rel = decodeURIComponent(parsed.pathname).replace(/^\/+/, "");
  return join(OUT_DIR, rel);
}

function fail(errors: string[]): never {
  for (const error of errors) console.error(error);
  console.error(`check:meta failed (${errors.length})`);
  process.exit(1);
}

function main(): void {
  if (!existsSync(OUT_DIR)) {
    fail(["out/ is missing. Run npm run build first."]);
  }

  const files = walkIndexHtml(OUT_DIR).sort();
  if (files.length === 0) {
    fail(["out/**/index.html matched no pages."]);
  }

  const errors: string[] = [];
  const titles = new Map<string, string[]>();
  const descriptions = new Map<string, string[]>();

  for (const file of files) {
    const rel = relative(".", file).replaceAll("\\", "/");
    const html = readFileSync(file, "utf8");
    if (html.includes(DOUBLED_BRAND)) {
      errors.push(`${rel}: contains ${DOUBLED_BRAND}`);
    }

    const $ = load(html);
    const titleNodes = $("title");
    if (titleNodes.length !== 1) {
      errors.push(
        `${rel}: expected exactly one <title>, found ${titleNodes.length}`,
      );
      continue;
    }

    const title = titleNodes.first().text().trim();
    if (title.length > MAX_TITLE_LENGTH) {
      errors.push(
        `${rel}: title is ${title.length} chars (max ${MAX_TITLE_LENGTH})`,
      );
    }

    const descriptionsOnPage = attrValues(
      $,
      'meta[name="description"]',
      "content",
    );
    const description = descriptionsOnPage[0]?.trim() ?? "";
    if (descriptionsOnPage.length !== 1 || description.length === 0) {
      errors.push(
        `${rel}: expected exactly one meta description, found ${descriptionsOnPage.length}`,
      );
    }

    const canonicals = attrValues($, 'link[rel="canonical"]', "href");
    const canonical = canonicals[0] ?? "";
    if (canonicals.length !== 1 || !isAbsoluteWithTrailingSlash(canonical)) {
      errors.push(
        `${rel}: canonical must be one absolute URL with a trailing slash, found ${canonicals.join(", ") || "(none)"}`,
      );
    }

    const ogTitle = attrValues($, 'meta[property="og:title"]', "content");
    const ogDescription = attrValues(
      $,
      'meta[property="og:description"]',
      "content",
    );
    const ogUrl = attrValues($, 'meta[property="og:url"]', "content");
    const ogImage = attrValues($, 'meta[property="og:image"]', "content");

    if (ogTitle.length !== 1 || ogTitle[0] !== title) {
      errors.push(
        `${rel}: og:title must equal <title> (${JSON.stringify(ogTitle)} vs ${JSON.stringify(title)})`,
      );
    }
    if (ogDescription.length !== 1 || ogDescription[0] !== description) {
      errors.push(`${rel}: og:description must equal meta description`);
    }
    if (ogUrl.length !== 1 || ogUrl[0] !== canonical) {
      errors.push(
        `${rel}: og:url must equal canonical (${JSON.stringify(ogUrl[0] ?? "")} vs ${JSON.stringify(canonical)})`,
      );
    }
    if (ogImage.length !== 1) {
      errors.push(`${rel}: expected exactly one og:image, found ${ogImage.length}`);
    } else if (!existsSync(ogImageFile(ogImage[0], canonical || "https://www.addvalueengineering.sk/"))) {
      errors.push(`${rel}: og:image file missing in out/ (${ogImage[0]})`);
    }

    const twitterTitle = attrValues($, 'meta[name="twitter:title"]', "content");
    const twitterDescription = attrValues(
      $,
      'meta[name="twitter:description"]',
      "content",
    );
    const twitterImage = attrValues($, 'meta[name="twitter:image"]', "content");

    if (twitterTitle.length !== 1 || twitterTitle[0] !== (ogTitle[0] ?? "")) {
      errors.push(`${rel}: twitter:title must equal og:title`);
    }
    if (
      twitterDescription.length !== 1 ||
      twitterDescription[0] !== (ogDescription[0] ?? "")
    ) {
      errors.push(`${rel}: twitter:description must equal og:description`);
    }
    if (twitterImage.length !== 1 || twitterImage[0] !== (ogImage[0] ?? "")) {
      errors.push(`${rel}: twitter:image must equal og:image`);
    }

    const titlePages = titles.get(title) ?? [];
    titlePages.push(rel);
    titles.set(title, titlePages);

    if (description.length > 0) {
      const descriptionPages = descriptions.get(description) ?? [];
      descriptionPages.push(rel);
      descriptions.set(description, descriptionPages);
    }
  }

  for (const [title, pages] of Array.from(titles.entries())) {
    if (pages.length > 1) {
      errors.push(
        `duplicate title ${JSON.stringify(title)} on ${pages.join(", ")}`,
      );
    }
  }
  for (const [description, pages] of Array.from(descriptions.entries())) {
    if (pages.length > 1) {
      errors.push(
        `duplicate description ${JSON.stringify(description)} on ${pages.join(", ")}`,
      );
    }
  }

  if (errors.length > 0) fail(errors);
  console.log(`check:meta ok (${files.length} pages)`);
}

main();
