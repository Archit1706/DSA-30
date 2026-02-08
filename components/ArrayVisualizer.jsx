import React, { useState, useEffect, useRef } from "react";

function ArrayVisualizer({ initialArray = [10, 20, 30, 40, 50], highlightIndices = [], labels = {} }) {
    const [arr, setArr] = useState(initialArray);
    const [highlighted, setHighlighted] = useState(highlightIndices);

    useEffect(() => {
        setArr(initialArray);
    }, [initialArray.join(",")]);

    useEffect(() => {
        setHighlighted(highlightIndices);
    }, [highlightIndices.join(",")]);

    return (
        <div style={{ overflowX: "auto", padding: "16px 0" }}>
            <div style={{ display: "flex", gap: "2px", alignItems: "flex-end", minWidth: "fit-content" }}>
                {arr.map((val, i) => {
                    const isHighlighted = highlighted.includes(i);
                    const label = labels[i] || "";
                    return (
                        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                            {label && (
                                <span style={{
                                    fontSize: "11px",
                                    fontWeight: 600,
                                    color: "#6366f1",
                                    fontFamily: "monospace",
                                }}>
                                    {label}
                                </span>
                            )}
                            <div
                                style={{
                                    width: "52px",
                                    height: "52px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: isHighlighted ? "2px solid #6366f1" : "2px solid #d1d5db",
                                    borderRadius: "6px",
                                    background: isHighlighted ? "#eef2ff" : "#f9fafb",
                                    fontFamily: "monospace",
                                    fontWeight: 600,
                                    fontSize: "16px",
                                    color: isHighlighted ? "#4338ca" : "#374151",
                                    transition: "all 0.2s ease",
                                }}
                            >
                                {val}
                            </div>
                            <span style={{
                                fontSize: "11px",
                                color: "#9ca3af",
                                fontFamily: "monospace",
                            }}>
                                [{i}]
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function InteractiveArray() {
    const [arr, setArr] = useState([10, 20, 30, 40, 50]);
    const [inputVal, setInputVal] = useState("");
    const [inputIdx, setInputIdx] = useState("");
    const [message, setMessage] = useState("");
    const [highlighted, setHighlighted] = useState([]);

    const handleInsert = () => {
        const val = parseInt(inputVal);
        const idx = parseInt(inputIdx);
        if (isNaN(val)) { setMessage("Enter a valid number"); return; }
        const insertAt = isNaN(idx) ? arr.length : Math.max(0, Math.min(idx, arr.length));
        const newArr = [...arr];
        newArr.splice(insertAt, 0, val);
        setArr(newArr);
        setHighlighted([insertAt]);
        setMessage(`Inserted ${val} at index ${insertAt}`);
        setInputVal("");
        setInputIdx("");
        setTimeout(() => setHighlighted([]), 1500);
    };

    const handleDelete = () => {
        const idx = parseInt(inputIdx);
        if (isNaN(idx) || idx < 0 || idx >= arr.length) {
            setMessage("Enter a valid index to delete");
            return;
        }
        const removed = arr[idx];
        const newArr = [...arr];
        newArr.splice(idx, 1);
        setArr(newArr);
        setMessage(`Deleted ${removed} from index ${idx}`);
        setInputIdx("");
        setHighlighted([]);
    };

    const handleSearch = () => {
        const val = parseInt(inputVal);
        if (isNaN(val)) { setMessage("Enter a value to search"); return; }
        const idx = arr.indexOf(val);
        if (idx === -1) {
            setMessage(`${val} not found in the array`);
            setHighlighted([]);
        } else {
            setMessage(`Found ${val} at index ${idx}`);
            setHighlighted([idx]);
        }
    };

    const handleReset = () => {
        setArr([10, 20, 30, 40, 50]);
        setMessage("");
        setHighlighted([]);
        setInputVal("");
        setInputIdx("");
    };

    const btnStyle = {
        padding: "6px 14px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: 500,
        fontSize: "13px",
        transition: "opacity 0.2s",
    };

    const inputStyle = {
        padding: "6px 10px",
        border: "1px solid #d1d5db",
        borderRadius: "6px",
        width: "80px",
        fontSize: "13px",
        fontFamily: "monospace",
    };

    return (
        <div style={{
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            padding: "20px",
            margin: "16px 0",
            background: "#fafafa",
        }}>
            <div style={{ fontWeight: 600, marginBottom: "12px", fontSize: "14px", color: "#374151" }}>
                Try it: Interactive Array
            </div>
            <ArrayVisualizer initialArray={arr} highlightIndices={highlighted} />
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center", marginTop: "12px" }}>
                <input
                    style={inputStyle}
                    placeholder="Value"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    type="number"
                />
                <input
                    style={inputStyle}
                    placeholder="Index"
                    value={inputIdx}
                    onChange={(e) => setInputIdx(e.target.value)}
                    type="number"
                />
                <button
                    style={{ ...btnStyle, background: "#4f46e5", color: "white" }}
                    onClick={handleInsert}
                >
                    Insert
                </button>
                <button
                    style={{ ...btnStyle, background: "#dc2626", color: "white" }}
                    onClick={handleDelete}
                >
                    Delete
                </button>
                <button
                    style={{ ...btnStyle, background: "#059669", color: "white" }}
                    onClick={handleSearch}
                >
                    Search
                </button>
                <button
                    style={{ ...btnStyle, background: "#6b7280", color: "white" }}
                    onClick={handleReset}
                >
                    Reset
                </button>
            </div>
            {message && (
                <div style={{
                    marginTop: "10px",
                    padding: "8px 12px",
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontFamily: "monospace",
                    color: "#166534",
                }}>
                    {message}
                </div>
            )}
        </div>
    );
}

export { ArrayVisualizer, InteractiveArray };
