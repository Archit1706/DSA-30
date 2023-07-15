import { TbBinaryTree } from "react-icons/tb";
import { AiFillMail } from "react-icons/ai";
const styles = {
    height: 10,
    width: 10,
};
export default {
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
    footer: {
        text: "DSA-30 © 2023",
    },
    project: {
        link: "https://github.com/Archit1706",
    },
    useNextSeoProps() {
        return {
            titleTemplate: "%s | DSA-30",
        };
    },
    head: (
        <>
            {/* Manifest */}
            <link rel="manifest" href="/manifest.json" />

            <meta charSet="UTF-8" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            />
            <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
            <meta
                name="description"
                content="Master Data Structures and Algorithms (DSA) in 30 days with DSA-30. Learn key concepts, algorithms, and data structures through a structured study plan."
            />
            <meta
                name="keywords"
                content="DSA, Data Structures, Algorithms, 30 days, DSA-30, Study Plan, Big O Notation, Arrays, Linked Lists, Stacks, Queues, Recursion, Binary Trees, Heaps, Hash Tables, Graphs, Sorting, Searching, Dynamic Programming, Greedy Algorithms, Backtracking, System Design, Object-oriented Programming, Tries, Skip Lists, String Algorithms, Bit Manipulation, Divide and Conquer, Dijkstra's Algorithm, Floyd-Warshall Algorithm"
            />
            <meta name="author" content="Archit Rathod" />
            {/* Open Graph meta tags */}
            <meta property="og:title" content="DSA-30" />
            <meta
                property="og:description"
                content="Master DSA in 30 days with DSA-30"
            />
            <meta
                property="og:image"
                content="https://dsa30.vercel.app/preview-image.jpg"
            />
            <meta property="og:url" content="https://dsa30.vercel.app/" />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="DSA-30" />
            {/* Twitter Card meta tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="DSA-30" />
            <meta
                name="twitter:description"
                content="Master DSA in 30 days with DSA-30"
            />
            <meta
                name="twitter:image"
                content="https://dsa30.vercel.app/preview-image.jpg"
            />
            <meta name="twitter:site" content="@ArchitRathod_17" />
        </>
    ),
    banner: {
        key: "1.0-release",
        text: (
            <a href="" target="_blank">
                🎉 Yay! DSA-30 is now live!
            </a>
        ),
        dismissible: true,
    },
    primaryHue: 190,
    chat: {
        link: "mailto:architrathod77@gmail.com",
        icon: <AiFillMail style={{ width: "24", height: "24" }} />,
    },
    footer: {
        text: (
            <span>
                DSA-30 © 2023 | Made by{" "}
                <a href="https://www.architrathod.codes/" target="_blank">
                    Archit Rathod😍
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
        useLink: () => " https://mailto:architrathod77@gmail.com",
        content: () => (
            <p>
                <b>DSA-30</b> is yet to be an open-source project. If you find a
                bug or want to suggest a feature, please mail me.
            </p>
        ),
    },
};
