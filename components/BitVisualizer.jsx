import React, { useEffect, useMemo, useState } from "react";

/* ── Render an integer as a row of 0/1 boxes ──────────────────────────
   Props:
     value         — the integer to visualize (any 32-bit signed int)
     bits          — number of bits to render (default 8, max 32)
     highlightBits — array of bit indices to highlight (0 = LSB)
     label         — optional row label
*/
function BitRow({ value, bits = 8, highlightBits = [], label, accent = "indigo" }) {
    const accentColors = {
        indigo: { border: "#6366f1", bg: "#eef2ff", text: "#3730a3" },
        emerald: { border: "#10b981", bg: "#d1fae5", text: "#065f46" },
        amber: { border: "#f59e0b", bg: "#fef3c7", text: "#92400e" },
        rose: { border: "#f43f5e", bg: "#ffe4e6", text: "#9f1239" },
    };
    const a = accentColors[accent] || accentColors.indigo;

    // Convert signed → unsigned slice of `bits` bits.
    const masked = ((value >>> 0) & ((bits === 32) ? 0xffffffff >>> 0 : ((1 << bits) - 1) >>> 0));
    const arr = [];
    for (let i = bits - 1; i >= 0; i--) {
        arr.push((masked >>> i) & 1);
    }

    return (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 0", flexWrap: "wrap" }}>
            {label && (
                <span style={{
                    minWidth: 80,
                    fontFamily: "monospace",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#374151",
                    textAlign: "right",
                }}>
                    {label}
                </span>
            )}
            <div style={{ display: "flex", gap: 3 }}>
                {arr.map((bit, idx) => {
                    const bitIndex = bits - 1 - idx;
                    const isHigh = highlightBits.includes(bitIndex);
                    const isSet = bit === 1;
                    const border = isHigh ? a.border : (isSet ? "#6366f1" : "#d1d5db");
                    const bg = isHigh ? a.bg : (isSet ? "#eef2ff" : "#f9fafb");
                    const txt = isHigh ? a.text : (isSet ? "#3730a3" : "#9ca3af");
                    return (
                        <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <div style={{
                                width: 26,
                                height: 32,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: `2px solid ${border}`,
                                borderRadius: 4,
                                background: bg,
                                fontFamily: "monospace",
                                fontWeight: 700,
                                fontSize: 14,
                                color: txt,
                                transition: "all 0.2s ease",
                            }}>
                                {bit}
                            </div>
                            <span style={{ fontSize: 9, fontFamily: "monospace", color: "#9ca3af", marginTop: 2 }}>
                                {bitIndex}
                            </span>
                        </div>
                    );
                })}
            </div>
            <span style={{
                marginLeft: 6,
                fontFamily: "monospace",
                fontSize: 12,
                color: "#6b7280",
                whiteSpace: "nowrap",
            }}>
                = {value}
            </span>
        </div>
    );
}

/* ── Static container for one or more BitRows ─────────────────────── */
function BitVisualizer({ children, title }) {
    return (
        <div style={{
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            padding: 16,
            margin: "16px 0",
            background: "#fafafa",
            overflowX: "auto",
        }}>
            {title && (
                <div style={{ fontWeight: 600, fontSize: 14, color: "#374151", marginBottom: 10 }}>
                    {title}
                </div>
            )}
            {children}
        </div>
    );
}

/* ── Show a bitwise expression aligned column-wise ────────────────────
   ops is an array like:
     [{ value: 12, label: "a" },
      { value: 10, label: "b" },
      { value: 12 & 10, label: "a & b", isResult: true }]
*/
function BitOperation({ title, ops = [], bits = 8, opSymbol = "&" }) {
    return (
        <BitVisualizer title={title}>
            {ops.map((row, i) => (
                <div key={i}>
                    {row.isResult && (
                        <div style={{
                            borderTop: "2px solid #6366f1",
                            margin: "4px 0",
                            paddingTop: 6,
                            fontSize: 11,
                            fontFamily: "monospace",
                            color: "#6b7280",
                            textAlign: "left",
                            paddingLeft: 90,
                        }}>
                            {opSymbol}
                        </div>
                    )}
                    <BitRow
                        value={row.value}
                        bits={bits}
                        label={row.label}
                        accent={row.isResult ? "emerald" : "indigo"}
                    />
                </div>
            ))}
        </BitVisualizer>
    );
}

/* ── Interactive playground: pick two numbers, see all bitwise ops ── */
function InteractiveBits({ bits = 8, defaultA = 12, defaultB = 10 }) {
    const [a, setA] = useState(defaultA);
    const [b, setB] = useState(defaultB);
    const [op, setOp] = useState("&");

    const mask = bits === 32 ? 0xffffffff >>> 0 : ((1 << bits) - 1) >>> 0;
    const result = useMemo(() => {
        switch (op) {
            case "&": return (a & b) & mask;
            case "|": return (a | b) & mask;
            case "^": return (a ^ b) & mask;
            case "<<": return (a << (b & 7)) & mask;
            case ">>": return (a >>> (b & 7)) & mask;
            case "~a": return (~a) & mask;
            default: return 0;
        }
    }, [a, b, op, mask]);

    const opLabel = op === "~a" ? "~a" : `a ${op} ${op === "<<" || op === ">>" ? (b & 7) : "b"}`;

    const btn = (active) => ({
        padding: "6px 12px",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
        fontFamily: "monospace",
        fontSize: 13,
        fontWeight: 600,
        background: active ? "#4f46e5" : "#e5e7eb",
        color: active ? "white" : "#374151",
    });

    const input = {
        padding: "6px 10px",
        border: "1px solid #d1d5db",
        borderRadius: 6,
        width: 90,
        fontSize: 13,
        fontFamily: "monospace",
    };

    return (
        <div style={{
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            padding: 20,
            margin: "16px 0",
            background: "#fafafa",
        }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#374151", marginBottom: 12 }}>
                Try it: Interactive Bitwise Operations
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 12 }}>
                <label style={{ fontFamily: "monospace", fontSize: 13, color: "#374151" }}>
                    a = <input type="number" style={input} value={a}
                        onChange={(e) => setA(parseInt(e.target.value) || 0)}
                        min={0} max={mask} />
                </label>
                <label style={{ fontFamily: "monospace", fontSize: 13, color: "#374151" }}>
                    b = <input type="number" style={input} value={b}
                        onChange={(e) => setB(parseInt(e.target.value) || 0)}
                        min={0} max={mask} />
                </label>
            </div>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                <button style={btn(op === "&")} onClick={() => setOp("&")}>a &amp; b</button>
                <button style={btn(op === "|")} onClick={() => setOp("|")}>a | b</button>
                <button style={btn(op === "^")} onClick={() => setOp("^")}>a ^ b</button>
                <button style={btn(op === "~a")} onClick={() => setOp("~a")}>~a</button>
                <button style={btn(op === "<<")} onClick={() => setOp("<<")}>a &lt;&lt; (b&amp;7)</button>
                <button style={btn(op === ">>")} onClick={() => setOp(">>")}>a &gt;&gt; (b&amp;7)</button>
            </div>

            <BitRow value={a} bits={bits} label="a" />
            {op !== "~a" && <BitRow value={b} bits={bits} label="b" />}
            <div style={{
                borderTop: "2px solid #6366f1",
                margin: "8px 0 6px 90px",
                paddingTop: 4,
                fontSize: 11,
                fontFamily: "monospace",
                color: "#6b7280",
            }}>
                {opLabel}
            </div>
            <BitRow value={result} bits={bits} label="result" accent="emerald" />
        </div>
    );
}

/* ── Stepper: shows the running state of a bit-manipulation algorithm ─
   steps = [{ value, highlight, description }]
*/
function BitAlgorithmStepper({ title, bits = 8, steps = [] }) {
    const [step, setStep] = useState(0);
    const reset = () => setStep(0);
    const next = () => { if (step < steps.length - 1) setStep(step + 1); };
    const prev = () => { if (step > 0) setStep(step - 1); };

    const current = steps[step] || { value: 0, highlight: [], description: "" };

    const btn = { padding: "6px 14px", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500, fontSize: 13, color: "white" };

    return (
        <div style={{
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            padding: 16,
            margin: "16px 0",
            background: "#fafafa",
        }}>
            {title && (
                <div style={{ fontWeight: 600, fontSize: 14, color: "#374151", marginBottom: 8 }}>
                    {title}
                </div>
            )}
            <div style={{ fontSize: 12, fontFamily: "monospace", color: "#6b7280", marginBottom: 10 }}>
                Step {step + 1} / {steps.length} — <strong style={{ color: "#4338ca" }}>{current.description}</strong>
            </div>
            <BitRow value={current.value} bits={bits} highlightBits={current.highlight || []} label={current.label || "value"} accent="amber" />
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 12 }}>
                <button style={{ ...btn, background: "#6b7280" }} onClick={reset}>Reset</button>
                <button style={{ ...btn, background: "#4f46e5", opacity: step === 0 ? 0.5 : 1 }} onClick={prev} disabled={step === 0}>← Prev</button>
                <button style={{ ...btn, background: "#4f46e5", opacity: step >= steps.length - 1 ? 0.5 : 1 }} onClick={next} disabled={step >= steps.length - 1}>Next →</button>
            </div>
        </div>
    );
}

export { BitVisualizer, BitRow, BitOperation, InteractiveBits, BitAlgorithmStepper };
