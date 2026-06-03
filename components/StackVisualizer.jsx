import React, { useEffect, useState } from "react";

/* ── Static visualizer: renders a stack from a given array (bottom-first) ── */
function StackVisualizer({ initialStack = [10, 20, 30], highlightTop = false, maxSize = 6 }) {
    const [stack, setStack] = useState(initialStack);

    useEffect(() => {
        setStack(initialStack);
    }, [initialStack.join(",")]);

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 0" }}>
            <div style={{ fontSize: 11, fontFamily: "monospace", color: "#6b7280", marginBottom: 4 }}>
                ── top ──
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column-reverse",
                    gap: 4,
                    border: "2px solid #d1d5db",
                    borderTop: "none",
                    borderRadius: "0 0 10px 10px",
                    padding: 8,
                    minWidth: 140,
                    minHeight: 40,
                    background: "#f9fafb",
                }}
            >
                {stack.length === 0 ? (
                    <div style={{ color: "#9ca3af", fontSize: 12, padding: 12, fontFamily: "monospace", textAlign: "center" }}>
                        (empty)
                    </div>
                ) : (
                    stack.map((val, i) => {
                        const isTop = i === stack.length - 1;
                        const useHighlight = isTop && highlightTop;
                        return (
                            <div
                                key={i}
                                style={{
                                    width: 120,
                                    padding: "10px 0",
                                    textAlign: "center",
                                    border: useHighlight ? "2px solid #6366f1" : "2px solid #d1d5db",
                                    borderRadius: 6,
                                    background: useHighlight ? "#eef2ff" : "white",
                                    fontFamily: "monospace",
                                    fontWeight: 600,
                                    color: useHighlight ? "#4338ca" : "#374151",
                                    transition: "all 0.2s ease",
                                    position: "relative",
                                }}
                            >
                                {val}
                                {isTop && (
                                    <span style={{
                                        position: "absolute",
                                        right: -42,
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        fontSize: 10,
                                        fontFamily: "monospace",
                                        color: "#6366f1",
                                        fontWeight: 700,
                                    }}>
                                        ← top
                                    </span>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
            <div style={{ fontSize: 11, fontFamily: "monospace", color: "#6b7280", marginTop: 4 }}>
                size: {stack.length} / {maxSize}
            </div>
        </div>
    );
}

/* ── Interactive playground: push / pop / peek ── */
function InteractiveStack({ maxSize = 6 }) {
    const [stack, setStack] = useState([10, 20, 30]);
    const [inputVal, setInputVal] = useState("");
    const [message, setMessage] = useState("");
    const [flashTop, setFlashTop] = useState(false);

    const flash = () => {
        setFlashTop(true);
        setTimeout(() => setFlashTop(false), 1200);
    };

    const handlePush = () => {
        const val = parseInt(inputVal);
        if (isNaN(val)) {
            setMessage("Enter a valid number to push");
            return;
        }
        if (stack.length >= maxSize) {
            setMessage(`Overflow! Stack is full (max ${maxSize})`);
            return;
        }
        setStack([...stack, val]);
        setMessage(`Pushed ${val} onto the stack`);
        setInputVal("");
        flash();
    };

    const handlePop = () => {
        if (stack.length === 0) {
            setMessage("Underflow! Stack is empty");
            return;
        }
        const top = stack[stack.length - 1];
        setStack(stack.slice(0, -1));
        setMessage(`Popped ${top}`);
    };

    const handlePeek = () => {
        if (stack.length === 0) {
            setMessage("Stack is empty — nothing to peek");
            return;
        }
        const top = stack[stack.length - 1];
        setMessage(`Top of stack: ${top}`);
        flash();
    };

    const handleReset = () => {
        setStack([10, 20, 30]);
        setInputVal("");
        setMessage("");
    };

    const btn = {
        padding: "6px 14px",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
        fontWeight: 500,
        fontSize: 13,
        color: "white",
    };

    const input = {
        padding: "6px 10px",
        border: "1px solid #d1d5db",
        borderRadius: 6,
        width: 100,
        fontSize: 13,
        fontFamily: "monospace",
    };

    return (
        <div style={{
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            padding: 20,
            margin: "16px 0",
            background: "#fafafa",
        }}>
            <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 14, color: "#374151" }}>
                Try it: Interactive Stack
            </div>
            <StackVisualizer initialStack={stack} highlightTop={flashTop} maxSize={maxSize} />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginTop: 12, justifyContent: "center" }}>
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

/* ── Step-by-step runner: feed in a sequence of operations and play through them ── */
function StackOperationStepper({ title = "Stack Operations", operations = [] }) {
    const [stack, setStack] = useState([]);
    const [step, setStep] = useState(-1);
    const [lastOp, setLastOp] = useState(null);

    const apply = (newStep) => {
        const next = [];
        let last = null;
        for (let i = 0; i <= newStep; i++) {
            const op = operations[i];
            if (!op) continue;
            if (op.type === "push") {
                next.push(op.value);
                last = { type: "push", value: op.value };
            } else if (op.type === "pop") {
                last = { type: "pop", value: next.length ? next[next.length - 1] : null };
                next.pop();
            } else if (op.type === "peek") {
                last = { type: "peek", value: next.length ? next[next.length - 1] : null };
            }
        }
        setStack(next);
        setLastOp(last);
        setStep(newStep);
    };

    const next = () => { if (step < operations.length - 1) apply(step + 1); };
    const prev = () => { if (step >= 0) apply(step - 1); };
    const reset = () => { setStack([]); setStep(-1); setLastOp(null); };

    const current = step >= 0 ? operations[step] : null;
    const opLabel = current ? (
        current.type === "push" ? `push(${current.value})` :
        current.type === "pop"  ? `pop()` :
        current.type === "peek" ? `peek()` : current.type
    ) : "(idle)";

    const btn = {
        padding: "6px 14px",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
        fontWeight: 500,
        fontSize: 13,
        color: "white",
    };

    return (
        <div style={{
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            padding: 20,
            margin: "16px 0",
            background: "#fafafa",
        }}>
            <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 14, color: "#374151" }}>{title}</div>
            <div style={{ fontSize: 12, fontFamily: "monospace", color: "#6b7280", marginBottom: 6 }}>
                Step {step + 1} / {operations.length} — <strong style={{ color: "#4338ca" }}>{opLabel}</strong>
                {lastOp && lastOp.type === "pop" && lastOp.value !== null && (
                    <span> → returned <strong>{lastOp.value}</strong></span>
                )}
                {lastOp && lastOp.type === "peek" && lastOp.value !== null && (
                    <span> → top is <strong>{lastOp.value}</strong></span>
                )}
            </div>
            <StackVisualizer initialStack={stack} highlightTop={!!lastOp && lastOp.type !== "pop"} />
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 12 }}>
                <button style={{ ...btn, background: "#6b7280" }} onClick={reset}>Reset</button>
                <button style={{ ...btn, background: "#4f46e5", opacity: step < 0 ? 0.5 : 1 }} onClick={prev} disabled={step < 0}>← Prev</button>
                <button style={{ ...btn, background: "#4f46e5", opacity: step >= operations.length - 1 ? 0.5 : 1 }} onClick={next} disabled={step >= operations.length - 1}>Next →</button>
            </div>
        </div>
    );
}

export { StackVisualizer, InteractiveStack, StackOperationStepper };
