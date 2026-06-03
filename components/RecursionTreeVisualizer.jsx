import React, { useMemo, useState } from "react";

/* ── Generic recursion-tree renderer ───────────────────────────────────
   Pass a function that, given a node value (anything), returns either
   `null` (leaf / base case) or an array of child values. The component
   lays out the resulting tree top-down and draws it.

   Each "node" in the visual tree carries:
     - `value`  — what the function was called with (shown in the box)
     - `result` — optional, what it returns (shown under the value)
     - `kind`   — "node" | "leaf"
*/

function buildTree(value, expand, computeResult, depth = 0, maxDepth = 8) {
    if (depth > maxDepth) return { value, kind: "node", children: [], result: "…" };
    const children = expand(value);
    if (children === null || children === undefined || children.length === 0) {
        return { value, kind: "leaf", children: [], result: computeResult ? computeResult(value, []) : undefined };
    }
    const built = children.map((c) => buildTree(c, expand, computeResult, depth + 1, maxDepth));
    const result = computeResult ? computeResult(value, built.map((b) => b.result)) : undefined;
    return { value, kind: "node", children: built, result };
}

/* Compute layout: assign each node an x position based on its leaves. */
function layout(tree, x = 0) {
    if (tree.children.length === 0) {
        tree.x = x;
        return { width: 1, next: x + 1 };
    }
    let cursor = x;
    let widths = 0;
    for (const child of tree.children) {
        const { width, next } = layout(child, cursor);
        widths += width;
        cursor = next;
    }
    const firstX = tree.children[0].x;
    const lastX = tree.children[tree.children.length - 1].x;
    tree.x = (firstX + lastX) / 2;
    return { width: widths, next: cursor };
}

function collectNodes(tree, depth, acc) {
    acc.push({ ...tree, depth });
    for (const c of tree.children) collectNodes(c, depth + 1, acc);
}

function treeDepth(tree) {
    if (tree.children.length === 0) return 1;
    return 1 + Math.max(...tree.children.map(treeDepth));
}

function RecursionTreeVisualizer({
    root,
    expand,
    computeResult,
    label = (v) => String(v),
    maxDepth = 8,
    nodeWidth = 70,
    levelHeight = 70,
    title,
}) {
    const tree = useMemo(() => {
        const t = buildTree(root, expand, computeResult, 0, maxDepth);
        layout(t);
        return t;
    }, [root]);

    const nodes = useMemo(() => {
        const acc = [];
        collectNodes(tree, 0, acc);
        return acc;
    }, [tree]);

    const depth = treeDepth(tree);
    const leafCount = nodes.filter((n) => n.children.length === 0).length || 1;
    const width = Math.max(nodeWidth * (leafCount + 1), 280);
    const height = levelHeight * (depth + 1);

    const edges = [];
    const drawEdges = (t) => {
        for (const c of t.children) {
            edges.push({ x1: t.x, y1: 0, x2: c.x, y2: 0, parent: t, child: c });
            drawEdges(c);
        }
    };
    drawEdges(tree);

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
                <div style={{ fontWeight: 600, fontSize: 14, color: "#374151", marginBottom: 8 }}>
                    {title}
                </div>
            )}
            <svg width={width} height={height} style={{ display: "block", margin: "0 auto" }}>
                {edges.map((e, i) => (
                    <line
                        key={i}
                        x1={(e.parent.x + 0.5) * nodeWidth + 12}
                        y1={e.parent.depth !== undefined ? (e.parent.depth + 0.5) * levelHeight : (depthOf(tree, e.parent) + 0.5) * levelHeight}
                        x2={(e.child.x + 0.5) * nodeWidth + 12}
                        y2={(depthOf(tree, e.child) + 0.5) * levelHeight}
                        stroke="#9ca3af"
                        strokeWidth="1.5"
                    />
                ))}
                {nodes.map((n, i) => {
                    const cx = (n.x + 0.5) * nodeWidth + 12;
                    const cy = (n.depth + 0.5) * levelHeight;
                    const isLeaf = n.kind === "leaf";
                    const border = isLeaf ? "#059669" : "#6366f1";
                    const bg = isLeaf ? "#dcfce7" : "#eef2ff";
                    const txt = isLeaf ? "#166534" : "#3730a3";
                    return (
                        <g key={i}>
                            <rect
                                x={cx - 28}
                                y={cy - 18}
                                rx={6}
                                width={56}
                                height={n.result !== undefined ? 38 : 28}
                                fill={bg}
                                stroke={border}
                                strokeWidth="2"
                            />
                            <text
                                x={cx}
                                y={cy - 2}
                                textAnchor="middle"
                                fontSize="12"
                                fontFamily="monospace"
                                fontWeight="700"
                                fill={txt}
                            >
                                {label(n.value)}
                            </text>
                            {n.result !== undefined && (
                                <text
                                    x={cx}
                                    y={cy + 13}
                                    textAnchor="middle"
                                    fontSize="10"
                                    fontFamily="monospace"
                                    fill="#6b7280"
                                >
                                    = {String(n.result)}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>
            <div style={{
                fontSize: 11,
                fontFamily: "monospace",
                color: "#6b7280",
                marginTop: 8,
                textAlign: "center",
            }}>
                <span style={{ color: "#3730a3" }}>■</span> recursive call &nbsp;&nbsp;
                <span style={{ color: "#166534" }}>■</span> base case
                {" — "}
                <strong>{nodes.length}</strong> total calls
            </div>
        </div>
    );
}

/* helper: find depth of a node by walking */
function depthOf(root, target, d = 0) {
    if (root === target) return d;
    for (const c of root.children) {
        const r = depthOf(c, target, d + 1);
        if (r !== -1) return r;
    }
    return -1;
}

/* ── Call-stack stepper for a single linear recursion (head/tail) ─────
   Operations are inferred from a sequence of frames.
*/
function CallStackStepper({ title, frames }) {
    const [step, setStep] = useState(-1);
    const reset = () => setStep(-1);
    const next = () => { if (step < frames.length - 1) setStep(step + 1); };
    const prev = () => { if (step >= 0) setStep(step - 1); };

    const stackAtStep = useMemo(() => {
        const arr = [];
        for (let i = 0; i <= step; i++) {
            const f = frames[i];
            if (!f) continue;
            if (f.action === "push") arr.push(f);
            else if (f.action === "pop") arr.pop();
        }
        return arr;
    }, [step, frames]);

    const current = step >= 0 ? frames[step] : null;
    const description = current ? current.description : "(start)";

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
                Step {step + 1} / {frames.length} — <strong style={{ color: "#4338ca" }}>{description}</strong>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", gap: 32, padding: "8px 0" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ fontSize: 11, fontFamily: "monospace", color: "#6b7280", marginBottom: 4 }}>── top ──</div>
                    <div style={{
                        display: "flex",
                        flexDirection: "column-reverse",
                        gap: 4,
                        border: "2px solid #d1d5db",
                        borderTop: "none",
                        borderRadius: "0 0 10px 10px",
                        padding: 8,
                        minWidth: 200,
                        minHeight: 50,
                        background: "#f9fafb",
                    }}>
                        {stackAtStep.length === 0 ? (
                            <div style={{ color: "#9ca3af", fontSize: 12, padding: 8, fontFamily: "monospace", textAlign: "center" }}>(empty)</div>
                        ) : (
                            stackAtStep.map((f, i) => (
                                <div
                                    key={i}
                                    style={{
                                        padding: "8px 12px",
                                        border: "2px solid #6366f1",
                                        borderRadius: 6,
                                        background: "white",
                                        fontFamily: "monospace",
                                        fontSize: 13,
                                        color: "#3730a3",
                                        fontWeight: 600,
                                    }}
                                >
                                    {f.label}
                                </div>
                            ))
                        )}
                    </div>
                    <div style={{ fontSize: 11, fontFamily: "monospace", color: "#6b7280", marginTop: 4 }}>call stack</div>
                </div>
                {current && current.returns !== undefined && current.action === "pop" && (
                    <div style={{
                        alignSelf: "center",
                        padding: "8px 14px",
                        border: "2px solid #059669",
                        borderRadius: 6,
                        background: "#dcfce7",
                        fontFamily: "monospace",
                        fontSize: 13,
                        color: "#166534",
                        fontWeight: 600,
                    }}>
                        returns {String(current.returns)}
                    </div>
                )}
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 12 }}>
                <button style={{ ...btn, background: "#6b7280" }} onClick={reset}>Reset</button>
                <button style={{ ...btn, background: "#4f46e5", opacity: step < 0 ? 0.5 : 1 }} onClick={prev} disabled={step < 0}>← Prev</button>
                <button style={{ ...btn, background: "#4f46e5", opacity: step >= frames.length - 1 ? 0.5 : 1 }} onClick={next} disabled={step >= frames.length - 1}>Next →</button>
            </div>
        </div>
    );
}

export { RecursionTreeVisualizer, CallStackStepper };
