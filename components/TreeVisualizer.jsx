import React, { useMemo, useState } from "react";

/* ── Helpers to layout a binary tree from its level-order array ──
   tree = [1, 2, 3, null, 4, null, 5]  →  same shape as LeetCode notation.
*/
function depthOfTree(tree) {
    let n = tree.length;
    if (n === 0) return 0;
    return Math.floor(Math.log2(n)) + 1;
}

function layoutNodes(tree, width, levelHeight) {
    const positions = [];
    for (let i = 0; i < tree.length; i++) {
        if (tree[i] === null || tree[i] === undefined) {
            positions.push(null);
            continue;
        }
        const level = Math.floor(Math.log2(i + 1));
        const indexInLevel = i - (2 ** level - 1);
        const nodesInLevel = 2 ** level;
        const x = ((indexInLevel + 0.5) / nodesInLevel) * width;
        const y = level * levelHeight + 30;
        positions.push({ x, y });
    }
    return positions;
}

/* ── Traversal generators on the array representation ──────── */
function preorder(tree, i = 0, out = []) {
    if (i >= tree.length || tree[i] === null || tree[i] === undefined) return out;
    out.push(i);
    preorder(tree, 2 * i + 1, out);
    preorder(tree, 2 * i + 2, out);
    return out;
}
function inorder(tree, i = 0, out = []) {
    if (i >= tree.length || tree[i] === null || tree[i] === undefined) return out;
    inorder(tree, 2 * i + 1, out);
    out.push(i);
    inorder(tree, 2 * i + 2, out);
    return out;
}
function postorder(tree, i = 0, out = []) {
    if (i >= tree.length || tree[i] === null || tree[i] === undefined) return out;
    postorder(tree, 2 * i + 1, out);
    postorder(tree, 2 * i + 2, out);
    out.push(i);
    return out;
}
function levelorder(tree) {
    const out = [];
    for (let i = 0; i < tree.length; i++) {
        if (tree[i] !== null && tree[i] !== undefined) out.push(i);
    }
    return out;
}

/* ── Static tree renderer ──────────────────────────────────── */
function TreeVisualizer({ tree = [1, 2, 3, 4, 5, null, 6], highlightIndices = [], visitedIndices = [], title, width: w = 360, levelHeight = 64 }) {
    const depth = depthOfTree(tree);
    const width = Math.max(w, 280);
    const height = depth * levelHeight + 30;
    const positions = useMemo(() => layoutNodes(tree, width, levelHeight), [tree.join(","), width, levelHeight]);
    const hiSet = new Set(highlightIndices);
    const visitedSet = new Set(visitedIndices);

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
            <svg width={width} height={height} style={{ display: "block", margin: "0 auto" }}>
                {tree.map((val, i) => {
                    if (positions[i] === null) return null;
                    const lIdx = 2 * i + 1, rIdx = 2 * i + 2;
                    return (
                        <g key={`e-${i}`}>
                            {positions[lIdx] && (
                                <line x1={positions[i].x} y1={positions[i].y} x2={positions[lIdx].x} y2={positions[lIdx].y} stroke="#9ca3af" strokeWidth={1.5} />
                            )}
                            {positions[rIdx] && (
                                <line x1={positions[i].x} y1={positions[i].y} x2={positions[rIdx].x} y2={positions[rIdx].y} stroke="#9ca3af" strokeWidth={1.5} />
                            )}
                        </g>
                    );
                })}
                {tree.map((val, i) => {
                    if (positions[i] === null) return null;
                    const isHi = hiSet.has(i);
                    const isVisited = visitedSet.has(i);
                    const stroke = isHi ? "#4f46e5" : isVisited ? "#059669" : "#374151";
                    const fill = isHi ? "#eef2ff" : isVisited ? "#dcfce7" : "white";
                    const text = isHi ? "#3730a3" : isVisited ? "#166534" : "#1f2937";
                    return (
                        <g key={`n-${i}`}>
                            <circle cx={positions[i].x} cy={positions[i].y} r={20} fill={fill} stroke={stroke} strokeWidth={isHi ? 3 : 2} />
                            <text x={positions[i].x} y={positions[i].y + 4} textAnchor="middle" fontSize={12} fontFamily="monospace" fontWeight={700} fill={text}>
                                {val}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

/* ── Step through any of the four traversals ───────────────── */
function TraversalStepper({ tree = [1, 2, 3, 4, 5, null, 6], title }) {
    const [kind, setKind] = useState("inorder");
    const [step, setStep] = useState(0);

    const sequence = useMemo(() => {
        if (kind === "preorder") return preorder(tree);
        if (kind === "postorder") return postorder(tree);
        if (kind === "level") return levelorder(tree);
        return inorder(tree);
    }, [tree.join(","), kind]);

    const visitedSoFar = sequence.slice(0, step);
    const currentIdx = sequence[step - 1] ?? null;

    const btn = (active) => ({
        padding: "5px 12px",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
        fontWeight: 500,
        fontSize: 12,
        background: active ? "#4f46e5" : "#e5e7eb",
        color: active ? "white" : "#374151",
    });

    const navBtn = { padding: "6px 12px", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500, fontSize: 13, color: "white" };

    return (
        <div style={{
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            padding: 16,
            margin: "16px 0",
            background: "#fafafa",
        }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#374151" }}>{title || "Traversal stepper"}</div>
                <div style={{ display: "flex", gap: 4 }}>
                    {["inorder", "preorder", "postorder", "level"].map((k) => (
                        <button key={k} style={btn(kind === k)} onClick={() => { setKind(k); setStep(0); }}>
                            {k}
                        </button>
                    ))}
                </div>
            </div>
            <TreeVisualizer
                tree={tree}
                highlightIndices={currentIdx !== null ? [currentIdx] : []}
                visitedIndices={visitedSoFar.slice(0, -1)}
            />
            <div style={{ display: "flex", gap: 8, justifyContent: "center", alignItems: "center", marginTop: 4 }}>
                <button style={{ ...navBtn, background: "#6b7280" }} onClick={() => setStep(0)}>Reset</button>
                <button style={{ ...navBtn, background: "#4f46e5", opacity: step === 0 ? 0.5 : 1 }} onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>← Prev</button>
                <button style={{ ...navBtn, background: "#4f46e5", opacity: step >= sequence.length ? 0.5 : 1 }} onClick={() => setStep(Math.min(sequence.length, step + 1))} disabled={step >= sequence.length}>Next →</button>
                <span style={{ fontFamily: "monospace", fontSize: 12, color: "#6b7280", marginLeft: 8 }}>
                    {step}/{sequence.length}
                    {currentIdx !== null && <> · visiting <strong style={{ color: "#3730a3" }}>{tree[currentIdx]}</strong></>}
                </span>
            </div>
            {step > 0 && (
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
                    sequence: {visitedSoFar.map((i) => tree[i]).join(", ")}
                </div>
            )}
        </div>
    );
}

export { TreeVisualizer, TraversalStepper };
