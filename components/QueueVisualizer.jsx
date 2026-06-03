import React, { useEffect, useState } from "react";

/* ── Static linear queue: items left → right, front on the left ── */
function QueueVisualizer({ initialQueue = [10, 20, 30], highlightFront = false, highlightRear = false }) {
    const [queue, setQueue] = useState(initialQueue);

    useEffect(() => {
        setQueue(initialQueue);
    }, [initialQueue.join(",")]);

    return (
        <div style={{ padding: "16px 0", overflowX: "auto" }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", minWidth: "fit-content" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: 8 }}>
                    <span style={{ fontSize: 11, fontFamily: "monospace", color: "#6b7280", marginBottom: 4 }}>dequeue ←</span>
                    <span style={{ fontSize: 11, fontFamily: "monospace", color: "#059669", fontWeight: 700 }}>front</span>
                </div>
                <div
                    style={{
                        display: "flex",
                        gap: 4,
                        border: "2px solid #d1d5db",
                        borderLeft: "none",
                        borderRight: "none",
                        padding: 8,
                        minWidth: 140,
                        minHeight: 60,
                        background: "#f9fafb",
                        alignItems: "center",
                    }}
                >
                    {queue.length === 0 ? (
                        <div style={{ color: "#9ca3af", fontSize: 12, padding: "0 24px", fontFamily: "monospace" }}>(empty)</div>
                    ) : (
                        queue.map((val, i) => {
                            const isFront = i === 0;
                            const isRear = i === queue.length - 1;
                            const useHF = isFront && highlightFront;
                            const useHR = isRear && highlightRear;
                            const useH = useHF || useHR;
                            return (
                                <div
                                    key={i}
                                    style={{
                                        width: 56,
                                        height: 56,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        border: useH ? "2px solid #6366f1" : "2px solid #d1d5db",
                                        borderRadius: 6,
                                        background: useH ? "#eef2ff" : "white",
                                        fontFamily: "monospace",
                                        fontWeight: 600,
                                        fontSize: 15,
                                        color: useH ? "#4338ca" : "#374151",
                                        transition: "all 0.2s ease",
                                    }}
                                >
                                    {val}
                                </div>
                            );
                        })
                    )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginLeft: 8 }}>
                    <span style={{ fontSize: 11, fontFamily: "monospace", color: "#6b7280", marginBottom: 4 }}>← enqueue</span>
                    <span style={{ fontSize: 11, fontFamily: "monospace", color: "#dc2626", fontWeight: 700 }}>rear</span>
                </div>
            </div>
            <div style={{ textAlign: "center", fontSize: 11, fontFamily: "monospace", color: "#6b7280", marginTop: 6 }}>
                size: {queue.length}
            </div>
        </div>
    );
}

/* ── Interactive playground for a linear queue ── */
function InteractiveQueue({ maxSize = 7 }) {
    const [queue, setQueue] = useState([10, 20, 30]);
    const [inputVal, setInputVal] = useState("");
    const [message, setMessage] = useState("");
    const [flash, setFlash] = useState({ front: false, rear: false });

    const flashFront = () => { setFlash({ front: true, rear: false }); setTimeout(() => setFlash({ front: false, rear: false }), 1000); };
    const flashRear = () => { setFlash({ front: false, rear: true }); setTimeout(() => setFlash({ front: false, rear: false }), 1000); };

    const handleEnqueue = () => {
        const val = parseInt(inputVal);
        if (isNaN(val)) { setMessage("Enter a valid number to enqueue"); return; }
        if (queue.length >= maxSize) { setMessage(`Overflow! Queue is full (max ${maxSize})`); return; }
        setQueue([...queue, val]);
        setMessage(`Enqueued ${val} at the rear`);
        setInputVal("");
        flashRear();
    };

    const handleDequeue = () => {
        if (queue.length === 0) { setMessage("Underflow! Queue is empty"); return; }
        const front = queue[0];
        setQueue(queue.slice(1));
        setMessage(`Dequeued ${front} from the front`);
    };

    const handlePeek = () => {
        if (queue.length === 0) { setMessage("Queue is empty — nothing to peek"); return; }
        setMessage(`Front of queue: ${queue[0]}`);
        flashFront();
    };

    const handleReset = () => {
        setQueue([10, 20, 30]);
        setInputVal("");
        setMessage("");
    };

    const btn = { padding: "6px 14px", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500, fontSize: 13, color: "white" };
    const input = { padding: "6px 10px", border: "1px solid #d1d5db", borderRadius: 6, width: 100, fontSize: 13, fontFamily: "monospace" };

    return (
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 20, margin: "16px 0", background: "#fafafa" }}>
            <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 14, color: "#374151" }}>Try it: Interactive Queue (FIFO)</div>
            <QueueVisualizer initialQueue={queue} highlightFront={flash.front} highlightRear={flash.rear} />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginTop: 12, justifyContent: "center" }}>
                <input style={input} placeholder="Value" type="number" value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleEnqueue(); }} />
                <button style={{ ...btn, background: "#4f46e5" }} onClick={handleEnqueue}>Enqueue</button>
                <button style={{ ...btn, background: "#dc2626" }} onClick={handleDequeue}>Dequeue</button>
                <button style={{ ...btn, background: "#059669" }} onClick={handlePeek}>Peek</button>
                <button style={{ ...btn, background: "#6b7280" }} onClick={handleReset}>Reset</button>
            </div>
            {message && (
                <div style={{ marginTop: 10, padding: "8px 12px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 6, fontSize: 13, fontFamily: "monospace", color: "#166534", textAlign: "center" }}>
                    {message}
                </div>
            )}
        </div>
    );
}

/* ── Step-by-step runner over a queue ── */
function QueueOperationStepper({ title = "Queue Operations", operations = [] }) {
    const [queue, setQueue] = useState([]);
    const [step, setStep] = useState(-1);
    const [lastOp, setLastOp] = useState(null);

    const apply = (newStep) => {
        const next = [];
        let last = null;
        for (let i = 0; i <= newStep; i++) {
            const op = operations[i];
            if (!op) continue;
            if (op.type === "enqueue") {
                next.push(op.value);
                last = { type: "enqueue", value: op.value };
            } else if (op.type === "dequeue") {
                last = { type: "dequeue", value: next.length ? next[0] : null };
                next.shift();
            } else if (op.type === "peek") {
                last = { type: "peek", value: next.length ? next[0] : null };
            }
        }
        setQueue(next);
        setLastOp(last);
        setStep(newStep);
    };

    const next = () => { if (step < operations.length - 1) apply(step + 1); };
    const prev = () => { if (step >= 0) apply(step - 1); };
    const reset = () => { setQueue([]); setStep(-1); setLastOp(null); };

    const current = step >= 0 ? operations[step] : null;
    const opLabel = current ? (
        current.type === "enqueue" ? `enqueue(${current.value})` :
        current.type === "dequeue" ? `dequeue()` :
        current.type === "peek"    ? `peek()` : current.type
    ) : "(idle)";

    const btn = { padding: "6px 14px", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500, fontSize: 13, color: "white" };

    return (
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 20, margin: "16px 0", background: "#fafafa" }}>
            <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 14, color: "#374151" }}>{title}</div>
            <div style={{ fontSize: 12, fontFamily: "monospace", color: "#6b7280", marginBottom: 6 }}>
                Step {step + 1} / {operations.length} — <strong style={{ color: "#4338ca" }}>{opLabel}</strong>
                {lastOp && lastOp.type === "dequeue" && lastOp.value !== null && <span> → returned <strong>{lastOp.value}</strong></span>}
                {lastOp && lastOp.type === "peek" && lastOp.value !== null && <span> → front is <strong>{lastOp.value}</strong></span>}
            </div>
            <QueueVisualizer
                initialQueue={queue}
                highlightFront={!!lastOp && (lastOp.type === "peek" || lastOp.type === "dequeue")}
                highlightRear={!!lastOp && lastOp.type === "enqueue"}
            />
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 12 }}>
                <button style={{ ...btn, background: "#6b7280" }} onClick={reset}>Reset</button>
                <button style={{ ...btn, background: "#4f46e5", opacity: step < 0 ? 0.5 : 1 }} onClick={prev} disabled={step < 0}>← Prev</button>
                <button style={{ ...btn, background: "#4f46e5", opacity: step >= operations.length - 1 ? 0.5 : 1 }} onClick={next} disabled={step >= operations.length - 1}>Next →</button>
            </div>
        </div>
    );
}

/* ── Circular queue visualizer: ring of slots with front/rear pointers ── */
function CircularQueueVisualizer({ capacity = 6, items = [], front = 0, rear = 0, count = 0 }) {
    const slots = Array.from({ length: capacity }, (_, i) => i);
    const radius = 90;
    const cx = 120, cy = 120;

    return (
        <div style={{ padding: "20px 0", display: "flex", justifyContent: "center" }}>
            <svg width="240" height="240" style={{ overflow: "visible" }}>
                <circle cx={cx} cy={cy} r={radius} stroke="#d1d5db" strokeWidth="1" fill="none" strokeDasharray="3,3" />
                {slots.map((i) => {
                    const angle = (i / capacity) * 2 * Math.PI - Math.PI / 2;
                    const x = cx + radius * Math.cos(angle);
                    const y = cy + radius * Math.sin(angle);
                    const isFront = count > 0 && i === front;
                    const isRear = count > 0 && i === ((rear - 1 + capacity) % capacity);
                    let inUse = false;
                    if (count > 0) {
                        for (let k = 0; k < count; k++) {
                            if ((front + k) % capacity === i) { inUse = true; break; }
                        }
                    }
                    const border = isFront ? "#059669" : isRear ? "#dc2626" : inUse ? "#6366f1" : "#d1d5db";
                    const bg = isFront ? "#dcfce7" : isRear ? "#fee2e2" : inUse ? "#eef2ff" : "white";
                    const value = inUse ? items[i] : "";
                    return (
                        <g key={i}>
                            <rect
                                x={x - 18} y={y - 18}
                                width="36" height="36" rx="6"
                                fill={bg}
                                stroke={border}
                                strokeWidth="2"
                            />
                            <text x={x} y={y + 4} textAnchor="middle" fontSize="13" fontFamily="monospace" fontWeight="600" fill="#1f2937">
                                {value}
                            </text>
                            <text x={x} y={y + 30} textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#9ca3af">
                                [{i}]
                            </text>
                            {isFront && (
                                <text x={x} y={y - 26} textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="700" fill="#059669">
                                    front
                                </text>
                            )}
                            {isRear && (
                                <text x={x} y={y - 26 + (isFront ? 12 : 0)} textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="700" fill="#dc2626">
                                    rear
                                </text>
                            )}
                        </g>
                    );
                })}
                <text x={cx} y={cy - 4} textAnchor="middle" fontSize="12" fontFamily="monospace" fill="#6b7280">size</text>
                <text x={cx} y={cy + 14} textAnchor="middle" fontSize="16" fontFamily="monospace" fontWeight="700" fill="#1f2937">{count}/{capacity}</text>
            </svg>
        </div>
    );
}

/* ── Interactive circular queue ── */
function InteractiveCircularQueue({ capacity = 6 }) {
    const [items, setItems] = useState(Array(capacity).fill(null));
    const [front, setFront] = useState(0);
    const [rear, setRear] = useState(0);
    const [count, setCount] = useState(0);
    const [inputVal, setInputVal] = useState("");
    const [message, setMessage] = useState("");

    const handleEnqueue = () => {
        const val = parseInt(inputVal);
        if (isNaN(val)) { setMessage("Enter a valid number"); return; }
        if (count === capacity) { setMessage("Overflow! Queue is full"); return; }
        const newItems = [...items];
        newItems[rear] = val;
        setItems(newItems);
        setRear((rear + 1) % capacity);
        setCount(count + 1);
        setMessage(`Enqueued ${val} at slot ${rear}`);
        setInputVal("");
    };

    const handleDequeue = () => {
        if (count === 0) { setMessage("Underflow! Queue is empty"); return; }
        const v = items[front];
        const newItems = [...items];
        newItems[front] = null;
        setItems(newItems);
        setFront((front + 1) % capacity);
        setCount(count - 1);
        setMessage(`Dequeued ${v} from slot ${front}`);
    };

    const handleReset = () => {
        setItems(Array(capacity).fill(null));
        setFront(0);
        setRear(0);
        setCount(0);
        setMessage("");
        setInputVal("");
    };

    const btn = { padding: "6px 14px", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500, fontSize: 13, color: "white" };
    const input = { padding: "6px 10px", border: "1px solid #d1d5db", borderRadius: 6, width: 100, fontSize: 13, fontFamily: "monospace" };

    return (
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 20, margin: "16px 0", background: "#fafafa" }}>
            <div style={{ fontWeight: 600, marginBottom: 4, fontSize: 14, color: "#374151" }}>Try it: Circular Queue</div>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>
                Watch how <strong style={{ color: "#059669" }}>front</strong> and <strong style={{ color: "#dc2626" }}>rear</strong> wrap around the ring with modular arithmetic.
            </div>
            <CircularQueueVisualizer capacity={capacity} items={items} front={front} rear={rear} count={count} />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginTop: 12, justifyContent: "center" }}>
                <input style={input} placeholder="Value" type="number" value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleEnqueue(); }} />
                <button style={{ ...btn, background: "#4f46e5" }} onClick={handleEnqueue}>Enqueue</button>
                <button style={{ ...btn, background: "#dc2626" }} onClick={handleDequeue}>Dequeue</button>
                <button style={{ ...btn, background: "#6b7280" }} onClick={handleReset}>Reset</button>
            </div>
            {message && (
                <div style={{ marginTop: 10, padding: "8px 12px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 6, fontSize: 13, fontFamily: "monospace", color: "#166534", textAlign: "center" }}>
                    {message}
                </div>
            )}
        </div>
    );
}

export { QueueVisualizer, InteractiveQueue, QueueOperationStepper, CircularQueueVisualizer, InteractiveCircularQueue };
