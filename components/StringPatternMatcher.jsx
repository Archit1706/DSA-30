import React, { useState } from "react";

/**
 * StringPatternMatcher - Visualizes pattern matching on a text string.
 * Shows the text and pattern aligned, with step-by-step matching.
 */
function StringPatternMatcher({ text, pattern, steps }) {
    const [current, setCurrent] = useState(0);

    const handlePrev = () => setCurrent(Math.max(0, current - 1));
    const handleNext = () => setCurrent(Math.min(steps.length - 1, current + 1));

    const step = steps[current];
    const textChars = text.split("");
    const patternChars = pattern.split("");

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
            <div style={{ fontWeight: 600, fontSize: "14px", color: "#374151", marginBottom: "4px" }}>
                Pattern Matching: "{pattern}" in "{text}"
            </div>
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
                    background: step.match ? "#16a34a" : "#6366f1",
                    borderRadius: "2px",
                    transition: "width 0.3s ease",
                }} />
            </div>

            {/* Text row */}
            <div style={{ marginBottom: "4px" }}>
                <span style={{ fontSize: "11px", color: "#6b7280", fontWeight: 600, display: "inline-block", width: "50px" }}>
                    Text:
                </span>
                <div style={{ display: "inline-flex", gap: "1px" }}>
                    {textChars.map((ch, i) => {
                        const isComparing = step.textIndices?.includes(i);
                        const isMatched = step.matchedIndices?.includes(i);
                        return (
                            <div key={i} style={{
                                width: "32px",
                                height: "36px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: isMatched ? "2px solid #16a34a" : isComparing ? "2px solid #f59e0b" : "1px solid #d1d5db",
                                borderRadius: "4px",
                                background: isMatched ? "#f0fdf4" : isComparing ? "#fffbeb" : "white",
                                fontFamily: "monospace",
                                fontWeight: 600,
                                fontSize: "14px",
                                color: isMatched ? "#166534" : isComparing ? "#92400e" : "#374151",
                                transition: "all 0.2s ease",
                            }}>
                                {ch}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Pattern row - offset by step.offset */}
            <div style={{ marginBottom: "12px" }}>
                <span style={{ fontSize: "11px", color: "#6b7280", fontWeight: 600, display: "inline-block", width: "50px" }}>
                    Pattern:
                </span>
                <div style={{ display: "inline-flex", gap: "1px" }}>
                    {Array(step.offset || 0).fill(null).map((_, i) => (
                        <div key={`spacer-${i}`} style={{ width: "32px", height: "36px" }} />
                    ))}
                    {patternChars.map((ch, i) => {
                        const textIdx = (step.offset || 0) + i;
                        const isComparing = step.patternIndex === i;
                        const isMatched = step.matchedPatternIndices?.includes(i);
                        return (
                            <div key={i} style={{
                                width: "32px",
                                height: "36px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: isMatched ? "2px solid #16a34a" : isComparing ? "2px solid #f59e0b" : "1px solid #c4b5fd",
                                borderRadius: "4px",
                                background: isMatched ? "#f0fdf4" : isComparing ? "#fffbeb" : "#f5f3ff",
                                fontFamily: "monospace",
                                fontWeight: 600,
                                fontSize: "14px",
                                color: isMatched ? "#166534" : isComparing ? "#92400e" : "#5b21b6",
                                transition: "all 0.2s ease",
                            }}>
                                {ch}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Description */}
            <div style={{
                padding: "12px 14px",
                background: step.match ? "#f0fdf4" : "white",
                border: `1px solid ${step.match ? "#bbf7d0" : "#e5e7eb"}`,
                borderRadius: "8px",
                fontSize: "14px",
                lineHeight: "1.6",
                color: step.match ? "#166534" : "#374151",
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

export { StringPatternMatcher };
