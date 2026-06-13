import React, { useMemo, useState } from "react";

/* ════════════════════════════════════════════════════════════════════
   Trie (prefix tree) visual toolkit
   - TrieVisualizer    : static, prop-driven trie drawn from a word list
   - InteractiveTrie   : insert / search / startsWith with path highlighting
   Self-contained light-theme cards, matching the rest of /components.
   ════════════════════════════════════════════════════════════════════ */

let _id = 0;
function freshNode(char) {
    return { char, children: {}, isEnd: false, id: _id++ };
}

function buildTrie(words) {
    _id = 0;
    const root = freshNode("");
    for (const w of words) {
        let cur = root;
        for (const ch of w) {
            if (!cur.children[ch]) cur.children[ch] = freshNode(ch);
            cur = cur.children[ch];
        }
        cur.isEnd = true;
    }
    return root;
}

/* layout: x by leaf order, y by depth */
function layoutTrie(root) {
    let leaf = 0;
    let maxDepth = 0;
    const place = (node, depth) => {
        maxDepth = Math.max(maxDepth, depth);
        const kids = Object.keys(node.children).sort().map((k) => node.children[k]);
        if (kids.length === 0) {
            node.x = leaf++;
            node.depth = depth;
            return;
        }
        kids.forEach((c) => place(c, depth + 1));
        node.x = (kids[0].x + kids[kids.length - 1].x) / 2;
        node.depth = depth;
    };
    place(root, 0);
    return { leaves: Math.max(leaf, 1), depth: maxDepth };
}

function collect(node, acc) {
    acc.push(node);
    Object.keys(node.children).sort().forEach((k) => collect(node.children[k], acc));
    return acc;
}

function TrieSVG({ root, highlightPath = [], notFound = false, dimUnhighlighted = false }) {
    const meta = useMemo(() => layoutTrie(root), [root]);
    const nodes = useMemo(() => collect(root, []), [root]);
    const colW = 60;
    const rowH = 66;
    const width = Math.max((meta.leaves + 1) * colW, 240);
    const height = (meta.depth + 1) * rowH + 30;
    const hp = new Set(highlightPath);

    const cx = (n) => (n.x + 0.7) * colW;
    const cy = (n) => n.depth * rowH + 28;

    const edges = [];
    const walk = (n) => {
        Object.keys(n.children).sort().forEach((k) => {
            const c = n.children[k];
            edges.push({ from: n, to: c });
            walk(c);
        });
    };
    walk(root);

    return (
        <svg width={width} height={height} style={{ display: "block", margin: "0 auto", minWidth: Math.min(width, 280) }}>
            {edges.map((e, i) => {
                const on = hp.has(e.from.id) && hp.has(e.to.id);
                return (
                    <line key={i} x1={cx(e.from)} y1={cy(e.from)} x2={cx(e.to)} y2={cy(e.to)}
                        stroke={on ? (notFound ? "#dc2626" : "#7c3aed") : "#cbd5e1"}
                        strokeWidth={on ? 3 : 1.5}
                        opacity={dimUnhighlighted && !on ? 0.35 : 1} />
                );
            })}
            {nodes.map((n) => {
                const isRoot = n.id === root.id;
                const on = hp.has(n.id);
                const baseFill = isRoot ? "#e0e7ff" : n.isEnd ? "#dcfce7" : "#f1f5f9";
                const baseStroke = isRoot ? "#6366f1" : n.isEnd ? "#16a34a" : "#94a3b8";
                const fill = on ? (notFound ? "#fee2e2" : "#ede9fe") : baseFill;
                const stroke = on ? (notFound ? "#dc2626" : "#7c3aed") : baseStroke;
                return (
                    <g key={n.id} opacity={dimUnhighlighted && !on ? 0.4 : 1}>
                        <circle cx={cx(n)} cy={cy(n)} r={16} fill={fill} stroke={stroke} strokeWidth={on ? 2.5 : 1.8} />
                        <text x={cx(n)} y={cy(n) + 5} textAnchor="middle" fontSize="14" fontWeight="700"
                            fontFamily="monospace" fill={isRoot ? "#3730a3" : n.isEnd ? "#166534" : "#475569"}>
                            {isRoot ? "•" : n.char}
                        </text>
                        {n.isEnd && !isRoot && (
                            <circle cx={cx(n) + 13} cy={cy(n) - 13} r={4} fill="#16a34a" stroke="white" strokeWidth="1" />
                        )}
                    </g>
                );
            })}
        </svg>
    );
}

function TrieVisualizer({ words = [], title, caption }) {
    const root = useMemo(() => buildTrie(words), [words.join(",")]);
    return (
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 16, margin: "16px 0", background: "#fafafa", overflowX: "auto" }}>
            {title && <div style={{ fontWeight: 600, fontSize: 14, color: "#374151", marginBottom: 10 }}>{title}</div>}
            <TrieSVG root={root} />
            <div style={{ fontSize: 11, fontFamily: "monospace", color: "#6b7280", marginTop: 8, textAlign: "center" }}>
                <span style={{ color: "#6366f1" }}>●</span> root &nbsp;
                <span style={{ color: "#16a34a" }}>●</span> end-of-word &nbsp;
                <span style={{ color: "#94a3b8" }}>●</span> internal
            </div>
            {caption && <div style={{ fontSize: 12, color: "#6b7280", marginTop: 8, textAlign: "center", lineHeight: 1.5 }}>{caption}</div>}
        </div>
    );
}

/* path of node-ids matched walking `q` from root; returns {ids, matchedLen, endHit} */
function walkPath(root, q) {
    const ids = [root.id];
    let cur = root;
    let matched = 0;
    for (const ch of q) {
        if (cur.children[ch]) {
            cur = cur.children[ch];
            ids.push(cur.id);
            matched++;
        } else break;
    }
    return { ids, matched, full: matched === q.length, endHit: cur.isEnd && matched === q.length };
}

function InteractiveTrie({ initialWords = ["cat", "car", "card", "dog", "do"] }) {
    const [words, setWords] = useState(initialWords);
    const [input, setInput] = useState("");
    const [path, setPath] = useState([]);
    const [msg, setMsg] = useState(null);   // {text, kind}
    const [notFound, setNotFound] = useState(false);
    const [dim, setDim] = useState(false);

    const root = useMemo(() => buildTrie(words), [words.join(",")]);

    const clean = (s) => s.toLowerCase().replace(/[^a-z]/g, "");

    const doInsert = () => {
        const w = clean(input);
        if (!w) return;
        if (!words.includes(w)) setWords([...words, w]);
        setInput("");
        setPath([]); setDim(false); setNotFound(false);
        setMsg({ text: `Inserted "${w}" — walked ${w.length} nodes, O(L).`, kind: "ok" });
    };
    const doSearch = () => {
        const w = clean(input);
        if (!w) return;
        const r = walkPath(root, w);
        setPath(r.ids); setDim(true);
        if (r.endHit) {
            setNotFound(false);
            setMsg({ text: `search("${w}") → true — full path exists AND ends on an end-of-word node.`, kind: "ok" });
        } else if (r.full) {
            setNotFound(true);
            setMsg({ text: `search("${w}") → false — the path exists but the last node isn't marked end-of-word (it's only a prefix).`, kind: "warn" });
        } else {
            setNotFound(true);
            setMsg({ text: `search("${w}") → false — fell off the trie after "${w.slice(0, r.matched)}".`, kind: "warn" });
        }
    };
    const doPrefix = () => {
        const w = clean(input);
        if (!w) return;
        const r = walkPath(root, w);
        setPath(r.ids); setDim(true);
        if (r.full) {
            setNotFound(false);
            setMsg({ text: `startsWith("${w}") → true — full path exists (end-of-word not required).`, kind: "ok" });
        } else {
            setNotFound(true);
            setMsg({ text: `startsWith("${w}") → false — no node for "${w[r.matched]}" after "${w.slice(0, r.matched)}".`, kind: "warn" });
        }
    };
    const reset = () => { setWords(initialWords); setPath([]); setMsg(null); setDim(false); setNotFound(false); setInput(""); };

    const btn = { padding: "6px 12px", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 13, color: "white" };

    return (
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 16, margin: "16px 0", background: "#fafafa", overflowX: "auto" }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#374151", marginBottom: 4 }}>
                Try it — insert words, then search or check a prefix
            </div>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 12 }}>
                Words in the trie: <span style={{ fontFamily: "monospace", color: "#4338ca" }}>{words.join(", ") || "(empty)"}</span>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12, alignItems: "center" }}>
                <input value={input} onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && doSearch()}
                    placeholder="type a word…" maxLength={12}
                    style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: 6, fontFamily: "monospace", fontSize: 13, width: 130 }} />
                <button style={{ ...btn, background: "#6366f1" }} onClick={doInsert}>Insert</button>
                <button style={{ ...btn, background: "#16a34a" }} onClick={doSearch}>Search</button>
                <button style={{ ...btn, background: "#0891b2" }} onClick={doPrefix}>startsWith</button>
                <button style={{ ...btn, background: "#6b7280" }} onClick={reset}>Reset</button>
            </div>
            <TrieSVG root={root} highlightPath={path} notFound={notFound} dimUnhighlighted={dim} />
            {msg && (
                <div style={{
                    marginTop: 10, padding: "8px 12px", borderRadius: 6, fontSize: 12.5, fontFamily: "monospace",
                    background: msg.kind === "ok" ? "#dcfce7" : "#fef3c7",
                    color: msg.kind === "ok" ? "#166534" : "#92400e",
                }}>
                    {msg.text}
                </div>
            )}
        </div>
    );
}

export { TrieVisualizer, InteractiveTrie };
