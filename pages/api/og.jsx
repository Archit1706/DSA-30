import { ImageResponse } from "next/og";

/* Dynamic Open Graph image (1200×630), rendered at the edge.
   Used by theme.config.jsx for every page's og:image / twitter:image, so each
   shared link gets a branded card with its own title. Built into Next 15 via
   next/og — no extra dependency. */

export const config = { runtime: "edge" };

export default function handler(req) {
    const { searchParams } = new URL(req.url);
    const rawTitle = (searchParams.get("title") || "Master DSA in 30 Days").slice(0, 110);
    const eyebrow = (searchParams.get("eyebrow") || "DSA-30").slice(0, 40);

    return new ImageResponse(
        (
            <div
                style={{
                    width: "1200px",
                    height: "630px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "72px",
                    background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 55%, #3b0764 100%)",
                    fontFamily: "sans-serif",
                }}
            >
                {/* top brand row */}
                <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "64px",
                            height: "64px",
                            borderRadius: "16px",
                            background: "linear-gradient(135deg,#6366f1,#ec4899)",
                            fontSize: "34px",
                            fontWeight: 800,
                            color: "white",
                        }}
                    >
                        30
                    </div>
                    <div style={{ display: "flex", fontSize: "30px", fontWeight: 700, color: "#a5b4fc", letterSpacing: "1px" }}>
                        {eyebrow}
                    </div>
                </div>

                {/* title */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div
                        style={{
                            display: "flex",
                            fontSize: rawTitle.length > 48 ? "62px" : "80px",
                            fontWeight: 800,
                            color: "white",
                            lineHeight: 1.1,
                            letterSpacing: "-1px",
                        }}
                    >
                        {rawTitle}
                    </div>
                </div>

                {/* bottom strip */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", fontSize: "30px", color: "#cbd5e1" }}>
                        Interactive Data Structures & Algorithms
                    </div>
                    <div style={{ display: "flex", fontSize: "26px", color: "#818cf8", fontWeight: 600 }}>
                        dsa30.vercel.app
                    </div>
                </div>

                {/* accent bar */}
                <div
                    style={{
                        display: "flex",
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "1200px",
                        height: "12px",
                        background: "linear-gradient(90deg,#3b82f6,#8b5cf6,#ec4899)",
                    }}
                />
            </div>
        ),
        { width: 1200, height: 630 }
    );
}
