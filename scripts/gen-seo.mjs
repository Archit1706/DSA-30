/* Build-time SEO generator — writes public/sitemap.xml and public/robots.txt
   by scanning the pages/ tree. Runs automatically via the "prebuild" npm
   script (npm runs prebuild before build), so the sitemap stays in sync with
   the content. No external dependencies. */

import { readdirSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PAGES = join(ROOT, "pages");
const PUBLIC = join(ROOT, "public");
const SITE_URL = "https://dsa30.vercel.app";

const PAGE_EXT = new Set([".mdx", ".md", ".jsx", ".tsx", ".js", ".ts"]);
const SKIP_FILE = /^(_app|_document|_meta|404|500|sitemap|robots)\b/;
const SKIP_DIR = new Set(["api", "_meta"]);

/** Recursively collect page routes from pages/. */
function collectRoutes(dir, base = "") {
    const routes = [];
    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        const st = statSync(full);
        if (st.isDirectory()) {
            if (SKIP_DIR.has(entry) || entry.startsWith(".")) continue;
            routes.push(...collectRoutes(full, `${base}/${entry}`));
            continue;
        }
        const dot = entry.lastIndexOf(".");
        const name = dot === -1 ? entry : entry.slice(0, dot);
        const ext = dot === -1 ? "" : entry.slice(dot);
        if (!PAGE_EXT.has(ext)) continue;
        if (SKIP_FILE.test(name)) continue;
        if (name.startsWith("[")) continue;       // dynamic routes — skip
        const route = name === "index" ? base || "/" : `${base}/${name}`;
        routes.push({ route, mtime: st.mtime });
    }
    return routes;
}

/** Priority + changefreq heuristics by route depth/section. */
function meta(route) {
    if (route === "/") return { priority: "1.0", changefreq: "weekly" };
    const depth = route.split("/").filter(Boolean).length;
    if (route.includes("/practice_questions/") && !route.endsWith("/practice_questions"))
        return { priority: "0.5", changefreq: "monthly" };
    if (depth === 1) return { priority: "0.8", changefreq: "monthly" };  // /dayN, /getting_started
    return { priority: "0.6", changefreq: "monthly" };                    // concept sub-pages
}

const routes = collectRoutes(PAGES)
    .filter((r, i, a) => a.findIndex((x) => x.route === r.route) === i)
    .sort((a, b) => a.route.localeCompare(b.route));

const today = new Date().toISOString().split("T")[0];

const urls = routes
    .map(({ route, mtime }) => {
        const { priority, changefreq } = meta(route);
        const loc = `${SITE_URL}${route === "/" ? "" : route}`;
        const lastmod = (mtime instanceof Date ? mtime : new Date()).toISOString().split("T")[0] || today;
        return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

const robots = `# robots.txt for ${SITE_URL}
User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml
`;

mkdirSync(PUBLIC, { recursive: true });
writeFileSync(join(PUBLIC, "sitemap.xml"), sitemap, "utf8");
writeFileSync(join(PUBLIC, "robots.txt"), robots, "utf8");

console.log(`[gen-seo] wrote sitemap.xml (${routes.length} urls) and robots.txt`);
