import React, { useState, useRef, useEffect } from "react";

/**
 * StringVisualizer - Displays a string as individual character boxes with indices.
 * Shows null terminator for C-style strings, highlights specific indices.
 */
function StringVisualizer({ value, highlights = [], label, showIndices = true, showNullTerminator = false }) {
    const chars = typeof value === "string" ? value.split("") : value;

    return (
        <div style={{ margin: "16px 0" }}>
            {label && (
                <div style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#6b7280",
                    marginBottom: "8px",
                    fontFamily: "monospace",
                }}>
                    {label}
                </div>
            )}
            <div style={{ display: "flex", gap: "2px", overflowX: "auto", paddingBottom: "4px" }}>
                {chars.map((ch, i) => {
                    const isHighlighted = highlights.includes(i);
                    return (
                        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                            <div style={{
                                width: "40px",
                                height: "44px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: isHighlighted ? "2px solid #6366f1" : "2px solid #d1d5db",
                                borderRadius: "6px",
                                background: isHighlighted ? "#eef2ff" : ch === " " ? "#fefce8" : "#f9fafb",
                                fontFamily: "monospace",
                                fontWeight: 600,
                                fontSize: "16px",
                                color: isHighlighted ? "#4338ca" : ch === " " ? "#a16207" : "#374151",
                                transition: "all 0.2s ease",
                            }}>
                                {ch === " " ? "\u2423" : ch}
                            </div>
                            {showIndices && (
                                <span style={{ fontSize: "10px", color: "#9ca3af", fontFamily: "monospace" }}>[{i}]</span>
                            )}
                        </div>
                    );
                })}
                {showNullTerminator && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                        <div style={{
                            width: "40px",
                            height: "44px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "2px dashed #f87171",
                            borderRadius: "6px",
                            background: "#fef2f2",
                            fontFamily: "monospace",
                            fontWeight: 600,
                            fontSize: "13px",
                            color: "#dc2626",
                        }}>
                            \0
                        </div>
                        {showIndices && (
                            <span style={{ fontSize: "10px", color: "#9ca3af", fontFamily: "monospace" }}>[{chars.length}]</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * InteractiveString - Lets users type a string and see real-time character box visualization.
 * Includes operations: reverse, uppercase, lowercase, check palindrome.
 */
function InteractiveString() {
    const [input, setInput] = useState("hello");
    const [result, setResult] = useState(null);
    const [highlights, setHighlights] = useState([]);
    const [animating, setAnimating] = useState(false);
    const animRef = useRef(null);

    const clearAnim = () => {
        if (animRef.current) clearTimeout(animRef.current);
        setAnimating(false);
        setHighlights([]);
        setResult(null);
    };

    const animateIndices = (indices, callback, delay = 300) => {
        setAnimating(true);
        let i = 0;
        const step = () => {
            if (i < indices.length) {
                setHighlights(Array.isArray(indices[i]) ? indices[i] : [indices[i]]);
                i++;
                animRef.current = setTimeout(step, delay);
            } else {
                setAnimating(false);
                if (callback) callback();
            }
        };
        step();
    };

    const handleReverse = () => {
        clearAnim();
        const chars = input.split("");
        const n = chars.length;
        const steps = [];
        for (let i = 0; i < Math.floor(n / 2); i++) {
            steps.push([i, n - 1 - i]);
        }
        animateIndices(steps, () => {
            setResult({ type: "success", text: `Reversed: "${input.split("").reverse().join("")}"` });
            setHighlights([]);
        }, 500);
    };

    const handlePalindrome = () => {
        clearAnim();
        const clean = input.toLowerCase().replace(/[^a-z0-9]/g, "");
        const reversed = clean.split("").reverse().join("");
        const isPalin = clean === reversed;

        const steps = [];
        for (let i = 0; i < Math.floor(clean.length / 2); i++) {
            steps.push([i, clean.length - 1 - i]);
        }
        animateIndices(steps, () => {
            setResult({
                type: isPalin ? "success" : "error",
                text: isPalin ? `"${input}" is a palindrome!` : `"${input}" is not a palindrome.`,
            });
            setHighlights([]);
        }, 400);
    };

    const handleCharCount = () => {
        clearAnim();
        const freq = {};
        for (const ch of input.toLowerCase()) {
            if (ch !== " ") freq[ch] = (freq[ch] || 0) + 1;
        }
        const entries = Object.entries(freq).sort((a, b) => b[1] - a[1]);
        const display = entries.map(([ch, count]) => `'${ch}':${count}`).join("  ");
        setResult({ type: "success", text: `Character counts: ${display}` });
    };

    useEffect(() => {
        return () => { if (animRef.current) clearTimeout(animRef.current); };
    }, []);

    const btnStyle = (disabled) => ({
        padding: "6px 14px",
        border: "none",
        borderRadius: "6px",
        background: disabled ? "#e5e7eb" : "#4f46e5",
        color: disabled ? "#9ca3af" : "white",
        cursor: disabled ? "not-allowed" : "pointer",
        fontWeight: 500,
        fontSize: "13px",
        transition: "all 0.15s ease",
    });

    return (
        <div style={{
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            padding: "20px",
            margin: "16px 0",
            background: "#fafafa",
        }}>
            <div style={{ fontWeight: 600, fontSize: "14px", color: "#374151", marginBottom: "12px" }}>
                Interactive String Explorer
            </div>

            <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => { setInput(e.target.value); clearAnim(); }}
                    placeholder="Type a string..."
                    style={{
                        flex: 1,
                        minWidth: "200px",
                        padding: "8px 12px",
                        border: "2px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "14px",
                        fontFamily: "monospace",
                        outline: "none",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#6366f1"}
                    onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
                />
            </div>

            <StringVisualizer value={input} highlights={highlights} showIndices={true} />

            <div style={{ fontSize: "12px", color: "#6b7280", margin: "8px 0 12px", fontFamily: "monospace" }}>
                Length: {input.length}
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button style={btnStyle(animating)} onClick={handleReverse} disabled={animating}>
                    Reverse
                </button>
                <button style={btnStyle(animating)} onClick={handlePalindrome} disabled={animating}>
                    Check Palindrome
                </button>
                <button style={btnStyle(animating)} onClick={handleCharCount} disabled={animating}>
                    Character Count
                </button>
            </div>

            {result && (
                <div style={{
                    marginTop: "12px",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    background: result.type === "success" ? "#f0fdf4" : "#fef2f2",
                    border: `1px solid ${result.type === "success" ? "#bbf7d0" : "#fecaca"}`,
                    fontSize: "13px",
                    fontFamily: "monospace",
                    color: result.type === "success" ? "#166534" : "#991b1b",
                }}>
                    {result.text}
                </div>
            )}
        </div>
    );
}

/**
 * StringCompare - Side-by-side string comparison with character-level highlighting.
 * Useful for showing string matching, edit distance, anagram checking.
 */
function StringCompare({ string1, string2, label1 = "String 1", label2 = "String 2", matchHighlight = true }) {
    const chars1 = string1.split("");
    const chars2 = string2.split("");
    const maxLen = Math.max(chars1.length, chars2.length);

    return (
        <div style={{
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            padding: "16px",
            margin: "16px 0",
            background: "#fafafa",
        }}>
            <div style={{ marginBottom: "12px" }}>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", marginBottom: "6px" }}>{label1}</div>
                <div style={{ display: "flex", gap: "2px", overflowX: "auto" }}>
                    {chars1.map((ch, i) => {
                        const matches = matchHighlight && i < chars2.length && chars1[i] === chars2[i];
                        return (
                            <div key={i} style={{
                                width: "36px",
                                height: "40px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: matches ? "2px solid #16a34a" : "2px solid #d1d5db",
                                borderRadius: "6px",
                                background: matches ? "#f0fdf4" : "#f9fafb",
                                fontFamily: "monospace",
                                fontWeight: 600,
                                fontSize: "15px",
                                color: matches ? "#166534" : "#374151",
                            }}>
                                {ch}
                            </div>
                        );
                    })}
                </div>
            </div>
            <div>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", marginBottom: "6px" }}>{label2}</div>
                <div style={{ display: "flex", gap: "2px", overflowX: "auto" }}>
                    {chars2.map((ch, i) => {
                        const matches = matchHighlight && i < chars1.length && chars1[i] === chars2[i];
                        return (
                            <div key={i} style={{
                                width: "36px",
                                height: "40px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: matches ? "2px solid #16a34a" : "2px solid #d1d5db",
                                borderRadius: "6px",
                                background: matches ? "#f0fdf4" : "#f9fafb",
                                fontFamily: "monospace",
                                fontWeight: 600,
                                fontSize: "15px",
                                color: matches ? "#166534" : "#374151",
                            }}>
                                {ch}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export { StringVisualizer, InteractiveString, StringCompare };
