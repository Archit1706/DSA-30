import React, { useMemo, useState } from "react";

/* ════════════════════════════════════════════════════════════════════
   System Design visual toolkit
   - ArchitectureDiagram : prop-driven boxes-and-arrows topology renderer
   - LoadBalancerDemo    : interactive request routing (round-robin / random / least-conn)
   - CapTheoremTriangle  : pick-2-of-3 interactive
   - BackOfEnvelope      : interactive capacity-estimation calculator
   - CacheDemo           : interactive cache hit/miss walk-through
   - LatencyLadder       : the "numbers every engineer should know" chart
   All components are self-contained, light-themed cards (match the rest of /components).
   ════════════════════════════════════════════════════════════════════ */

/* ── shared palette, keyed by node "type" ──────────────────────────── */
const NODE_STYLES = {
    client:  { bg: "#eef2ff", border: "#6366f1", text: "#3730a3", glyph: "◍" },
    mobile:  { bg: "#eef2ff", border: "#6366f1", text: "#3730a3", glyph: "▢" },
    dns:     { bg: "#f0fdfa", border: "#0d9488", text: "#115e59", glyph: "⌖" },
    cdn:     { bg: "#ecfeff", border: "#0891b2", text: "#155e75", glyph: "✦" },
    gateway: { bg: "#fef3c7", border: "#d97706", text: "#92400e", glyph: "⛩" },
    lb:      { bg: "#fef9c3", border: "#ca8a04", text: "#854d0e", glyph: "⚖" },
    server:  { bg: "#dcfce7", border: "#16a34a", text: "#166534", glyph: "▣" },
    service: { bg: "#dbeafe", border: "#2563eb", text: "#1e40af", glyph: "◆" },
    cache:   { bg: "#fee2e2", border: "#dc2626", text: "#991b1b", glyph: "⚡" },
    db:      { bg: "#f3e8ff", border: "#9333ea", text: "#6b21a8", glyph: "⛁" },
    replica: { bg: "#faf5ff", border: "#a855f7", text: "#7e22ce", glyph: "⛁" },
    queue:   { bg: "#ffedd5", border: "#ea580c", text: "#9a3412", glyph: "≣" },
    storage: { bg: "#e0f2fe", border: "#0284c7", text: "#075985", glyph: "▤" },
    worker:  { bg: "#d1fae5", border: "#059669", text: "#065f46", glyph: "⚙" },
    note:    { bg: "#f9fafb", border: "#d1d5db", text: "#6b7280", glyph: "" },
};

const NODE_W = 124;
const NODE_H = 56;

/* clip a line that starts at (sx,sy) and aims at the centre of a box,
   returning the point where it crosses that box's border */
function clipToBox(sx, sy, cx, cy, w = NODE_W, h = NODE_H) {
    const dx = cx - sx;
    const dy = cy - sy;
    if (dx === 0 && dy === 0) return { x: cx, y: cy };
    const hw = w / 2 + 2;
    const hh = h / 2 + 2;
    const scale = Math.min(
        Math.abs(dx) > 1e-6 ? hw / Math.abs(dx) : Infinity,
        Math.abs(dy) > 1e-6 ? hh / Math.abs(dy) : Infinity
    );
    return { x: cx - dx * scale, y: cy - dy * scale };
}

function ArchitectureDiagram({ nodes, edges = [], title, caption, width, height }) {
    // each node: { id, label, sub, type, x, y, w, h }  (x,y are CENTRES, in px)
    const byId = useMemo(() => {
        const m = {};
        nodes.forEach((n) => (m[n.id] = n));
        return m;
    }, [nodes]);

    const maxX = Math.max(...nodes.map((n) => n.x + (n.w || NODE_W) / 2)) + 24;
    const maxY = Math.max(...nodes.map((n) => n.y + (n.h || NODE_H) / 2)) + 24;
    const W = width || Math.max(maxX, 320);
    const H = height || maxY;

    return (
        <div style={{
            border: "1px solid #e5e7eb", borderRadius: 10, padding: 16,
            margin: "16px 0", background: "#fafafa", overflowX: "auto",
        }}>
            {title && (
                <div style={{ fontWeight: 600, fontSize: 14, color: "#374151", marginBottom: 10 }}>
                    {title}
                </div>
            )}
            <svg width={W} height={H} style={{ display: "block", margin: "0 auto", minWidth: Math.min(W, 320) }}>
                <defs>
                    <marker id="sd-arrow" markerWidth="10" markerHeight="10" refX="7" refY="3"
                        orient="auto" markerUnits="strokeWidth">
                        <path d="M0,0 L7,3 L0,6 Z" fill="#9ca3af" />
                    </marker>
                    <marker id="sd-arrow-2" markerWidth="10" markerHeight="10" refX="0" refY="3"
                        orient="auto" markerUnits="strokeWidth">
                        <path d="M7,0 L0,3 L7,6 Z" fill="#9ca3af" />
                    </marker>
                </defs>

                {/* edges first, so boxes sit on top */}
                {edges.map((e, i) => {
                    const a = byId[e.from];
                    const b = byId[e.to];
                    if (!a || !b) return null;
                    const p1 = clipToBox(b.x, b.y, a.x, a.y, a.w, a.h);
                    const p2 = clipToBox(a.x, a.y, b.x, b.y, b.w, b.h);
                    const midX = (p1.x + p2.x) / 2;
                    const midY = (p1.y + p2.y) / 2;
                    return (
                        <g key={i}>
                            <line
                                x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                                stroke={e.color || "#9ca3af"} strokeWidth="1.6"
                                strokeDasharray={e.dashed ? "5 4" : undefined}
                                markerEnd="url(#sd-arrow)"
                                markerStart={e.bidir ? "url(#sd-arrow-2)" : undefined}
                            />
                            {e.label && (
                                <g>
                                    <rect x={midX - e.label.length * 3.1 - 4} y={midY - 9}
                                        width={e.label.length * 6.2 + 8} height={16} rx={4}
                                        fill="#fafafa" opacity="0.95" />
                                    <text x={midX} y={midY + 3} textAnchor="middle"
                                        fontSize="10.5" fontFamily="monospace" fill="#6b7280">
                                        {e.label}
                                    </text>
                                </g>
                            )}
                        </g>
                    );
                })}

                {/* nodes */}
                {nodes.map((n) => {
                    const s = NODE_STYLES[n.type] || NODE_STYLES.note;
                    const w = n.w || NODE_W;
                    const h = n.h || NODE_H;
                    return (
                        <g key={n.id}>
                            <rect x={n.x - w / 2} y={n.y - h / 2} width={w} height={h} rx={9}
                                fill={s.bg} stroke={s.border} strokeWidth="2" />
                            {s.glyph && (
                                <text x={n.x - w / 2 + 13} y={n.y + 5} fontSize="15" fill={s.border}>
                                    {s.glyph}
                                </text>
                            )}
                            <text x={n.x + (s.glyph ? 7 : 0)} y={n.sub ? n.y - 3 : n.y + 4}
                                textAnchor="middle" fontSize="12.5" fontWeight="700" fill={s.text}>
                                {n.label}
                            </text>
                            {n.sub && (
                                <text x={n.x + (s.glyph ? 7 : 0)} y={n.y + 13} textAnchor="middle"
                                    fontSize="10" fontFamily="monospace" fill={s.text} opacity="0.75">
                                    {n.sub}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>
            {caption && (
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 10, textAlign: "center", lineHeight: 1.5 }}>
                    {caption}
                </div>
            )}
        </div>
    );
}

/* ── Load balancer interactive ─────────────────────────────────────── */
const LB_STRATEGIES = {
    "round-robin": "Round Robin",
    "random": "Random",
    "least-conn": "Least Connections",
};

function LoadBalancerDemo() {
    const N = 4;
    const [strategy, setStrategy] = useState("round-robin");
    const [loads, setLoads] = useState(Array(N).fill(0));
    const [rr, setRr] = useState(0);
    const [last, setLast] = useState(null);
    const [total, setTotal] = useState(0);

    const pick = () => {
        let idx;
        if (strategy === "round-robin") {
            idx = rr % N;
            setRr(rr + 1);
        } else if (strategy === "random") {
            // deterministic-ish "random": rotate by a 7-step skip so it looks scattered
            idx = (rr * 3 + 1) % N;
            setRr(rr + 1);
        } else {
            const min = Math.min(...loads);
            idx = loads.indexOf(min);
        }
        const next = [...loads];
        next[idx] += 1;
        setLoads(next);
        setLast(idx);
        setTotal(total + 1);
    };

    const drop = () => {
        if (last === null) return;
        const busy = loads.map((v, i) => ({ v, i })).filter((o) => o.v > 0);
        if (busy.length === 0) return;
        const target = busy[total % busy.length].i;
        const next = [...loads];
        next[target] = Math.max(0, next[target] - 1);
        setLoads(next);
    };

    const reset = () => { setLoads(Array(N).fill(0)); setRr(0); setLast(null); setTotal(0); };
    const maxLoad = Math.max(1, ...loads);
    const btn = { padding: "6px 14px", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 13, color: "white" };

    return (
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 16, margin: "16px 0", background: "#fafafa" }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#374151", marginBottom: 10 }}>
                Load balancer — watch how a strategy spreads {total} request{total === 1 ? "" : "s"}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                {Object.entries(LB_STRATEGIES).map(([k, v]) => (
                    <button key={k}
                        onClick={() => { setStrategy(k); }}
                        style={{
                            ...btn,
                            background: strategy === k ? "#ca8a04" : "#e5e7eb",
                            color: strategy === k ? "white" : "#374151",
                        }}>
                        {v}
                    </button>
                ))}
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", gap: 12, justifyContent: "center", minHeight: 150, padding: "0 4px" }}>
                {loads.map((load, i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, maxWidth: 90 }}>
                        <div style={{ fontSize: 11, fontFamily: "monospace", color: "#6b7280", marginBottom: 4 }}>{load}</div>
                        <div style={{
                            width: "100%", height: `${20 + (load / maxLoad) * 100}px`,
                            background: last === i ? "linear-gradient(180deg,#22c55e,#16a34a)" : "linear-gradient(180deg,#86efac,#4ade80)",
                            border: `2px solid ${last === i ? "#15803d" : "#16a34a"}`,
                            borderRadius: 8, transition: "height .25s, background .25s",
                            display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 4,
                        }}>
                            <span style={{ fontSize: 16 }}>▣</span>
                        </div>
                        <div style={{ fontSize: 11, fontFamily: "monospace", color: "#166534", marginTop: 4, fontWeight: 600 }}>
                            srv-{i}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 14 }}>
                <button style={{ ...btn, background: "#16a34a" }} onClick={pick}>+ Send request</button>
                <button style={{ ...btn, background: "#0ea5e9" }} onClick={drop}>− Finish a request</button>
                <button style={{ ...btn, background: "#6b7280" }} onClick={reset}>Reset</button>
            </div>
            <div style={{ fontSize: 11.5, color: "#6b7280", marginTop: 10, textAlign: "center", lineHeight: 1.5 }}>
                {strategy === "round-robin" && "Round robin cycles 0→1→2→3→0… Perfectly even when every request costs the same."}
                {strategy === "random" && "Random scatters requests. Cheap, stateless, and even over the long run — but bursty in the short run."}
                {strategy === "least-conn" && "Least-connections always feeds the shortest queue. Best when requests have wildly different costs — finish some and watch it self-correct."}
            </div>
        </div>
    );
}

/* ── CAP theorem triangle ──────────────────────────────────────────── */
const CAP_INFO = {
    CA: {
        title: "CA — Consistent + Available",
        body: "Every read sees the latest write AND every request gets an answer — but only while the network is healthy. The moment a partition happens, a CA system cannot uphold both, so in practice CA describes a single-node database. Not achievable for a distributed system under partitions.",
        examples: "Single-node PostgreSQL / MySQL (no partition to survive).",
        tone: "#6b7280",
    },
    CP: {
        title: "CP — Consistent + Partition-tolerant",
        body: "When the network splits, the system refuses to answer rather than return stale or conflicting data. You sacrifice availability: some requests error or block until the partition heals. Pick this when correctness beats uptime — money, inventory, locks.",
        examples: "HBase, MongoDB (default), ZooKeeper, etcd, Spanner.",
        tone: "#9333ea",
    },
    AP: {
        title: "AP — Available + Partition-tolerant",
        body: "When the network splits, every node keeps answering from whatever it last knew, accepting that replicas may temporarily disagree. You sacrifice strong consistency for uptime, then reconcile later (eventual consistency). Pick this for feeds, carts, metrics, DNS.",
        examples: "Cassandra, DynamoDB, Riak, CouchDB.",
        tone: "#16a34a",
    },
};

function CapTheoremTriangle() {
    const [pick, setPick] = useState("CP");
    const info = CAP_INFO[pick];
    const verts = {
        C: { x: 160, y: 30, label: "Consistency", desc: "every read sees the latest write" },
        A: { x: 40, y: 200, label: "Availability", desc: "every request gets a (non-error) response" },
        P: { x: 280, y: 200, label: "Partition tolerance", desc: "survives dropped messages between nodes" },
    };
    const active = { CA: ["C", "A"], CP: ["C", "P"], AP: ["A", "P"] }[pick];

    return (
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 16, margin: "16px 0", background: "#fafafa" }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#374151", marginBottom: 4 }}>
                CAP theorem — under a network partition you may keep only two
            </div>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 10 }}>
                Tap a pair. Since real distributed systems must tolerate partitions (P), the real choice is <strong>CP vs AP</strong>.
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                {["CA", "CP", "AP"].map((k) => (
                    <button key={k} onClick={() => setPick(k)}
                        style={{
                            padding: "6px 14px", border: "none", borderRadius: 6, cursor: "pointer",
                            fontWeight: 700, fontSize: 13, fontFamily: "monospace",
                            background: pick === k ? CAP_INFO[k].tone : "#e5e7eb",
                            color: pick === k ? "white" : "#374151",
                        }}>
                        {k}
                    </button>
                ))}
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
                <svg width="320" height="240" style={{ flexShrink: 0 }}>
                    {[["C", "A"], ["A", "P"], ["C", "P"]].map(([u, v], i) => {
                        const on = active.includes(u) && active.includes(v);
                        return (
                            <line key={i} x1={verts[u].x} y1={verts[u].y} x2={verts[v].x} y2={verts[v].y}
                                stroke={on ? info.tone : "#d1d5db"} strokeWidth={on ? 4 : 2}
                                strokeDasharray={on ? undefined : "5 4"} />
                        );
                    })}
                    {Object.entries(verts).map(([k, p]) => {
                        const on = active.includes(k);
                        return (
                            <g key={k}>
                                <circle cx={p.x} cy={p.y} r={on ? 26 : 22}
                                    fill={on ? info.tone : "#f3f4f6"} stroke={on ? info.tone : "#9ca3af"} strokeWidth="2" />
                                <text x={p.x} y={p.y + 6} textAnchor="middle" fontSize="20" fontWeight="800"
                                    fill={on ? "white" : "#6b7280"} fontFamily="monospace">{k}</text>
                                <text x={p.x} y={p.y === 30 ? p.y - 32 : p.y + 44} textAnchor="middle"
                                    fontSize="11" fontWeight="600" fill="#374151">{p.label}</text>
                            </g>
                        );
                    })}
                </svg>
                <div style={{ flex: 1, minWidth: 220 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: info.tone, marginBottom: 6 }}>{info.title}</div>
                    <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.55, marginBottom: 8 }}>{info.body}</div>
                    <div style={{ fontSize: 12, color: "#6b7280", fontFamily: "monospace" }}>
                        Examples: {info.examples}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── Back-of-the-envelope calculator ───────────────────────────────── */
function fmt(n) {
    if (n >= 1e12) return (n / 1e12).toFixed(2) + " T";
    if (n >= 1e9) return (n / 1e9).toFixed(2) + " B";
    if (n >= 1e6) return (n / 1e6).toFixed(2) + " M";
    if (n >= 1e3) return (n / 1e3).toFixed(1) + " K";
    return n.toFixed(0);
}
function fmtBytes(b) {
    const u = ["B", "KB", "MB", "GB", "TB", "PB"];
    let i = 0;
    while (b >= 1024 && i < u.length - 1) { b /= 1024; i++; }
    return b.toFixed(2) + " " + u[i];
}

function BackOfEnvelope() {
    const [dau, setDau] = useState(10);          // millions
    const [perUser, setPerUser] = useState(5);    // writes/reads per user per day
    const [readRatio, setReadRatio] = useState(100); // reads per write
    const [sizeKb, setSizeKb] = useState(1);      // KB per object
    const [peak, setPeak] = useState(3);          // peak multiplier

    const dauN = dau * 1e6;
    const writesPerDay = dauN * perUser;
    const readsPerDay = writesPerDay * readRatio;
    const secsPerDay = 86400;
    const writeQps = writesPerDay / secsPerDay;
    const readQps = readsPerDay / secsPerDay;
    const peakWriteQps = writeQps * peak;
    const peakReadQps = readQps * peak;
    const storagePerDay = writesPerDay * sizeKb * 1024;
    const storage5yr = storagePerDay * 365 * 5;

    const Row = ({ label, value, unit }) => (
        <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #eef0f2" }}>
            <span style={{ fontSize: 13, color: "#374151" }}>{label}</span>
            <span style={{ fontSize: 13, fontFamily: "monospace", fontWeight: 700, color: "#1e40af" }}>
                {value} <span style={{ color: "#9ca3af", fontWeight: 400 }}>{unit}</span>
            </span>
        </div>
    );
    const Slider = ({ label, value, set, min, max, step, suffix }) => (
        <div style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#374151", marginBottom: 3 }}>
                <span>{label}</span>
                <span style={{ fontFamily: "monospace", fontWeight: 700, color: "#0891b2" }}>{value}{suffix}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={value}
                onChange={(e) => set(Number(e.target.value))} style={{ width: "100%", accentColor: "#0891b2" }} />
        </div>
    );

    return (
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 16, margin: "16px 0", background: "#fafafa" }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#374151", marginBottom: 12 }}>
                Back-of-the-envelope — drag the inputs, read off the capacity
            </div>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 230 }}>
                    <Slider label="Daily active users" value={dau} set={setDau} min={1} max={500} step={1} suffix=" M" />
                    <Slider label="Writes per user / day" value={perUser} set={setPerUser} min={1} max={50} step={1} suffix="" />
                    <Slider label="Read : write ratio" value={readRatio} set={setReadRatio} min={1} max={1000} step={1} suffix=":1" />
                    <Slider label="Size per object" value={sizeKb} set={setSizeKb} min={1} max={1024} step={1} suffix=" KB" />
                    <Slider label="Peak factor (× average)" value={peak} set={setPeak} min={1} max={10} step={1} suffix="×" />
                </div>
                <div style={{ flex: 1, minWidth: 230, background: "white", borderRadius: 8, border: "1px solid #e5e7eb", padding: "4px 14px" }}>
                    <Row label="Writes / day" value={fmt(writesPerDay)} unit="" />
                    <Row label="Reads / day" value={fmt(readsPerDay)} unit="" />
                    <Row label="Avg write QPS" value={fmt(writeQps)} unit="/s" />
                    <Row label="Avg read QPS" value={fmt(readQps)} unit="/s" />
                    <Row label="Peak write QPS" value={fmt(peakWriteQps)} unit="/s" />
                    <Row label="Peak read QPS" value={fmt(peakReadQps)} unit="/s" />
                    <Row label="New storage / day" value={fmtBytes(storagePerDay)} unit="" />
                    <Row label="Storage @ 5 years" value={fmtBytes(storage5yr)} unit="" />
                </div>
            </div>
            <div style={{ fontSize: 11.5, color: "#6b7280", marginTop: 10, lineHeight: 1.5 }}>
                Rule of thumb: <strong>1 day ≈ 86,400 s ≈ 10<sup>5</sup> s</strong>. So "X per day" ÷ 10<sup>5</sup> ≈ QPS.
                Reads usually dwarf writes — that read:write ratio is why caches and read-replicas exist.
            </div>
        </div>
    );
}

/* ── Cache hit/miss demo ───────────────────────────────────────────── */
function CacheDemo() {
    const CAP = 3;
    const [cache, setCache] = useState([]); // {key, value} LRU: front = most recent
    const [log, setLog] = useState([]);
    const KEYS = ["user:1", "user:2", "user:3", "user:4"];

    const request = (key) => {
        const hit = cache.find((c) => c.key === key);
        let next;
        let outcome;
        if (hit) {
            next = [hit, ...cache.filter((c) => c.key !== key)];
            outcome = "HIT";
        } else {
            const entry = { key, value: "db→" + key.split(":")[1] };
            next = [entry, ...cache].slice(0, CAP);
            outcome = cache.length >= CAP ? "MISS (evict LRU)" : "MISS (fill DB)";
        }
        setCache(next);
        setLog([{ key, outcome }, ...log].slice(0, 6));
    };
    const reset = () => { setCache([]); setLog([]); };

    return (
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 16, margin: "16px 0", background: "#fafafa" }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#374151", marginBottom: 4 }}>
                Cache (LRU, capacity {CAP}) — request a key, watch hits, misses, and eviction
            </div>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 12 }}>
                A hit moves the key to the front. A miss on a full cache evicts the least-recently-used (rightmost) entry.
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                {KEYS.map((k) => (
                    <button key={k} onClick={() => request(k)}
                        style={{ padding: "6px 12px", border: "1px solid #dc2626", borderRadius: 6, cursor: "pointer",
                            fontWeight: 600, fontSize: 12.5, fontFamily: "monospace", background: "#fee2e2", color: "#991b1b" }}>
                        GET {k}
                    </button>
                ))}
                <button onClick={reset}
                    style={{ padding: "6px 12px", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 12.5, background: "#6b7280", color: "white" }}>
                    Reset
                </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontFamily: "monospace", color: "#16a34a", fontWeight: 600 }}>MRU →</span>
                <div style={{ display: "flex", gap: 8, flex: 1 }}>
                    {Array.from({ length: CAP }).map((_, i) => {
                        const c = cache[i];
                        return (
                            <div key={i} style={{
                                flex: 1, minHeight: 48, borderRadius: 8,
                                border: `2px ${c ? "solid" : "dashed"} ${c ? "#dc2626" : "#d1d5db"}`,
                                background: c ? "#fee2e2" : "#f9fafb",
                                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                fontFamily: "monospace",
                            }}>
                                {c ? (
                                    <>
                                        <span style={{ fontSize: 12.5, fontWeight: 700, color: "#991b1b" }}>{c.key}</span>
                                        <span style={{ fontSize: 10, color: "#b91c1c" }}>{c.value}</span>
                                    </>
                                ) : <span style={{ fontSize: 11, color: "#9ca3af" }}>empty</span>}
                            </div>
                        );
                    })}
                </div>
                <span style={{ fontSize: 11, fontFamily: "monospace", color: "#dc2626", fontWeight: 600 }}>← LRU</span>
            </div>
            <div style={{ minHeight: 24, marginTop: 10 }}>
                {log.map((l, i) => (
                    <span key={i} style={{
                        display: "inline-block", margin: "2px 4px 2px 0", padding: "2px 8px", borderRadius: 10,
                        fontSize: 11, fontFamily: "monospace", fontWeight: 600,
                        background: l.outcome === "HIT" ? "#dcfce7" : "#fef3c7",
                        color: l.outcome === "HIT" ? "#166534" : "#92400e",
                        opacity: 1 - i * 0.12,
                    }}>
                        {l.key}: {l.outcome}
                    </span>
                ))}
            </div>
        </div>
    );
}

/* ── Latency ladder ────────────────────────────────────────────────── */
const LATENCIES = [
    { label: "L1 cache reference", ns: 1, note: "≈ 1 heartbeat of the CPU" },
    { label: "Branch mispredict", ns: 3 },
    { label: "L2 cache reference", ns: 4 },
    { label: "Mutex lock / unlock", ns: 17 },
    { label: "Main memory (RAM) reference", ns: 100, note: "100× slower than L1" },
    { label: "Compress 1 KB (Zippy)", ns: 2_000 },
    { label: "Read 1 MB sequentially from RAM", ns: 3_000 },
    { label: "Send 1 KB over 1 Gbps network", ns: 10_000 },
    { label: "Read 4 KB randomly from SSD", ns: 16_000 },
    { label: "Read 1 MB sequentially from SSD", ns: 49_000 },
    { label: "Round trip within same datacenter", ns: 500_000, note: "0.5 ms" },
    { label: "Read 1 MB sequentially from disk (HDD)", ns: 825_000 },
    { label: "Disk seek (HDD)", ns: 2_000_000, note: "2 ms" },
    { label: "Round trip CA ↔ Netherlands", ns: 150_000_000, note: "150 ms — speed of light is the limit" },
];

function humanNs(ns) {
    if (ns < 1000) return ns + " ns";
    if (ns < 1e6) return (ns / 1000).toFixed(ns % 1000 ? 1 : 0) + " µs";
    if (ns < 1e9) return (ns / 1e6).toFixed(ns % 1e6 ? 1 : 0) + " ms";
    return (ns / 1e9).toFixed(2) + " s";
}

function LatencyLadder() {
    const maxLog = Math.log10(LATENCIES[LATENCIES.length - 1].ns);
    const minLog = 0;
    return (
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 16, margin: "16px 0", background: "#fafafa" }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#374151", marginBottom: 4 }}>
                Latency numbers every engineer should know (log scale)
            </div>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 14 }}>
                Each step right is roughly <strong>10× slower</strong>. The takeaway isn't the digits — it's the <em>orders of magnitude</em> between RAM, SSD, disk, and the network.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {LATENCIES.map((l, i) => {
                    const frac = (Math.log10(l.ns) - minLog) / (maxLog - minLog);
                    const hue = 140 - frac * 140; // green → red
                    return (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 210, fontSize: 11.5, color: "#374151", textAlign: "right", flexShrink: 0, lineHeight: 1.2 }}>
                                {l.label}
                            </div>
                            <div style={{ flex: 1, background: "#f3f4f6", borderRadius: 4, height: 18, position: "relative", minWidth: 80 }}>
                                <div style={{
                                    width: `${Math.max(frac * 100, 2)}%`, height: "100%", borderRadius: 4,
                                    background: `hsl(${hue},70%,50%)`,
                                }} />
                            </div>
                            <div style={{ width: 130, fontSize: 11, fontFamily: "monospace", color: "#111827", fontWeight: 600, flexShrink: 0 }}>
                                {humanNs(l.ns)}
                                {l.note && <span style={{ color: "#9ca3af", fontWeight: 400 }}> · {l.note}</span>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export {
    ArchitectureDiagram,
    LoadBalancerDemo,
    CapTheoremTriangle,
    BackOfEnvelope,
    CacheDemo,
    LatencyLadder,
};
