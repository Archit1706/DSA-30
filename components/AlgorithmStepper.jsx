import React, { useState } from "react";

function AlgorithmStepper({ steps, title }) {
    const [current, setCurrent] = useState(0);

    const handlePrev = () => setCurrent(Math.max(0, current - 1));
    const handleNext = () => setCurrent(Math.min(steps.length - 1, current + 1));

    const step = steps[current];

    const btnStyle = (disabled) => ({
        padding: "6px 16px",
        border: "none",
        borderRadius: "6px",
        background: disabled ? "#e5e7eb" : "#4f46e5",
        color: disabled ? "#9ca3af" : "white",
        cursor: disabled ? "not-allowed" : "pointer",
        fontWeight: 500,
        fontSize: "13px",
        transition: "all 0.15s ease",
    });

    return (
        <div style={{
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            padding: "20px",
            margin: "16px 0",
            background: "#fafafa",
        }}>
            {title && (
                <div style={{ fontWeight: 600, fontSize: "14px", color: "#374151", marginBottom: "4px" }}>
                    {title}
                </div>
            )}
            <div style={{
                fontSize: "12px",
                color: "#9ca3af",
                marginBottom: "14px",
                fontFamily: "monospace",
            }}>
                Step {current + 1} of {steps.length}
            </div>

            {/* Progress bar */}
            <div style={{
                height: "4px",
                background: "#e5e7eb",
                borderRadius: "2px",
                marginBottom: "16px",
                overflow: "hidden",
            }}>
                <div style={{
                    height: "100%",
                    width: `${((current + 1) / steps.length) * 100}%`,
                    background: "#6366f1",
                    borderRadius: "2px",
                    transition: "width 0.3s ease",
                }} />
            </div>

            {/* Array visualization */}
            {step.array && (
                <div style={{ display: "flex", gap: "2px", marginBottom: "12px", overflowX: "auto" }}>
                    {step.array.map((val, i) => {
                        const isActive = step.activeIndices?.includes(i);
                        const isPointer = step.pointerIndices?.includes(i);
                        return (
                            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                                <div style={{
                                    width: "44px",
                                    height: "44px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: isActive ? "2px solid #6366f1" : isPointer ? "2px solid #f59e0b" : "2px solid #d1d5db",
                                    borderRadius: "6px",
                                    background: isActive ? "#eef2ff" : isPointer ? "#fffbeb" : "#f9fafb",
                                    fontFamily: "monospace",
                                    fontWeight: 600,
                                    fontSize: "14px",
                                    color: isActive ? "#4338ca" : isPointer ? "#92400e" : "#374151",
                                    transition: "all 0.2s ease",
                                }}>
                                    {val}
                                </div>
                                <span style={{ fontSize: "10px", color: "#9ca3af", fontFamily: "monospace" }}>[{i}]</span>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Description */}
            <div style={{
                padding: "12px 14px",
                background: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "14px",
                lineHeight: "1.6",
                color: "#374151",
                marginBottom: "14px",
            }}>
                {step.description}
            </div>

            {/* Controls */}
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <button style={btnStyle(current === 0)} onClick={handlePrev} disabled={current === 0}>
                    Previous
                </button>
                <button style={btnStyle(current === steps.length - 1)} onClick={handleNext} disabled={current === steps.length - 1}>
                    Next
                </button>
                {current > 0 && (
                    <button
                        onClick={() => setCurrent(0)}
                        style={{
                            padding: "6px 16px",
                            border: "1px solid #d1d5db",
                            borderRadius: "6px",
                            background: "white",
                            color: "#6b7280",
                            cursor: "pointer",
                            fontWeight: 500,
                            fontSize: "13px",
                        }}
                    >
                        Restart
                    </button>
                )}
            </div>
        </div>
    );
}

export { AlgorithmStepper };
