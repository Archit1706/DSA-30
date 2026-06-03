import React, { useState, useMemo } from "react";

/* Simple deterministic hash for visualization — sum of char codes mod buckets */
function simpleHash(key, buckets) {
    const s = String(key);
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h % buckets;
}

/* ── Static bucket layout with chaining ─────────────────────── */
function HashTableVisualizer({ entries = [], buckets = 7, hash = simpleHash, highlightKey = null, title }) {
    const slots = useMemo(() => {
        const arr = Array.from({ length: buckets }, () => []);
        for (const [k, v] of entries) {
            const idx = hash(k, buckets);
            arr[idx].push([k, v]);
        }
        return arr;
    }, [entries, buckets]);

    const highlightIdx = highlightKey !== null ? hash(highlightKey, buckets) : -1;

    return (
        <div style={{
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            padding: 16,
            margin: "16px 0",
            background: "#fafafa",
        }}>
            {title && (
                <div style={{ fontWeight: 600, fontSize: 14, color: "#374151", marginBottom: 12 }}>
                    {title}
                </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {slots.map((bucket, i) => {
                    const isHi = i === highlightIdx;
                    return (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{
                                width: 50,
                                padding: "6px 8px",
                                border: `2px solid ${isHi ? "#6366f1" : "#d1d5db"}`,
                                borderRadius: 6,
                                background: isHi ? "#eef2ff" : "#f9fafb",
                                textAlign: "center",
                                fontFamily: "monospace",
                                fontWeight: 600,
                                fontSize: 12,
                                color: isHi ? "#3730a3" : "#6b7280",
                                flexShrink: 0,
                            }}>
                                [{i}]
                            </div>
                            <div style={{ color: "#9ca3af", fontFamily: "monospace", fontSize: 13 }}>→</div>
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                {bucket.length === 0 ? (
                                    <div style={{ color: "#d1d5db", fontFamily: "monospace", fontSize: 12, padding: "4px 8px" }}>
                                        ∅
                                    </div>
                                ) : bucket.map(([k, v], j) => (
                                    <div key={j} style={{
                                        padding: "4px 10px",
                                        border: "2px solid #4f46e5",
                                        borderRadius: 6,
                                        background: "white",
                                        fontFamily: "monospace",
                                        fontSize: 12,
                                        color: "#1f2937",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 4,
                                    }}>
                                        <span style={{ fontWeight: 600, color: "#4f46e5" }}>{String(k)}</span>
                                        <span style={{ color: "#9ca3af" }}>:</span>
                                        <span>{String(v)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div style={{ fontSize: 11, fontFamily: "monospace", color: "#6b7280", marginTop: 10, textAlign: "center" }}>
                {entries.length} entries across {buckets} buckets — load factor {(entries.length / buckets).toFixed(2)}
            </div>
        </div>
    );
}

/* ── Interactive playground ────────────────────────────────── */
function InteractiveHashTable({ initialBuckets = 7 }) {
    const [buckets, setBuckets] = useState(initialBuckets);
    const [entries, setEntries] = useState([
        ["apple", 1],
        ["banana", 2],
        ["cherry", 3],
    ]);
    const [key, setKey] = useState("");
    const [val, setVal] = useState("");
    const [message, setMessage] = useState("");
    const [hi, setHi] = useState(null);

    const hash = (k) => simpleHash(k, buckets);

    const handlePut = () => {
        if (!key) { setMessage("Enter a key"); return; }
        const idx = hash(key);
        const existing = entries.findIndex(([k]) => k === key);
        if (existing >= 0) {
            const next = [...entries];
            next[existing] = [key, val || next[existing][1]];
            setEntries(next);
            setMessage(`Updated "${key}" in bucket ${idx}`);
        } else {
            setEntries([...entries, [key, val || "1"]]);
            setMessage(`Inserted "${key}" into bucket ${idx}`);
        }
        setHi(key);
        setKey("");
        setVal("");
    };

    const handleGet = () => {
        if (!key) { setMessage("Enter a key to look up"); return; }
        const idx = hash(key);
        const found = entries.find(([k]) => k === key);
        if (found) {
            setMessage(`Found "${key}" → ${found[1]} in bucket ${idx}`);
        } else {
            setMessage(`"${key}" not found (bucket ${idx} would hold it)`);
        }
        setHi(key);
    };

    const handleDelete = () => {
        if (!key) { setMessage("Enter a key to delete"); return; }
        const idx = hash(key);
        const next = entries.filter(([k]) => k !== key);
        if (next.length === entries.length) {
            setMessage(`"${key}" not in the table`);
        } else {
            setEntries(next);
            setMessage(`Removed "${key}" from bucket ${idx}`);
        }
        setKey("");
        setHi(null);
    };

    const handleReset = () => {
        setEntries([["apple", 1], ["banana", 2], ["cherry", 3]]);
        setBuckets(initialBuckets);
        setKey("");
        setVal("");
        setMessage("");
        setHi(null);
    };

    const btn = { padding: "6px 12px", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500, fontSize: 13, color: "white" };
    const input = { padding: "6px 10px", border: "1px solid #d1d5db", borderRadius: 6, width: 100, fontSize: 13, fontFamily: "monospace" };

    return (
        <div style={{
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            padding: 20,
            margin: "16px 0",
            background: "#fafafa",
        }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#374151" }}>Try it: Hash Table with Chaining</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontFamily: "monospace", color: "#6b7280" }}>
                    buckets:
                    <button style={{ ...btn, background: "#6b7280", padding: "4px 8px" }} onClick={() => setBuckets(Math.max(3, buckets - 1))}>−</button>
                    <span style={{ minWidth: 20, textAlign: "center" }}>{buckets}</span>
                    <button style={{ ...btn, background: "#6b7280", padding: "4px 8px" }} onClick={() => setBuckets(buckets + 1)}>+</button>
                </div>
            </div>
            <HashTableVisualizer entries={entries} buckets={buckets} highlightKey={hi} />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginTop: 12 }}>
                <input style={input} placeholder="Key" value={key} onChange={(e) => setKey(e.target.value)} />
                <input style={input} placeholder="Value" value={val} onChange={(e) => setVal(e.target.value)} />
                <button style={{ ...btn, background: "#4f46e5" }} onClick={handlePut}>Put</button>
                <button style={{ ...btn, background: "#059669" }} onClick={handleGet}>Get</button>
                <button style={{ ...btn, background: "#dc2626" }} onClick={handleDelete}>Delete</button>
                <button style={{ ...btn, background: "#6b7280" }} onClick={handleReset}>Reset</button>
            </div>
            {message && (
                <div style={{
                    marginTop: 10,
                    padding: "8px 12px",
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: 6,
                    fontSize: 13,
                    fontFamily: "monospace",
                    color: "#166534",
                    textAlign: "center",
                }}>
                    {message}
                </div>
            )}
        </div>
    );
}

export { HashTableVisualizer, InteractiveHashTable };
