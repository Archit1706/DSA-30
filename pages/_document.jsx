import { Html, Head, Main, NextScript } from "next/document";

/* Declares the document language for SEO/accessibility and sets the PWA
   theme color. Per-page <head> tags (title, OG, JSON-LD) live in
   theme.config.jsx; this only sets document-level defaults. */

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <meta name="theme-color" content="#0f172a" />
                <meta name="application-name" content="DSA-30" />
                <meta name="apple-mobile-web-app-title" content="DSA-30" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="mobile-web-app-capable" content="yes" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
