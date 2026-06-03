import React, { useMemo, useState } from "react";

/* Lay out N nodes on a circle */
function circleLayout(n, radius = 100, cx = 150, cy = 130) {
    return Array.from({ length: n }, (_, i) => {
        const angle = (2 * Math.PI * i) / n - Math.PI / 2;
        return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
    });
}

/* ── Graph renderer ─────────────────────────────────────────── */
function GraphVisualizer({
    nodes = [],                   // e.g. ['A', 'B', 'C', 'D']
    edges = [],                   // e.g. [['A', 'B'], ['B', 'C']]
    directed = false,
    weighted = false,
    weights = {},                 // e.g. { 'A-B': 5 }
    highlightNodes = [],
    highlightEdges = [],          // e.g. [['A', 'B']]
    layout,                       // optional override [{x,y}, ...]
    title,
    width = 320,
    height = 260,
}) {
    const positions = useMemo(() => layout || circleLayout(nodes.length, Math.min(width, height) / 3, width / 2, height / 2), [nodes.length, layout, width, height]);
    const idx = useMemo(() => Object.fromEntries(nodes.map((n, i) => [n, i])), [nodes]);
    const hiNodeSet = new Set(highlightNodes);
    const hiEdgeSet = new Set(highlightEdges.map(([a, b]) => directed ? `${a}-${b}` : [a, b].sort().join("-")));

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
                <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#6b7280" />
                    </marker>
                    <marker id="arrow-hi" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#4f46e5" />
                    </marker>
                </defs>

                {edges.map(([a, b], i) => {
                    const pa = positions[idx[a]];
                    const pb = positions[idx[b]];
                    if (!pa || !pb) return null;
                    const key = directed ? `${a}-${b}` : [a, b].sort().join("-");
                    const isHi = hiEdgeSet.has(key);
                    const dx = pb.x - pa.x, dy = pb.y - pa.y;
                    const len = Math.sqrt(dx * dx + dy * dy);
                    const off = 22;
                    const sx = pa.x + (dx / len) * off;
                    const sy = pa.y + (dy / len) * off;
                    const ex = pb.x - (dx / len) * off;
                    const ey = pb.y - (dy / len) * off;
                    const mx = (sx + ex) / 2, my = (sy + ey) / 2;
                    return (
                        <g key={`e-${i}`}>
                            <line x1={sx} y1={sy} x2={ex} y2={ey}
                                stroke={isHi ? "#4f46e5" : "#9ca3af"}
                                strokeWidth={isHi ? 2.5 : 1.5}
                                markerEnd={directed ? (isHi ? "url(#arrow-hi)" : "url(#arrow)") : ""}
                            />
                            {weighted && weights[`${a}-${b}`] !== undefined && (
                                <g>
                                    <rect x={mx - 10} y={my - 9} width={20} height={16} fill="white" stroke="#d1d5db" rx={4} />
                                    <text x={mx} y={my + 3} textAnchor="middle" fontSize={11} fontFamily="monospace" fill="#374151">
                                        {weights[`${a}-${b}`]}
                                    </text>
                                </g>
                            )}
                        </g>
                    );
                })}

                {nodes.map((n, i) => {
                    const p = positions[i];
                    if (!p) return null;
                    const isHi = hiNodeSet.has(n);
                    return (
                        <g key={`n-${i}`}>
                            <circle cx={p.x} cy={p.y} r={20}
                                fill={isHi ? "#eef2ff" : "white"}
                                stroke={isHi ? "#4f46e5" : "#374151"}
                                strokeWidth={isHi ? 3 : 2}
                            />
                            <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize={13} fontFamily="monospace" fontWeight={700} fill={isHi ? "#3730a3" : "#1f2937"}>
                                {n}
                            </text>
                        </g>
                    );
                })}
            </svg>
            <div style={{ fontSize: 11, fontFamily: "monospace", color: "#6b7280", marginTop: 6, textAlign: "center" }}>
                {nodes.length} nodes · {edges.length} {directed ? "directed " : ""}edges{weighted ? " · weighted" : ""}
            </div>
        </div>
    );
}

/* ── BFS / DFS step-through ─────────────────────────────────── */
function TraversalStepper({ nodes, edges, start, kind = "bfs", title, directed = false }) {
    const adj = useMemo(() => {
        const a = Object.fromEntries(nodes.map((n) => [n, []]));
        for (const [u, v] of edges) {
            a[u].push(v);
            if (!directed) a[v].push(u);
        }
        for (const k of Object.keys(a)) a[k].sort();
        return a;
    }, [nodes, edges, directed]);

    const sequence = useMemo(() => {
        const visited = new Set();
        const order = [];
        if (kind === "bfs") {
            const queue = [start];
            visited.add(start);
            while (queue.length) {
                const u = queue.shift();
                order.push(u);
                for (const v of adj[u]) {
                    if (!visited.has(v)) {
                        visited.add(v);
                        queue.push(v);
                    }
                }
            }
        } else {
            const stack = [start];
            while (stack.length) {
                const u = stack.pop();
                if (visited.has(u)) continue;
                visited.add(u);
                order.push(u);
                // push in reverse so smaller neighbour comes off first
                for (const v of [...adj[u]].reverse()) {
                    if (!visited.has(v)) stack.push(v);
                }
            }
        }
        return order;
    }, [adj, start, kind]);

    const [step, setStep] = useState(0);
    const visitedSoFar = sequence.slice(0, step);
    const currentNode = sequence[step - 1] || null;
    const visitedEdges = [];
    for (let i = 1; i < step; i++) {
        // figure out parent edge: any earlier-visited neighbour
        const u = sequence[i];
        for (let j = 0; j < i; j++) {
            const candidate = sequence[j];
            if (adj[u].includes(candidate)) {
                visitedEdges.push([candidate, u]);
                break;
            }
        }
    }

    const btn = { padding: "6px 12px", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500, fontSize: 13, color: "white" };

    return (
        <div>
            <GraphVisualizer
                nodes={nodes}
                edges={edges}
                directed={directed}
                highlightNodes={visitedSoFar}
                highlightEdges={visitedEdges}
                title={title || `${kind.toUpperCase()} from ${start}`}
            />
            <div style={{ display: "flex", gap: 8, justifyContent: "center", alignItems: "center", marginTop: 4 }}>
                <button style={{ ...btn, background: "#6b7280" }} onClick={() => setStep(0)}>Reset</button>
                <button style={{ ...btn, background: "#4f46e5", opacity: step === 0 ? 0.5 : 1 }} onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>← Prev</button>
                <button style={{ ...btn, background: "#4f46e5", opacity: step >= sequence.length ? 0.5 : 1 }} onClick={() => setStep(Math.min(sequence.length, step + 1))} disabled={step >= sequence.length}>Next →</button>
                <span style={{ fontFamily: "monospace", fontSize: 12, color: "#6b7280", marginLeft: 8 }}>
                    step {step}/{sequence.length}
                    {currentNode && <> · visiting <strong style={{ color: "#3730a3" }}>{currentNode}</strong></>}
                </span>
            </div>
        </div>
    );
}

export { GraphVisualizer, TraversalStepper };
