import React, { useState } from "react";

/* ── Single Node rendered inside the visualizer ── */
function LLNode({ value, isLast, isHighlighted, isNew }) {
    const borderColor = isHighlighted ? "#6366f1" : isNew ? "#059669" : "#4f46e5";
    const bgColor = isHighlighted ? "#eef2ff" : isNew ? "#f0fdf4" : "white";

    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <div
                style={{
                    display: "flex",
                    border: `2px solid ${borderColor}`,
                    borderRadius: 8,
                    overflow: "hidden",
                    fontFamily: "monospace",
                    background: bgColor,
                    transition: "all 0.3s ease",
                    boxShadow: isNew ? "0 0 0 3px #bbf7d0" : "none",
                }}
            >
                {/* Data section */}
                <div
                    style={{
                        padding: "8px 16px",
                        borderRight: `2px solid ${borderColor}`,
                        color: "#1f2937",
                        fontWeight: 700,
                        fontSize: 14,
                        minWidth: 40,
                        textAlign: "center",
                    }}
                >
                    {value}
                </div>
                {/* Next pointer section */}
                <div
                    style={{
                        padding: "8px 10px",
                        color: isLast ? "#9ca3af" : "#6366f1",
                        fontSize: 12,
                        display: "flex",
                        alignItems: "center",
                        fontWeight: 500,
                    }}
                >
                    {isLast ? "NULL" : "→"}
                </div>
            </div>
            {/* Arrow between nodes */}
            {!isLast && (
                <div
                    style={{
                        padding: "0 4px",
                        color: "#6366f1",
                        fontSize: 20,
                        fontWeight: "bold",
                        lineHeight: 1,
                    }}
                >
                    →
                </div>
            )}
        </div>
    );
}

/* ── Static visualizer for embedding in MDX ── */
function LinkedListVisualizer({ initialList = [10, 20, 30, 40, 50], label = "head" }) {
    return (
        <div
            style={{
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                padding: "20px 24px",
                margin: "16px 0",
                background: "#fafafa",
                overflowX: "auto",
            }}
        >
            <div
                style={{
                    fontSize: 11,
                    color: "#6b7280",
                    marginBottom: 14,
                    fontFamily: "monospace",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    fontWeight: 600,
                }}
            >
                Linked List Visualization
            </div>

            <div style={{ display: "flex", alignItems: "center", flexWrap: "nowrap", gap: 0, minWidth: "max-content" }}>
                {/* HEAD label */}
                <div
                    style={{
                        marginRight: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        fontSize: 11,
                        color: "#6366f1",
                        fontFamily: "monospace",
                        fontWeight: 700,
                    }}
                >
                    <span>{label.toUpperCase()}</span>
                    <span style={{ fontSize: 16 }}>↓</span>
                </div>

                {initialList.length === 0 ? (
                    <span style={{ fontFamily: "monospace", color: "#9ca3af", fontSize: 14 }}>NULL</span>
                ) : (
                    initialList.map((val, i) => (
                        <LLNode
                            key={i}
                            value={val}
                            isLast={i === initialList.length - 1}
                            isHighlighted={false}
                            isNew={false}
                        />
                    ))
                )}
            </div>

            <div style={{ marginTop: 12, fontSize: 12, color: "#9ca3af", fontFamily: "monospace" }}>
                {initialList.length} node{initialList.length !== 1 ? "s" : ""} · each node stores data + pointer to next
            </div>
        </div>
    );
}

/* ── Interactive linked list with full operations ── */
function InteractiveLinkedList() {
    const [list, setList] = useState([10, 20, 30, 40]);
    const [inputValue, setInputValue] = useState("");
    const [message, setMessage] = useState({ text: "", type: "success" });
    const [highlightedIdx, setHighlightedIdx] = useState(null);
    const [newIdx, setNewIdx] = useState(null);

    const flash = (msg, type = "success") => {
        setMessage({ text: msg, type });
        setTimeout(() => setMessage({ text: "", type: "success" }), 3000);
    };

    const highlightFor = (idx, ms = 1500) => {
        setHighlightedIdx(idx);
        setTimeout(() => setHighlightedIdx(null), ms);
    };

    const markNew = (idx, ms = 1500) => {
        setNewIdx(idx);
        setTimeout(() => setNewIdx(null), ms);
    };

    const insertFront = () => {
        const val = parseInt(inputValue);
        if (isNaN(val)) { flash("Enter a valid number!", "error"); return; }
        setList(prev => [val, ...prev]);
        markNew(0);
        flash(`✓ Inserted ${val} at the front — O(1) operation`);
        setInputValue("");
    };

    const insertEnd = () => {
        const val = parseInt(inputValue);
        if (isNaN(val)) { flash("Enter a valid number!", "error"); return; }
        setList(prev => {
            markNew(prev.length);
            return [...prev, val];
        });
        flash(`✓ Inserted ${val} at the end — O(n) traversal needed`);
        setInputValue("");
    };

    const deleteFront = () => {
        if (list.length === 0) { flash("List is empty!", "error"); return; }
        const removed = list[0];
        setList(prev => prev.slice(1));
        flash(`✓ Deleted ${removed} from the front — O(1) operation`);
    };

    const deleteEnd = () => {
        if (list.length === 0) { flash("List is empty!", "error"); return; }
        const removed = list[list.length - 1];
        setList(prev => prev.slice(0, -1));
        flash(`✓ Deleted ${removed} from the end — O(n) traversal needed`);
    };

    const search = () => {
        const val = parseInt(inputValue);
        if (isNaN(val)) { flash("Enter a valid number!", "error"); return; }
        const idx = list.indexOf(val);
        if (idx !== -1) {
            highlightFor(idx, 2500);
            flash(`✓ Found ${val} at position ${idx} — O(n) sequential search`);
        } else {
            flash(`✗ ${val} not found — had to scan all ${list.length} nodes`, "error");
        }
        setInputValue("");
    };

    const reset = () => {
        setList([10, 20, 30, 40]);
        setInputValue("");
        setHighlightedIdx(null);
        setNewIdx(null);
        flash("List reset to [10 → 20 → 30 → 40]");
    };

    const btn = (label, onClick, color) => (
        <button
            onClick={onClick}
            style={{
                padding: "8px 14px",
                border: "none",
                borderRadius: 6,
                background: color,
                color: "white",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 500,
                fontFamily: "inherit",
                transition: "opacity 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = 0.85)}
            onMouseLeave={e => (e.currentTarget.style.opacity = 1)}
        >
            {label}
        </button>
    );

    const msgColors = {
        success: { bg: "#f0fdf4", border: "#bbf7d0", text: "#166534" },
        error: { bg: "#fef2f2", border: "#fecaca", text: "#991b1b" },
    };

    return (
        <div
            style={{
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                padding: 20,
                margin: "16px 0",
                background: "#fafafa",
            }}
        >
            {/* Title */}
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1f2937", marginBottom: 4 }}>
                Interactive Linked List
            </div>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 14 }}>
                Try inserting, deleting, and searching — watch the nodes update in real time!
            </div>

            {/* Visualization */}
            <div style={{ overflowX: "auto", paddingBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", minWidth: "max-content", gap: 0 }}>
                    {/* HEAD label */}
                    <span
                        style={{
                            fontSize: 11,
                            color: "#6366f1",
                            fontFamily: "monospace",
                            fontWeight: 700,
                            marginRight: 6,
                        }}
                    >
                        HEAD →
                    </span>

                    {list.length === 0 ? (
                        <span style={{ fontFamily: "monospace", color: "#9ca3af", fontSize: 13 }}>NULL (empty)</span>
                    ) : (
                        list.map((val, i) => (
                            <LLNode
                                key={`${i}-${val}`}
                                value={val}
                                isLast={i === list.length - 1}
                                isHighlighted={highlightedIdx === i}
                                isNew={newIdx === i}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Controls */}
            <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                <input
                    type="number"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && insertEnd()}
                    placeholder="value"
                    style={{
                        padding: "8px 12px",
                        border: "1px solid #d1d5db",
                        borderRadius: 6,
                        fontSize: 13,
                        width: 90,
                        fontFamily: "monospace",
                        outline: "none",
                    }}
                />
                {btn("Insert Front", insertFront, "#4f46e5")}
                {btn("Insert End", insertEnd, "#059669")}
                {btn("Search", search, "#0284c7")}
                {btn("Delete Front", deleteFront, "#dc2626")}
                {btn("Delete End", deleteEnd, "#9f1239")}
                {btn("Reset", reset, "#6b7280")}
            </div>

            {/* Feedback message */}
            {message.text && (
                <div
                    style={{
                        marginTop: 12,
                        padding: "9px 14px",
                        borderRadius: 6,
                        background: msgColors[message.type].bg,
                        border: `1px solid ${msgColors[message.type].border}`,
                        color: msgColors[message.type].text,
                        fontSize: 13,
                        fontFamily: "monospace",
                        lineHeight: 1.5,
                    }}
                >
                    {message.text}
                </div>
            )}

            {/* Footer stats */}
            <div style={{ marginTop: 12, fontSize: 12, color: "#9ca3af", fontFamily: "monospace" }}>
                Nodes: {list.length} · No random access — must traverse from HEAD
            </div>
        </div>
    );
}

export { LinkedListVisualizer, InteractiveLinkedList };
