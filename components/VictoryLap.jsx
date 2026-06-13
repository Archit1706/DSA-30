import React, { useState, useRef } from "react";

/* ════════════════════════════════════════════════════════════════════
   Victory Lap toolkit (Day 30)
   - ThirtyDayMap  : the whole journey, grouped by phase, each day clickable
   - PatternPicker : the "if you see X, reach for Y" interview decision guide
   - FinishLine    : a celebratory confetti button — you earned it
   Self-contained light-theme cards, matching the rest of /components.
   ════════════════════════════════════════════════════════════════════ */

const card = { border: "1px solid #e5e7eb", borderRadius: 10, padding: 16, margin: "16px 0", background: "#fafafa" };

/* ── 1. The 30-day map ─────────────────────────────────────────────── */
const PHASES = [
    { name: "Fundamentals", color: "#3b82f6", days: [
        [1, "Big-O & DSA", "reason about cost before you optimize"],
        [2, "Arrays & Strings", "the substrate everything else sits on"],
        [3, "Linked Lists", "pointers, dummy heads, cycle tricks"],
        [4, "Stacks & Queues", "LIFO/FIFO and monotonic stacks"],
        [5, "Recursion", "trust the recursive leap"],
    ]},
    { name: "Trees & Hashing", color: "#8b5cf6", days: [
        [6, "Binary Trees & BST", "traversals and ordered structure"],
        [7, "Heaps", "top-k and streaming medians"],
        [8, "Hash Tables", "O(1) lookup, the universal speedup"],
    ]},
    { name: "Graphs", color: "#10b981", days: [
        [9, "Graphs", "model the world as nodes + edges"],
        [10, "DFS & BFS", "the two ways to explore everything"],
    ]},
    { name: "Sorting & Searching", color: "#f59e0b", days: [
        [11, "Sorting I", "the O(n²) family and why they matter"],
        [12, "Sorting II", "merge, quick, heap — O(n log n)"],
        [13, "Searching", "binary search & the answer-space trick"],
    ]},
    { name: "Patterns", color: "#ef4444", days: [
        [14, "Dynamic Programming", "remember subproblems, stop recomputing"],
        [15, "Greedy", "locally optimal → globally optimal (when it works)"],
        [16, "Backtracking", "build, test, undo — explore all options"],
        [17, "Bit Manipulation", "think in bits, win in constants"],
    ]},
    { name: "Specialized Structures", color: "#ec4899", days: [
        [18, "Tries", "prefixes as first-class citizens"],
        [19, "Segment Trees", "range queries on a changing array"],
        [20, "Union Find", "dynamic connectivity, near-O(1)"],
        [21, "Shortest Paths", "Dijkstra, Bellman-Ford, Floyd-Warshall"],
        [22, "MST", "cheapest spanning network"],
        [23, "Topological Sort", "order things with dependencies"],
    ]},
    { name: "Interview Techniques", color: "#06b6d4", days: [
        [24, "Sliding Window", "subarray problems in one pass"],
        [25, "Two Pointers", "converge from both ends"],
        [26, "Divide & Conquer", "split, solve, combine"],
        [27, "Advanced Strings", "KMP, Z, Rabin-Karp"],
    ]},
    { name: "Synthesis", color: "#6366f1", days: [
        [28, "System Design 101", "assemble systems, defend trade-offs"],
        [29, "Mock Interview", "perform under the clock"],
        [30, "Victory Lap", "you are here"],
    ]},
];

function ThirtyDayMap() {
    const [hover, setHover] = useState(null);
    return (
        <div style={card}>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#374151", marginBottom: 4 }}>
                The whole map — 30 days, 8 phases. Hover a day.
            </div>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 14, minHeight: 18 }}>
                {hover ? <span><strong>Day {hover[0]} — {hover[1]}:</strong> {hover[2]}</span>
                       : "Every tile links to its chapter. This is everything you now know, in one picture."}
            </div>
            {PHASES.map((p) => (
                <div key={p.name} style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: p.color, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                        {p.name}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {p.days.map(([d, t, why]) => (
                            <a key={d} href={`/day${d}`}
                                onMouseEnter={() => setHover([d, t, why])}
                                onMouseLeave={() => setHover(null)}
                                style={{
                                    textDecoration: "none", display: "flex", flexDirection: "column",
                                    minWidth: 96, flex: "1 1 96px", maxWidth: 150, padding: "8px 10px", borderRadius: 8,
                                    background: "white", border: `1px solid ${p.color}44`, borderLeft: `4px solid ${p.color}`,
                                    transition: "transform .12s, box-shadow .12s", cursor: "pointer",
                                }}
                                onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.97)"}
                                onMouseUp={(e) => e.currentTarget.style.transform = ""}>
                                <span style={{ fontSize: 10, fontFamily: "monospace", fontWeight: 700, color: p.color }}>DAY {String(d).padStart(2, "0")}</span>
                                <span style={{ fontSize: 12, fontWeight: 600, color: "#374151", lineHeight: 1.2 }}>{t}</span>
                            </a>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ── 2. Pattern picker — "if you see X, reach for Y" ───────────────── */
const PATTERNS = [
    { clue: "Sorted array, find a pair / target", tech: "Two Pointers or Binary Search", day: 25, dayLabel: "Day 25 / 13" },
    { clue: "Subarray / substring with a constraint", tech: "Sliding Window", day: 24, dayLabel: "Day 24" },
    { clue: "\"All permutations / combinations / subsets\"", tech: "Backtracking", day: 16, dayLabel: "Day 16" },
    { clue: "\"Max / min / count ways\" + overlapping subproblems", tech: "Dynamic Programming", day: 14, dayLabel: "Day 14" },
    { clue: "Top-k / k-th largest / streaming median", tech: "Heap", day: 7, dayLabel: "Day 7" },
    { clue: "\"Have I seen this before?\" / dedupe / frequency", tech: "Hash Map / Set", day: 8, dayLabel: "Day 8" },
    { clue: "Shortest path in an unweighted graph", tech: "BFS", day: 10, dayLabel: "Day 10" },
    { clue: "Shortest path with weights", tech: "Dijkstra (Bellman-Ford if negatives)", day: 21, dayLabel: "Day 21" },
    { clue: "Connected components / \"are these joined?\"", tech: "Union-Find or DFS/BFS", day: 20, dayLabel: "Day 20 / 10" },
    { clue: "Ordering with dependencies / prerequisites", tech: "Topological Sort", day: 23, dayLabel: "Day 23" },
    { clue: "Prefix queries / autocomplete / word set", tech: "Trie", day: 18, dayLabel: "Day 18" },
    { clue: "Range sum/min/max on a mutable array", tech: "Segment Tree / Fenwick (BIT)", day: 19, dayLabel: "Day 19" },
    { clue: "\"Next greater / smaller element\"", tech: "Monotonic Stack", day: 4, dayLabel: "Day 4" },
    { clue: "Matching parentheses / undo / DFS by hand", tech: "Stack", day: 4, dayLabel: "Day 4" },
    { clue: "\"Maximize XOR\" / bit-level constraints", tech: "Bitwise Trie / Bit tricks", day: 17, dayLabel: "Day 17 / 18" },
    { clue: "Search the ANSWER, not the array (\"min capacity such that…\")", tech: "Binary Search on the Answer", day: 13, dayLabel: "Day 13" },
    { clue: "Linked list cycle / find middle", tech: "Fast & Slow Pointers", day: 25, dayLabel: "Day 25 / 3" },
    { clue: "Count inversions / \"smaller after self\"", tech: "Merge Sort or BIT", day: 26, dayLabel: "Day 26 / 19" },
    { clue: "Greedy feels right (intervals, scheduling)", tech: "Greedy (prove it!) ", day: 15, dayLabel: "Day 15" },
    { clue: "\"Design a system that scales to millions\"", tech: "System Design framework", day: 28, dayLabel: "Day 28" },
];

function PatternPicker() {
    const [q, setQ] = useState("");
    const [openIdx, setOpenIdx] = useState(-1);
    const filtered = PATTERNS.filter((p) =>
        (p.clue + " " + p.tech).toLowerCase().includes(q.toLowerCase()));
    return (
        <div style={card}>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#374151", marginBottom: 4 }}>
                The decision guide — "if you see this, reach for that"
            </div>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 12 }}>
                Filter by a keyword from the problem, or skim them all. Tap a row to reveal the technique.
            </div>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. 'sorted', 'prefix', 'shortest', 'subarray'…"
                style={{ width: "100%", boxSizing: "border-box", padding: "8px 12px", border: "1px solid #cbd5e1",
                    borderRadius: 8, fontSize: 13, marginBottom: 12 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {filtered.length === 0 && (
                    <div style={{ fontSize: 13, color: "#94a3b8", textAlign: "center", padding: 12 }}>No clue matches "{q}" — try another keyword.</div>
                )}
                {filtered.map((p, i) => {
                    const open = openIdx === i;
                    return (
                        <div key={p.clue} onClick={() => setOpenIdx(open ? -1 : i)}
                            style={{ cursor: "pointer", padding: "10px 12px", borderRadius: 8, background: "white", border: "1px solid #e5e7eb" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                                <span style={{ fontSize: 13, color: "#374151", fontWeight: open ? 700 : 500 }}>
                                    <span style={{ color: "#9ca3af" }}>If you see…</span> {p.clue}
                                </span>
                                <span style={{ color: "#9ca3af", fontSize: 14, flexShrink: 0 }}>{open ? "−" : "+"}</span>
                            </div>
                            {open && (
                                <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                    <span style={{ fontSize: 11, color: "#9ca3af" }}>→ reach for</span>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: "#4338ca" }}>{p.tech}</span>
                                    <a href={`/day${p.day}`} style={{ fontSize: 11, fontFamily: "monospace", color: "#6366f1",
                                        background: "#eef2ff", padding: "2px 8px", borderRadius: 10, textDecoration: "none" }}>
                                        {p.dayLabel} →
                                    </a>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ── 3. Finish line — confetti celebration ─────────────────────────── */
function FinishLine() {
    const [done, setDone] = useState(false);
    const ref = useRef(null);

    const burst = () => {
        setDone(true);
        const host = ref.current;
        if (!host) return;
        const colors = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#06b6d4"];
        for (let i = 0; i < 80; i++) {
            const piece = document.createElement("div");
            const size = 6 + (i % 4) * 2;
            piece.style.cssText = `position:absolute;top:50%;left:50%;width:${size}px;height:${size}px;
                background:${colors[i % colors.length]};border-radius:${i % 2 ? "50%" : "2px"};
                pointer-events:none;opacity:1;z-index:5;`;
            host.appendChild(piece);
            const angle = (Math.PI * 2 * i) / 80 + (i % 5) * 0.1;
            const dist = 90 + (i % 7) * 26;
            const dx = Math.cos(angle) * dist;
            const dy = Math.sin(angle) * dist - 40;
            piece.animate(
                [
                    { transform: "translate(-50%,-50%) rotate(0deg)", opacity: 1 },
                    { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy + 160}px)) rotate(${360 + i * 12}deg)`, opacity: 0 },
                ],
                { duration: 1100 + (i % 6) * 160, easing: "cubic-bezier(.2,.6,.3,1)" }
            ).onfinish = () => piece.remove();
        }
    };

    return (
        <div ref={ref} style={{ ...card, position: "relative", overflow: "hidden", textAlign: "center", padding: "28px 16px" }}>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Thirty days. Done.</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#4338ca", marginBottom: 14, lineHeight: 1.25 }}>
                {done ? "Now go get the offer. 🎯" : "Ready to ring the bell?"}
            </div>
            <button onClick={burst}
                style={{ padding: "12px 28px", border: "none", borderRadius: 999, cursor: "pointer", fontWeight: 700, fontSize: 15,
                    color: "white", background: "linear-gradient(90deg,#6366f1,#8b5cf6,#ec4899)",
                    boxShadow: "0 6px 20px rgba(99,102,241,.4)" }}>
                {done ? "🎉 Again!" : "I finished all 30 days"}
            </button>
        </div>
    );
}

export { ThirtyDayMap, PatternPicker, FinishLine };
