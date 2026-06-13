import { TbBinaryTree } from "react-icons/tb";
import { AiFillMail } from "react-icons/ai";
import { useRouter } from "next/router";
import { useConfig } from "nextra-theme-docs";
const styles = {
    height: 10,
    width: 10,
};

const SITE_URL = "https://dsa30.vercel.app";
const SITE_NAME = "DSA-30";
const DEFAULT_TITLE = "DSA-30 — Master DSA in 30 Days";
const DEFAULT_DESCRIPTION =
    "Master Data Structures and Algorithms (DSA) in 30 days with DSA-30. Learn key concepts, algorithms, and data structures through a structured, interactive study plan.";
const DEFAULT_KEYWORDS =
    "DSA, Data Structures, Algorithms, 30 days, DSA-30, Study Plan, Big O Notation, Arrays, Linked Lists, Stacks, Queues, Recursion, Binary Trees, Heaps, Hash Tables, Graphs, Sorting, Searching, Dynamic Programming, Greedy Algorithms, Backtracking, System Design, Object-oriented Programming, Tries, Skip Lists, String Algorithms, Bit Manipulation, Divide and Conquer, Dijkstra's Algorithm, Floyd-Warshall Algorithm";

export default {
    useNextSeoProps() {
        const { asPath } = useRouter();
        const isHome = asPath === "/" || asPath === "";
        return {
            titleTemplate: isHome ? DEFAULT_TITLE : `%s — ${SITE_NAME}`,
        };
    },
    head: function Head() {
        const { frontMatter, title: themeTitle } = useConfig();
        const { asPath } = useRouter();
        const isHome = asPath === "/" || asPath === "";

        const fmTitle = frontMatter?.title;
        const fmDescription = frontMatter?.description;
        const fmImage = frontMatter?.image;
        const fmKeywords = frontMatter?.keywords;

        const rawTitle = fmTitle || themeTitle;
        const pageTitle = isHome
            ? DEFAULT_TITLE
            : rawTitle
            ? `${rawTitle} — ${SITE_NAME}`
            : DEFAULT_TITLE;
        const description = fmDescription || DEFAULT_DESCRIPTION;
        const keywords = fmKeywords || DEFAULT_KEYWORDS;
        const cleanPath = asPath.split("#")[0].split("?")[0];
        const canonical = `${SITE_URL}${cleanPath === "/" ? "" : cleanPath}`;
        const ogType = isHome ? "website" : "article";

        // Per-page Open Graph image: a frontmatter override, else a dynamic
        // branded card rendered by /api/og with this page's title.
        const ogTitle = isHome ? "Master DSA in 30 Days" : rawTitle || DEFAULT_TITLE;
        const image = fmImage
            ? fmImage.startsWith("http")
                ? fmImage
                : `${SITE_URL}${fmImage}`
            : `${SITE_URL}/api/og?title=${encodeURIComponent(ogTitle)}`;

        // ── JSON-LD structured data ──────────────────────────────────
        const person = { "@type": "Person", name: "Archit Rathod", url: "https://archit-rathod.vercel.app/" };
        const jsonLd = [
            {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: SITE_NAME,
                alternateName: DEFAULT_TITLE,
                url: SITE_URL,
                description: DEFAULT_DESCRIPTION,
                inLanguage: "en",
                author: person,
                publisher: person,
            },
        ];
        if (isHome) {
            jsonLd.push({
                "@context": "https://schema.org",
                "@type": "Course",
                name: DEFAULT_TITLE,
                description: DEFAULT_DESCRIPTION,
                url: SITE_URL,
                inLanguage: "en",
                provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
                about: "Data Structures and Algorithms",
                isAccessibleForFree: true,
                educationalLevel: "Beginner to Advanced",
            });
        } else {
            jsonLd.push({
                "@context": "https://schema.org",
                "@type": "TechArticle",
                headline: rawTitle || DEFAULT_TITLE,
                description,
                url: canonical,
                inLanguage: "en",
                author: person,
                publisher: person,
                image,
                isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
            });
            // breadcrumbs from the path
            const segs = cleanPath.split("/").filter(Boolean);
            const crumbs = [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }];
            let acc = "";
            segs.forEach((s, i) => {
                acc += `/${s}`;
                const name = s
                    .replace(/[-_]/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase());
                crumbs.push({ "@type": "ListItem", position: i + 2, name, item: `${SITE_URL}${acc}` });
            });
            jsonLd.push({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: crumbs });
        }

        return (
            <>
                <title>{pageTitle}</title>
                <link rel="manifest" href="/manifest.json" />
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
                <link rel="alternate icon" href="/icon-192x192.png" type="image/png" />
                <link rel="apple-touch-icon" href="/icon-192x192.png" />
                <link rel="canonical" href={canonical} />
                <meta charSet="UTF-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
                <meta name="description" content={description} />
                <meta name="keywords" content={keywords} />
                <meta name="author" content="Archit Rathod" />
                <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
                <meta name="googlebot" content="index, follow" />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={image} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:alt" content={`${rawTitle || DEFAULT_TITLE} — DSA-30`} />
                <meta property="og:url" content={canonical} />
                <meta property="og:type" content={ogType} />
                <meta property="og:site_name" content={SITE_NAME} />
                <meta property="og:locale" content="en_US" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={image} />
                <meta name="twitter:image:alt" content={`${rawTitle || DEFAULT_TITLE} — DSA-30`} />
                <meta name="twitter:site" content="@ArchitRathod_17" />
                <meta name="twitter:creator" content="@ArchitRathod_17" />
                {jsonLd.map((obj, i) => (
                    <script
                        key={i}
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
                    />
                ))}
            </>
        );
    },
    logo: (
        <p
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "0.5rem",
                fontStyle: "bold",
                fontSize: "1.25rem",
                fontFamily: "monospace",
            }}
        >
            <TbBinaryTree />
            DSA-30
        </p>
    ),
    project: {
        link: "https://github.com/Archit1706",
    },
    banner: {
        key: "all-30-days-live",
        content: (
            <span>
                🎉 All 30 days are live — the full DSA-30 course, from Big-O to System Design. <a href="/" style={{ textDecoration: "underline" }}>See the roadmap →</a>
            </span>
        ),
        dismissible: true,
    },
    primaryHue: 190,
    chat: {
        link: "mailto:arath21@uic.edu",
        icon: <AiFillMail style={{ width: "24", height: "24" }} />,
    },
    footer: {
        text: (
            <span>
                DSA-30 © {new Date().getFullYear()} | Made by{" "}
                <a href="https://archit-rathod.vercel.app/" target="_blank">
                    Archit Rathod
                </a>
                .
            </span>
        ),
    },
    search: {
        placeholder: "Search",
    },
    sidebar: {
        toggleButton: true,
        defaultMenuCollapseLevel: 1,
    },
    feedback: {
        useLink: () => "https://github.com/Archit1706/DSA-30/issues/new",
        content: () => (
            <p>
                Found a bug or want to suggest a feature?{" "}
                <b>Open an issue</b> on GitHub.
            </p>
        ),
    },
};
