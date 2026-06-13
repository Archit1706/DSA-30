import React, { useState, useEffect, useRef, useMemo } from "react";

/* ════════════════════════════════════════════════════════════════════
   Mock-interview toolkit (Day 29)
   - InterviewLoopTimeline : the full hiring loop, click a stage for detail
   - CodingPhaseStepper    : walk the 45-min coding round phase by phase,
                             with time budget + "what the interviewer scores"
   - MockTimer             : a real start/pause countdown for self-practice
   - CompanyMatrix         : what each big-tech company emphasizes (tabs)
   - StarBuilder           : assemble + self-grade a STAR behavioral answer
   - RubricMeter           : the four signals interviewers actually score
   Self-contained light-theme cards, matching the rest of /components.
   ════════════════════════════════════════════════════════════════════ */

const card = { border: "1px solid #e5e7eb", borderRadius: 10, padding: 16, margin: "16px 0", background: "#fafafa" };
const btn = { padding: "6px 14px", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 13, color: "white" };

/* ── 1. Interview loop timeline ────────────────────────────────────── */
const LOOP = [
    { key: "recruiter", label: "Recruiter Screen", dur: "30 min", color: "#0891b2",
      detail: "A non-technical chat. Confirms your background, the role, timeline, and comp range. Be warm, concise, and have 2–3 questions ready. This is a filter, not a test — but flakiness here ends the process." },
    { key: "phone", label: "Technical Phone Screen", dur: "45–60 min", color: "#2563eb",
      detail: "1–2 coding problems in a shared editor (no autocomplete, no run button on some). Usually one medium. Pass bar: working code + clear communication. This is where most candidates are cut." },
    { key: "onsite", label: "Onsite / Virtual Onsite", dur: "4–6 rounds", color: "#7c3aed",
      detail: "The main event: typically 2 coding rounds, 1 system design (senior+), 1–2 behavioral, sometimes a domain round. Each ~45 min with a different interviewer who hasn't seen your earlier rounds." },
    { key: "debrief", label: "Hiring Committee / Debrief", dur: "async", color: "#ca8a04",
      detail: "Interviewers submit written feedback and a Strong-Hire → Strong-No-Hire vote. A committee (at Google) or hiring manager reconciles them. One 'No Hire' on a key signal can sink an otherwise strong loop." },
    { key: "offer", label: "Offer & Negotiation", dur: "days", color: "#16a34a",
      detail: "Recruiter calls with comp. Almost always negotiable — competing offers and a calm, specific ask move the number. Never accept on the spot; ask for the breakdown in writing." },
];

function InterviewLoopTimeline() {
    const [sel, setSel] = useState("phone");
    const cur = LOOP.find((s) => s.key === sel);
    return (
        <div style={card}>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#374151", marginBottom: 12 }}>
                The hiring loop — tap a stage
            </div>
            <div style={{ display: "flex", alignItems: "stretch", gap: 0, flexWrap: "wrap" }}>
                {LOOP.map((s, i) => (
                    <React.Fragment key={s.key}>
                        <button onClick={() => setSel(s.key)}
                            style={{
                                flex: "1 1 120px", minWidth: 110, cursor: "pointer", border: "none",
                                borderRadius: 8, padding: "10px 8px", textAlign: "center",
                                background: sel === s.key ? s.color : "#eef2f6",
                                color: sel === s.key ? "white" : "#475569",
                                transition: "all .15s",
                            }}>
                            <div style={{ fontSize: 12.5, fontWeight: 700, lineHeight: 1.2 }}>{s.label}</div>
                            <div style={{ fontSize: 10.5, opacity: 0.85, marginTop: 3, fontFamily: "monospace" }}>{s.dur}</div>
                        </button>
                        {i < LOOP.length - 1 && (
                            <div style={{ display: "flex", alignItems: "center", padding: "0 2px", color: "#cbd5e1", fontWeight: 700 }}>→</div>
                        )}
                    </React.Fragment>
                ))}
            </div>
            <div style={{ marginTop: 12, padding: "12px 14px", borderRadius: 8, background: "white",
                border: `1px solid ${cur.color}33`, borderLeft: `4px solid ${cur.color}` }}>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: cur.color, marginBottom: 4 }}>{cur.label} · {cur.dur}</div>
                <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.55 }}>{cur.detail}</div>
            </div>
        </div>
    );
}

/* ── 2. Coding-round phase stepper ─────────────────────────────────── */
const PHASES = [
    { name: "Clarify", min: 4, color: "#0891b2",
      do: "Restate the problem. Ask about input size, types, ranges, duplicates, empty/null, sorted-ness, and what to return on no answer.",
      say: "\"Before I code — can the array be empty? Are values unique? How large can n get? Should I return -1 or throw if there's no answer?\"",
      signal: "Do you scope before solving, or charge in and build the wrong thing?",
      trap: "Jumping straight to code. The #1 way to lose the round in the first 60 seconds." },
    { name: "Examples", min: 4, color: "#2563eb",
      do: "Walk one concrete example by hand. Then invent edge cases: empty, single element, all-equal, negatives, overflow, already-sorted.",
      say: "\"Let me trace [3,1,2] → … and also think about [] and a single-element input.\"",
      signal: "Do you find edge cases yourself, or wait to be told?",
      trap: "Only considering the happy-path example the interviewer gave you." },
    { name: "Approach", min: 8, color: "#7c3aed",
      do: "State the brute force and its complexity FIRST. Then optimize out loud, naming the pattern (two pointers, hashing, DP…). Get a yes before coding.",
      say: "\"Brute force is O(n²) — check every pair. I can do better with a hash map for O(n). Shall I code the optimized version?\"",
      signal: "Can you reason from naive → optimal, and justify the data structure?",
      trap: "Silently thinking. If you go quiet for two minutes, the interviewer can't score you." },
    { name: "Code", min: 18, color: "#16a34a",
      do: "Narrate as you type. Use clear names. Write the helper you wish existed and fill it in after. Keep talking through the tricky lines.",
      say: "\"I'll keep a hashmap of value→index, scan once, and for each x check if target−x is seen.\"",
      signal: "Is your code clean, correct, and readable? Do you handle the edges you named?",
      trap: "Going silent while coding, or writing dense one-liners no one can follow." },
    { name: "Test", min: 7, color: "#ca8a04",
      do: "Trace your code on the normal example AND the edge cases from earlier, line by line. Fix bugs you find — finding your own bug is a positive signal.",
      say: "\"Let me dry-run [] → returns []. Single element → … . Now the main case step by step.\"",
      signal: "Do you verify, or assume it works? Do you catch your own bugs calmly?",
      trap: "Declaring 'done' without running through a single test." },
    { name: "Complexity", min: 4, color: "#dc2626",
      do: "State time AND space with one-line justification. Mention the trade-off and any follow-up optimization you'd consider.",
      say: "\"O(n) time — one pass; O(n) space for the hashmap. I traded space for speed vs the O(1)-space, O(n²) brute force.\"",
      signal: "Do you know exactly why your solution costs what it costs?",
      trap: "Hand-waving ('it's pretty fast') or getting your own Big-O wrong." },
];

function CodingPhaseStepper() {
    const [i, setI] = useState(0);
    const p = PHASES[i];
    const total = PHASES.reduce((s, x) => s + x.min, 0);
    const elapsed = PHASES.slice(0, i).reduce((s, x) => s + x.min, 0);
    return (
        <div style={card}>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#374151", marginBottom: 4 }}>
                The 45-minute coding round, phase by phase
            </div>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 12 }}>
                A budget, not a script — but spend roughly this long on each. Total ≈ {total} min.
            </div>
            {/* budget bar */}
            <div style={{ display: "flex", height: 30, borderRadius: 6, overflow: "hidden", marginBottom: 4 }}>
                {PHASES.map((x, k) => (
                    <button key={k} onClick={() => setI(k)}
                        title={`${x.name} (~${x.min} min)`}
                        style={{
                            flex: x.min, border: "none", cursor: "pointer",
                            background: k === i ? x.color : `${x.color}55`,
                            color: "white", fontSize: 11, fontWeight: 700,
                            borderRight: k < PHASES.length - 1 ? "1px solid #fafafa" : "none",
                        }}>
                        {k === i ? x.name : x.min}
                    </button>
                ))}
            </div>
            <div style={{ fontSize: 10.5, fontFamily: "monospace", color: "#94a3b8", marginBottom: 12 }}>
                ~{elapsed}–{elapsed + p.min} min in
            </div>

            <div style={{ background: "white", borderRadius: 8, border: `1px solid ${p.color}33`, padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <span style={{ background: p.color, color: "white", borderRadius: 6, padding: "3px 10px", fontWeight: 700, fontSize: 13 }}>
                        {i + 1}. {p.name}
                    </span>
                    <span style={{ fontSize: 12, color: "#94a3b8", fontFamily: "monospace" }}>~{p.min} min</span>
                </div>
                <Row label="Do" color="#16a34a" text={p.do} />
                <Row label="Say" color="#2563eb" text={<em>{p.say}</em>} />
                <Row label="Interviewer is scoring" color="#7c3aed" text={p.signal} />
                <Row label="Common trap" color="#dc2626" text={p.trap} />
            </div>

            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 12 }}>
                <button style={{ ...btn, background: "#6b7280", opacity: i === 0 ? 0.5 : 1 }}
                    onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0}>← Prev</button>
                <button style={{ ...btn, background: "#4f46e5", opacity: i === PHASES.length - 1 ? 0.5 : 1 }}
                    onClick={() => setI(Math.min(PHASES.length - 1, i + 1))} disabled={i === PHASES.length - 1}>Next phase →</button>
            </div>
        </div>
    );
}
function Row({ label, color, text }) {
    return (
        <div style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "baseline" }}>
            <span style={{ fontSize: 10.5, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.04em", minWidth: 130, flexShrink: 0 }}>{label}</span>
            <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{text}</span>
        </div>
    );
}

/* ── 3. Mock timer (real countdown for self-practice) ──────────────── */
function MockTimer({ minutes = 45 }) {
    const [left, setLeft] = useState(minutes * 60);
    const [running, setRunning] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        if (running) {
            ref.current = setInterval(() => setLeft((s) => (s <= 1 ? (clearInterval(ref.current), 0) : s - 1)), 1000);
        }
        return () => clearInterval(ref.current);
    }, [running]);
    const mm = String(Math.floor(left / 60)).padStart(2, "0");
    const ss = String(left % 60).padStart(2, "0");
    const frac = left / (minutes * 60);
    const colr = frac > 0.33 ? "#16a34a" : frac > 0.12 ? "#ca8a04" : "#dc2626";
    const reset = () => { setRunning(false); setLeft(minutes * 60); };
    return (
        <div style={{ ...card, textAlign: "center" }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#374151", marginBottom: 8 }}>
                Self-practice timer — solve a problem in {minutes} minutes, out loud, no IDE
            </div>
            <div style={{ fontSize: 52, fontWeight: 800, fontFamily: "monospace", color: colr, lineHeight: 1.1, letterSpacing: "0.02em" }}>
                {mm}:{ss}
            </div>
            <div style={{ height: 6, background: "#e5e7eb", borderRadius: 3, overflow: "hidden", margin: "10px auto", maxWidth: 320 }}>
                <div style={{ width: `${frac * 100}%`, height: "100%", background: colr, transition: "width 1s linear" }} />
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8 }}>
                <button style={{ ...btn, background: running ? "#ca8a04" : "#16a34a" }} onClick={() => setRunning(!running)}>
                    {running ? "Pause" : left === minutes * 60 ? "Start" : "Resume"}
                </button>
                <button style={{ ...btn, background: "#6b7280" }} onClick={reset}>Reset</button>
            </div>
            <div style={{ fontSize: 11.5, color: "#6b7280", marginTop: 10 }}>
                Real rounds are ~45 min. If you can't get a working solution + complexity in that window, the problem isn't the bottleneck — the process is.
            </div>
        </div>
    );
}

/* ── 4. Company emphasis matrix ────────────────────────────────────── */
const COMPANIES = {
    Google:   { color: "#4285F4", bars: { Coding: 5, "Algorithms / DSA": 5, "System Design": 4, Behavioral: 3 },
        note: "Famous for hard algorithmic DSA and 'Googleyness'. Hiring committees, not the interviewer, decide. Code on a doc — clarity and edge cases matter as much as the optimal Big-O." },
    Meta:     { color: "#0866FF", bars: { Coding: 5, "Algorithms / DSA": 4, "System Design": 4, Behavioral: 4 },
        note: "Speed matters: expect to solve 2 mediums in ~35 min in the coding screen. 'Move fast.' The behavioral round maps to core values; system design is heavy for E5+." },
    Amazon:   { color: "#FF9900", bars: { Coding: 4, "Algorithms / DSA": 3, "System Design": 4, Behavioral: 5 },
        note: "Behavioral is king: every round probes the 16 Leadership Principles. Bring STAR stories tagged to LPs (Ownership, Dive Deep, Bias for Action). 'Bar Raiser' interviewer has veto power." },
    Apple:    { color: "#A2AAAD", bars: { Coding: 4, "Algorithms / DSA": 3, "System Design": 4, Behavioral: 4 },
        note: "Team-dependent and domain-specific — interviews vary widely by org. Deep dives into your past projects and practical, role-relevant problems over abstract puzzles." },
    Netflix:  { color: "#E50914", bars: { Coding: 3, "Algorithms / DSA": 3, "System Design": 5, Behavioral: 5 },
        note: "Senior-only culture. Less LeetCode-puzzle, more 'can you operate independently at a high level?' Culture-fit ('keeper test', context-not-control) and real system design dominate." },
    Microsoft:{ color: "#7FBA00", bars: { Coding: 4, "Algorithms / DSA": 4, "System Design": 4, Behavioral: 4 },
        note: "Balanced and humane. Practical DSA, design, and 'how do you think' collaboration. The 'as-appropriate' (AA) interviewer near the end has extra weight on the final call." },
};
function CompanyMatrix() {
    const names = Object.keys(COMPANIES);
    const [sel, setSel] = useState("Google");
    const c = COMPANIES[sel];
    const dims = Object.keys(c.bars);
    return (
        <div style={card}>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#374151", marginBottom: 4 }}>
                What each company leans on — pick one
            </div>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 12 }}>
                The loop is similar everywhere; the <em>weighting</em> differs. Prep to the emphasis.
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                {names.map((n) => (
                    <button key={n} onClick={() => setSel(n)}
                        style={{ ...btn, background: sel === n ? COMPANIES[n].color : "#e5e7eb", color: sel === n ? "white" : "#374151" }}>
                        {n}
                    </button>
                ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 12 }}>
                {dims.map((d) => (
                    <div key={d} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 12.5, color: "#374151", width: 130, flexShrink: 0, textAlign: "right" }}>{d}</span>
                        <div style={{ flex: 1, display: "flex", gap: 4 }}>
                            {[1,2,3,4,5].map((k) => (
                                <div key={k} style={{ flex: 1, height: 14, borderRadius: 3,
                                    background: k <= c.bars[d] ? c.color : "#e5e7eb" }} />
                            ))}
                        </div>
                        <span style={{ fontSize: 11, fontFamily: "monospace", color: c.color, fontWeight: 700, width: 28 }}>{c.bars[d]}/5</span>
                    </div>
                ))}
            </div>
            <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.55, padding: "10px 12px", background: "white",
                borderRadius: 8, borderLeft: `4px solid ${c.color}` }}>
                {c.note}
            </div>
        </div>
    );
}

/* ── 5. STAR behavioral builder ────────────────────────────────────── */
const STAR = [
    { key: "S", label: "Situation", hint: "Set the scene in 1–2 sentences. What was the context and the stakes?", target: 200 },
    { key: "T", label: "Task", hint: "What was YOUR specific responsibility or goal? (not the team's)", target: 150 },
    { key: "A", label: "Action", hint: "What did YOU do, step by step? This is 60% of a good answer. Use 'I', not 'we'.", target: 400 },
    { key: "R", label: "Result", hint: "The outcome — quantified if possible. What did you learn?", target: 200 },
];
function StarBuilder() {
    const [vals, setVals] = useState({ S: "", T: "", A: "", R: "" });
    const set = (k, v) => setVals({ ...vals, [k]: v });
    const filled = STAR.filter((s) => vals[s.key].trim().length > 15).length;
    const actionLen = vals.A.trim().length;
    const totalLen = Object.values(vals).join(" ").trim().length;
    const checks = [
        { ok: filled === 4, text: "All four parts present (S, T, A, R)" },
        { ok: actionLen >= Math.max(totalLen * 0.4, 1) && actionLen > 0, text: "Action is the largest section (it's what's scored)" },
        { ok: /\bI\b/.test(vals.A), text: "Action uses 'I' (your contribution), not only 'we'" },
        { ok: /\d/.test(vals.R), text: "Result is quantified (a number, %, or concrete metric)" },
    ];
    return (
        <div style={card}>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#374151", marginBottom: 4 }}>
                STAR builder — draft a behavioral answer, get it graded
            </div>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 12 }}>
                Prompt: <em>"Tell me about a time you disagreed with a teammate and how you resolved it."</em>
            </div>
            {STAR.map((s) => (
                <div key={s.key} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                        <span style={{ fontSize: 12.5, fontWeight: 700, color: "#4338ca" }}>
                            <span style={{ background: "#4338ca", color: "white", borderRadius: 4, padding: "1px 6px", marginRight: 6 }}>{s.key}</span>
                            {s.label}
                        </span>
                        <span style={{ fontSize: 10.5, color: vals[s.key].length > s.target * 1.6 ? "#dc2626" : "#94a3b8", fontFamily: "monospace" }}>
                            {vals[s.key].length} chars
                        </span>
                    </div>
                    <textarea value={vals[s.key]} onChange={(e) => set(s.key, e.target.value)} placeholder={s.hint} rows={s.key === "A" ? 3 : 2}
                        style={{ width: "100%", boxSizing: "border-box", padding: "7px 10px", border: "1px solid #cbd5e1",
                            borderRadius: 6, fontSize: 13, fontFamily: "inherit", resize: "vertical" }} />
                </div>
            ))}
            <div style={{ marginTop: 6, padding: "10px 12px", background: "white", borderRadius: 8, border: "1px solid #e5e7eb" }}>
                {checks.map((c, k) => (
                    <div key={k} style={{ fontSize: 12.5, color: c.ok ? "#166534" : "#94a3b8", marginBottom: 3 }}>
                        {c.ok ? "✓" : "○"} {c.text}
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ── 6. Rubric meter ───────────────────────────────────────────────── */
const RUBRIC = [
    { dim: "Problem Solving", color: "#7c3aed",
      good: "Breaks the problem down, moves brute-force → optimal, justifies the approach.",
      bad: "Pattern-matches blindly or freezes; can't explain why an approach works." },
    { dim: "Coding", color: "#16a34a",
      good: "Clean, correct, readable code; sensible names; handles the edge cases.",
      bad: "Buggy, cluttered, or never compiles in their head; ignores edges." },
    { dim: "Communication", color: "#2563eb",
      good: "Thinks out loud, takes hints gracefully, collaborates like a coworker.",
      bad: "Long silences, defensive about feedback, or explains nothing." },
    { dim: "Verification", color: "#ca8a04",
      good: "Tests with real + edge inputs, finds and fixes own bugs, states complexity.",
      bad: "Declares 'done' untested; surprised when a case breaks." },
];
function RubricMeter() {
    const [open, setOpen] = useState(0);
    return (
        <div style={card}>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#374151", marginBottom: 4 }}>
                The four signals every coding interviewer scores
            </div>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 12 }}>
                You're not graded on "did you get the answer." You're graded on these four — tap to expand.
            </div>
            {RUBRIC.map((r, k) => (
                <div key={k} onClick={() => setOpen(open === k ? -1 : k)}
                    style={{ cursor: "pointer", marginBottom: 8, padding: "10px 12px", borderRadius: 8, background: "white",
                        borderLeft: `4px solid ${r.color}`, border: "1px solid #e5e7eb" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: 700, fontSize: 13.5, color: r.color }}>{r.dim}</span>
                        <span style={{ color: "#94a3b8", fontSize: 12 }}>{open === k ? "−" : "+"}</span>
                    </div>
                    {open === k && (
                        <div style={{ marginTop: 8 }}>
                            <div style={{ fontSize: 12.5, color: "#166534", marginBottom: 4 }}>
                                <strong>Strong signal:</strong> {r.good}
                            </div>
                            <div style={{ fontSize: 12.5, color: "#b91c1c" }}>
                                <strong>Weak signal:</strong> {r.bad}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export {
    InterviewLoopTimeline,
    CodingPhaseStepper,
    MockTimer,
    CompanyMatrix,
    StarBuilder,
    RubricMeter,
};
