import React, { useState, useEffect, useMemo } from "react";

/* ── Pure heap math ──────────────────────────────────────────── */
const parent = (i) => Math.floor((i - 1) / 2);
const left = (i) => 2 * i + 1;
const right = (i) => 2 * i + 2;

function siftUp(arr, i, cmp) {
    while (i > 0 && cmp(arr[i], arr[parent(i)])) {
        [arr[i], arr[parent(i)]] = [arr[parent(i)], arr[i]];
        i = parent(i);
    }
}

function siftDown(arr, i, n, cmp) {
    while (true) {
        const l = left(i), r = right(i);
        let best = i;
        if (l < n && cmp(arr[l], arr[best])) best = l;
        if (r < n && cmp(arr[r], arr[best])) best = r;
        if (best === i) return;
        [arr[i], arr[best]] = [arr[best], arr[i]];
        i = best;
    }
}

function pushHeap(arr, val, cmp) {
    arr.push(val);
    siftUp(arr, arr.length - 1, cmp);
}

function popHeap(arr, cmp) {
    if (arr.length === 0) return null;
    const top = arr[0];
    const last = arr.pop();
    if (arr.length > 0) {
        arr[0] = last;
        siftDown(arr, 0, arr.length, cmp);
    }
    return top;
}

const minCmp = (a, b) => a < b;
const maxCmp = (a, b) => a > b;

/* ── Side-by-side array + tree view ─────────────────────────── */
function HeapVisualizer({ initialHeap = [10, 20, 15, 30, 40], kind = "min", highlightIndex = -1, title }) {
    const cmp = kind === "min" ? minCmp : maxCmp;
    const [heap, setHeap] = useState(initialHeap);

    useEffect(() => {
        setHeap(initialHeap);
    }, [initialHeap.join(","), kind]);

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
            <div style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "center" }}>
                <HeapTree heap={heap} kind={kind} highlightIndex={highlightIndex} />
                <HeapArray heap={heap} highlightIndex={highlightIndex} />
            </div>
            <div style={{ fontSize: 11, fontFamily: "monospace", color: "#6b7280", marginTop: 8, textAlign: "center" }}>
                {kind === "min" ? "MIN-HEAP" : "MAX-HEAP"} — root is at index 0; children of i are at {`2i+1`} and {`2i+2`}
            </div>
        </div>
    );
}

/* ── SVG tree view ─────────────────────────────────────────── */
function HeapTree({ heap, kind, highlightIndex }) {
    if (heap.length === 0) {
        return (
            <div style={{ minWidth: 280, minHeight: 160, display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontFamily: "monospace", fontSize: 13 }}>
                (empty heap)
            </div>
        );
    }
    const depth = Math.floor(Math.log2(heap.length)) + 1;
    const levelHeight = 60;
    const nodeRadius = 20;
    const width = Math.max(2 ** depth * 40, 280);
    const height = depth * levelHeight + 20;

    const positions = heap.map((_, i) => {
        const level = Math.floor(Math.log2(i + 1));
        const indexInLevel = i - (2 ** level - 1);
        const nodesInLevel = 2 ** level;
        const x = ((indexInLevel + 0.5) / nodesInLevel) * width;
        const y = level * levelHeight + nodeRadius + 6;
        return { x, y };
    });

    return (
        <svg width={width} height={height}>
            {heap.map((_, i) => {
                const l = left(i), r = right(i);
                return (
                    <g key={`edges-${i}`}>
                        {l < heap.length && (
                            <line x1={positions[i].x} y1={positions[i].y} x2={positions[l].x} y2={positions[l].y} stroke="#9ca3af" strokeWidth={1.5} />
                        )}
                        {r < heap.length && (
                            <line x1={positions[i].x} y1={positions[i].y} x2={positions[r].x} y2={positions[r].y} stroke="#9ca3af" strokeWidth={1.5} />
                        )}
                    </g>
                );
            })}
            {heap.map((val, i) => {
                const isHi = i === highlightIndex;
                const isRoot = i === 0;
                const fill = isHi ? "#eef2ff" : isRoot ? (kind === "min" ? "#dcfce7" : "#fee2e2") : "white";
                const stroke = isHi ? "#6366f1" : isRoot ? (kind === "min" ? "#059669" : "#dc2626") : "#4f46e5";
                const textColor = isHi ? "#3730a3" : isRoot ? (kind === "min" ? "#166534" : "#991b1b") : "#1f2937";
                return (
                    <g key={`node-${i}`}>
                        <circle cx={positions[i].x} cy={positions[i].y} r={nodeRadius} fill={fill} stroke={stroke} strokeWidth={2} />
                        <text x={positions[i].x} y={positions[i].y + 4} textAnchor="middle" fontSize={12} fontFamily="monospace" fontWeight={700} fill={textColor}>{val}</text>
                        <text x={positions[i].x} y={positions[i].y + nodeRadius + 12} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="#9ca3af">[{i}]</text>
                    </g>
                );
            })}
        </svg>
    );
}

/* ── Array slot view ──────────────────────────────────────── */
function HeapArray({ heap, highlightIndex }) {
    return (
        <div>
            <div style={{ fontSize: 11, fontFamily: "monospace", color: "#6b7280", marginBottom: 4 }}>array view</div>
            <div style={{ display: "flex", gap: 2, alignItems: "flex-end", flexWrap: "wrap" }}>
                {heap.length === 0 ? (
                    <div style={{ color: "#9ca3af", fontSize: 12, fontFamily: "monospace" }}>(empty)</div>
                ) : heap.map((val, i) => {
                    const isHi = i === highlightIndex;
                    const isRoot = i === 0;
                    return (
                        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                            <div style={{
                                width: 44,
                                height: 44,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: `2px solid ${isHi ? "#6366f1" : isRoot ? "#059669" : "#d1d5db"}`,
                                borderRadius: 6,
                                background: isHi ? "#eef2ff" : isRoot ? "#dcfce7" : "white",
                                fontFamily: "monospace",
                                fontWeight: 600,
                                fontSize: 14,
                                color: isHi ? "#3730a3" : "#374151",
                            }}>
                                {val}
                            </div>
                            <span style={{ fontSize: 10, color: "#9ca3af", fontFamily: "monospace" }}>[{i}]</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ── Interactive playground ──────────────────────────────── */
function InteractiveHeap({ initialHeap = [], kind: initKind = "min" }) {
    const [kind, setKind] = useState(initKind);
    const [heap, setHeap] = useState(initialHeap);
    const [inputVal, setInputVal] = useState("");
    const [message, setMessage] = useState("");
    const [hi, setHi] = useState(-1);

    const cmp = kind === "min" ? minCmp : maxCmp;

    const flash = (idx, ms = 800) => {
        setHi(idx);
        setTimeout(() => setHi(-1), ms);
    };

    const handlePush = () => {
        const v = parseInt(inputVal);
        if (isNaN(v)) { setMessage("Enter a number to push"); return; }
        const next = [...heap];
        pushHeap(next, v, cmp);
        setHeap(next);
        setMessage(`Pushed ${v}; sifted up to index ${next.indexOf(v)}`);
        setInputVal("");
        flash(0);
    };

    const handlePop = () => {
        if (heap.length === 0) { setMessage("Heap is empty"); return; }
        const next = [...heap];
        const top = popHeap(next, cmp);
        setHeap(next);
        setMessage(`Popped ${top} (the ${kind === "min" ? "smallest" : "largest"})`);
        flash(0);
    };

    const handlePeek = () => {
        if (heap.length === 0) { setMessage("Heap is empty"); return; }
        setMessage(`Top: ${heap[0]} (the ${kind === "min" ? "smallest" : "largest"})`);
        flash(0);
    };

    const handleBuild = () => {
        const next = [...heap];
        const n = next.length;
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) siftDown(next, i, n, cmp);
        setHeap(next);
        setMessage(`Heapified in O(n)`);
    };

    const handleReset = () => {
        setHeap([10, 20, 15, 30, 40, 25]);
        setMessage("");
        setHi(-1);
    };

    const handleShuffle = () => {
        const arr = Array.from({ length: 6 }, () => Math.floor(Math.random() * 90) + 10);
        setHeap(arr);
        setMessage("Random array — not a valid heap until you press Heapify");
        setHi(-1);
    };

    const btn = { padding: "6px 12px", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500, fontSize: 13, color: "white" };
    const input = { padding: "6px 10px", border: "1px solid #d1d5db", borderRadius: 6, width: 80, fontSize: 13, fontFamily: "monospace" };

    return (
        <div style={{
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            padding: 20,
            margin: "16px 0",
            background: "#fafafa",
        }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#374151" }}>Try it: Interactive Heap</div>
                <div style={{ display: "flex", gap: 8 }}>
                    <button
                        style={{ ...btn, background: kind === "min" ? "#059669" : "#9ca3af" }}
                        onClick={() => setKind("min")}
                    >
                        Min-heap
                    </button>
                    <button
                        style={{ ...btn, background: kind === "max" ? "#dc2626" : "#9ca3af" }}
                        onClick={() => setKind("max")}
                    >
                        Max-heap
                    </button>
                </div>
            </div>
            <HeapVisualizer initialHeap={heap} kind={kind} highlightIndex={hi} />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginTop: 12 }}>
                <input
                    style={input}
                    placeholder="Value"
                    type="number"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handlePush(); }}
                />
                <button style={{ ...btn, background: "#4f46e5" }} onClick={handlePush}>Push</button>
                <button style={{ ...btn, background: "#dc2626" }} onClick={handlePop}>Pop</button>
                <button style={{ ...btn, background: "#059669" }} onClick={handlePeek}>Peek</button>
                <button style={{ ...btn, background: "#0891b2" }} onClick={handleBuild}>Heapify</button>
                <button style={{ ...btn, background: "#7c3aed" }} onClick={handleShuffle}>Shuffle</button>
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

export { HeapVisualizer, InteractiveHeap };
