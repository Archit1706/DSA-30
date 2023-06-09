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
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            />
            <meta property="og:title" content="DSA-30" />
            <meta
                property="og:description"
                content="Master DSA in 30 days with DSA-30"
            />
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
    },
    faviconGlyph: "30",
    feedback: {
        useLink: () => "mailto:architrathod77@gmail.com",
        content: () => (
            <p>
                <b>DSA-30</b> is yet to be an open-source project. If you find a
                bug or want to suggest a feature, please mail me.
            </p>
        ),
    },
};
