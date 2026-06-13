import React, { useMemo, useState } from "react";

/* ════════════════════════════════════════════════════════════════════
   Segment tree visual toolkit
   - SegmentTreeVisualizer : static sum-segment-tree over an array
   - InteractiveSegmentTree: range-query (shows the O(log n) decomposition)
                             and point-update (shows the root→leaf path)
   Self-contained light-theme cards.
   ════════════════════════════════════════════════════════════════════ */

let _sid = 0;
function build(arr, lo, hi) {
    const node = { lo, hi, id: _sid++, left: null, right: null };
    if (lo === hi) {
        node.val = arr[lo];
        return node;
    }
    const mid = (lo + hi) >> 1;
    node.left = build(arr, lo, mid);
    node.right = build(arr, mid + 1, hi);
    node.val = node.left.val + node.right.val;
    return node;
}
function buildTree(arr) {
    _sid = 0;
    return build(arr, 0, arr.length - 1);
}

/* layout by leaf order */
function layout(root) {
    let leaf = 0, maxDepth = 0;
    const place = (n, d) => {
        maxDepth = Math.max(maxDepth, d);
        n.depth = d;
        if (!n.left) { n.x = leaf++; return; }
        place(n.left, d + 1);
        place(n.right, d + 1);
        n.x = (n.left.x + n.right.x) / 2;
    };
    place(root, 0);
    return { leaves: Math.max(leaf, 1), depth: maxDepth };
}
function collect(n, acc) {
    if (!n) return acc;
    acc.push(n);
    collect(n.left, acc);
    collect(n.right, acc);
    return acc;
}

/* canonical query decomposition: ids of nodes that fully cover part of [ql,qr] */
function queryNodes(node, ql, qr, used, visited) {
    if (!node || qr < node.lo || node.hi < ql) return 0;       // disjoint
    visited.push(node.id);
    if (ql <= node.lo && node.hi <= qr) {                       // fully inside
        used.push(node.id);
        return node.val;
    }
    return queryNodes(node.left, ql, qr, used, visited)
        + queryNodes(node.right, ql, qr, used, visited);
}

/* root→leaf path for a point update */
function updatePath(node, i, acc) {
    if (!node) return;
    acc.push(node.id);
    if (node.lo === node.hi) return;
    const mid = (node.lo + node.hi) >> 1;
    if (i <= mid) updatePath(node.left, i, acc);
    else updatePath(node.right, i, acc);
}

function STSvg({ root, highlight = new Set(), highlightStrong = new Set(), array, arrHighlight = new Set() }) {
    const meta = useMemo(() => layout(root), [root]);
    const nodes = useMemo(() => collect(root, []), [root]);
    const colW = 92;
    const rowH = 70;
    const width = Math.max((meta.leaves + 1) * colW, 320);
    const height = (meta.depth + 1) * rowH + 70;
    const cx = (n) => (n.x + 0.7) * colW;
    const cy = (n) => n.depth * rowH + 30;

    const edges = [];
    const walk = (n) => {
        if (!n) return;
        if (n.left) { edges.push([n, n.left]); walk(n.left); }
        if (n.right) { edges.push([n, n.right]); walk(n.right); }
    };
    walk(root);

    return (
        <svg width={width} height={height} style={{ display: "block", margin: "0 auto", minWidth: Math.min(width, 300) }}>
            {edges.map(([a, b], i) => {
                const on = highlight.has(a.id) && highlight.has(b.id);
                return <line key={i} x1={cx(a)} y1={cy(a)} x2={cx(b)} y2={cy(b)}
                    stroke={on ? "#7c3aed" : "#cbd5e1"} strokeWidth={on ? 2.5 : 1.4} />;
            })}
            {nodes.map((n) => {
                const strong = highlightStrong.has(n.id);
                const on = highlight.has(n.id);
                const fill = strong ? "#ede9fe" : on ? "#f5f3ff" : "#f8fafc";
                const stroke = strong ? "#7c3aed" : on ? "#a78bfa" : "#94a3b8";
                const w = 56, h = 34;
                return (
                    <g key={n.id}>
                        <rect x={cx(n) - w / 2} y={cy(n) - h / 2} width={w} height={h} rx={7}
                            fill={fill} stroke={stroke} strokeWidth={strong ? 2.5 : 1.6} />
                        <text x={cx(n)} y={cy(n) - 3} textAnchor="middle" fontSize="13" fontWeight="700"
                            fontFamily="monospace" fill="#5b21b6">{n.val}</text>
                        <text x={cx(n)} y={cy(n) + 10} textAnchor="middle" fontSize="9.5"
                            fontFamily="monospace" fill="#64748b">[{n.lo},{n.hi}]</text>
                    </g>
                );
            })}
            {/* the underlying array, under the leaves */}
            {array && array.map((v, i) => {
                const leaf = nodes.find((n) => n.lo === i && n.hi === i);
                if (!leaf) return null;
                const x = cx(leaf), y = height - 24;
                const hot = arrHighlight.has(i);
                return (
                    <g key={"a" + i}>
                        <rect x={x - 16} y={y - 14} width={32} height={26} rx={4}
                            fill={hot ? "#fef9c3" : "#fff"} stroke={hot ? "#ca8a04" : "#cbd5e1"} strokeWidth={hot ? 2 : 1.2} />
                        <text x={x} y={y + 4} textAnchor="middle" fontSize="12" fontFamily="monospace" fontWeight="600" fill="#475569">{v}</text>
                        <text x={x} y={y + 24} textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#94a3b8">i={i}</text>
                    </g>
                );
            })}
        </svg>
    );
}

function SegmentTreeVisualizer({ array = [5, 2, 8, 1, 9, 3], title, caption }) {
    const root = useMemo(() => buildTree(array), [array.join(",")]);
    return (
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 16, margin: "16px 0", background: "#fafafa", overflowX: "auto" }}>
            {title && <div style={{ fontWeight: 600, fontSize: 14, color: "#374151", marginBottom: 10 }}>{title}</div>}
            <STSvg root={root} array={array} />
            <div style={{ fontSize: 11, fontFamily: "monospace", color: "#6b7280", marginTop: 6, textAlign: "center" }}>
                each node = <strong>sum</strong> of its range <span style={{ color: "#94a3b8" }}>[lo,hi]</span>; leaves = the array
            </div>
            {caption && <div style={{ fontSize: 12, color: "#6b7280", marginTop: 8, textAlign: "center", lineHeight: 1.5 }}>{caption}</div>}
        </div>
    );
}

function InteractiveSegmentTree({ initialArray = [5, 2, 8, 1, 9, 3] }) {
    const [array, setArray] = useState(initialArray);
    const [ql, setQl] = useState(1);
    const [qr, setQr] = useState(4);
    const [ui, setUi] = useState(2);
    const [uv, setUv] = useState(6);
    const [hl, setHl] = useState(new Set());
    const [strong, setStrong] = useState(new Set());
    const [arrHot, setArrHot] = useState(new Set());
    const [msg, setMsg] = useState(null);

    const root = useMemo(() => buildTree(array), [array.join(",")]);
    const n = array.length;

    const runQuery = () => {
        const a = Math.min(ql, qr), b = Math.max(ql, qr);
        const used = [], visited = [];
        const sum = queryNodes(root, a, b, used, visited);
        setHl(new Set(visited));
        setStrong(new Set(used));
        setArrHot(new Set(Array.from({ length: b - a + 1 }, (_, k) => a + k)));
        setMsg({ kind: "ok", text: `query(${a}, ${b}) = ${sum} — combined from ${used.length} highlighted node${used.length === 1 ? "" : "s"} (the O(log n) decomposition), not ${b - a + 1} array cells.` });
    };
    const runUpdate = () => {
        const i = Math.max(0, Math.min(n - 1, ui));
        const v = Number.isFinite(uv) ? uv : 0;
        const next = [...array]; next[i] = v;
        setArray(next);
        const path = [];
        updatePath(buildTree(next), i, path);
        setHl(new Set(path));
        setStrong(new Set(path));
        setArrHot(new Set([i]));
        setMsg({ kind: "warn", text: `update(i=${i}, ${v}) — only the ${path.length} nodes on the root→leaf path change (O(log n)). Every ancestor's sum is recomputed from its two children.` });
    };
    const clear = () => { setHl(new Set()); setStrong(new Set()); setArrHot(new Set()); setMsg(null); };
    const reset = () => { setArray(initialArray); clear(); };

    const btn = { padding: "6px 12px", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 13, color: "white" };
    const num = { width: 46, padding: "5px 6px", border: "1px solid #cbd5e1", borderRadius: 6, fontFamily: "monospace", fontSize: 13, textAlign: "center" };

    return (
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 16, margin: "16px 0", background: "#fafafa", overflowX: "auto" }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#374151", marginBottom: 12 }}>
                Try it — range-sum query and point update, both O(log n)
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 12, alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 13, color: "#374151" }}>query [</span>
                    <input type="number" min={0} max={n - 1} value={ql} onChange={(e) => setQl(+e.target.value)} style={num} />
                    <span style={{ fontSize: 13, color: "#374151" }}>,</span>
                    <input type="number" min={0} max={n - 1} value={qr} onChange={(e) => setQr(+e.target.value)} style={num} />
                    <span style={{ fontSize: 13, color: "#374151" }}>]</span>
                    <button style={{ ...btn, background: "#7c3aed" }} onClick={runQuery}>Query</button>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 13, color: "#374151" }}>set i</span>
                    <input type="number" min={0} max={n - 1} value={ui} onChange={(e) => setUi(+e.target.value)} style={num} />
                    <span style={{ fontSize: 13, color: "#374151" }}>=</span>
                    <input type="number" value={uv} onChange={(e) => setUv(+e.target.value)} style={num} />
                    <button style={{ ...btn, background: "#ca8a04" }} onClick={runUpdate}>Update</button>
                </div>
                <button style={{ ...btn, background: "#6b7280" }} onClick={reset}>Reset</button>
            </div>
            <STSvg root={root} array={array} highlight={hl} highlightStrong={strong} arrHighlight={arrHot} />
            {msg && (
                <div style={{
                    marginTop: 10, padding: "8px 12px", borderRadius: 6, fontSize: 12.5, fontFamily: "monospace",
                    background: msg.kind === "ok" ? "#ede9fe" : "#fef9c3",
                    color: msg.kind === "ok" ? "#5b21b6" : "#92400e",
                }}>
                    {msg.text}
                </div>
            )}
        </div>
    );
}

export { SegmentTreeVisualizer, InteractiveSegmentTree };
