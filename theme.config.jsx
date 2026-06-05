import { TbBinaryTree } from "react-icons/tb";
import { AiFillMail } from "react-icons/ai";
import { useRouter } from "next/router";
const styles = {
    height: 10,
    width: 10,
};
export default {
    useNextSeoProps() {
        const { asPath } = useRouter();
        const isHome = asPath === "/" || asPath === "";
        return {
            titleTemplate: isHome ? "DSA-30 — Master DSA in 30 Days" : "%s — DSA-30",
        };
    },
    head: ({ title, meta }) => {
        const url = "https://dsa30.vercel.app";
        const pageTitle = title ? `${title} — DSA-30` : "DSA-30 — Master DSA in 30 Days";
        const description =
            meta?.description ||
            "Master Data Structures and Algorithms (DSA) in 30 days with DSA-30. Learn key concepts, algorithms, and data structures through a structured, interactive study plan.";
        const image = meta?.image || `${url}/preview-image.jpg`;
        return (
            <>
                <link rel="manifest" href="/manifest.json" />
                <meta charSet="UTF-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
                <meta name="description" content={description} />
                <meta
                    name="keywords"
                    content={
                        meta?.keywords ||
                        "DSA, Data Structures, Algorithms, 30 days, DSA-30, Study Plan, Big O Notation, Arrays, Linked Lists, Stacks, Queues, Recursion, Binary Trees, Heaps, Hash Tables, Graphs, Sorting, Searching, Dynamic Programming, Greedy Algorithms, Backtracking, System Design, Object-oriented Programming, Tries, Skip Lists, String Algorithms, Bit Manipulation, Divide and Conquer, Dijkstra's Algorithm, Floyd-Warshall Algorithm"
                    }
                />
                <meta name="author" content="Archit Rathod" />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={image} />
                <meta property="og:url" content={url} />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="DSA-30" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={image} />
                <meta name="twitter:site" content="@ArchitRathod_17" />
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
        key: "phases-1-4-live",
        content: (
            <span>
                🚀 Phases 1–4 are live — Days 1–13 + Day 17 are fully written. <a href="/" style={{ textDecoration: "underline" }}>See the roadmap →</a>
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
    faviconGlyph: "30",
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
