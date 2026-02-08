import React, { useState } from "react";

function QuizBox({ question, options, correctIndex, explanation }) {
    const [selected, setSelected] = useState(null);
    const [showResult, setShowResult] = useState(false);

    const handleSelect = (idx) => {
        if (showResult) return;
        setSelected(idx);
    };

    const handleCheck = () => {
        if (selected === null) return;
        setShowResult(true);
    };

    const handleReset = () => {
        setSelected(null);
        setShowResult(false);
    };

    const isCorrect = selected === correctIndex;

    return (
        <div style={{
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            padding: "20px",
            margin: "16px 0",
            background: "#fafafa",
        }}>
            <div style={{
                fontWeight: 600,
                fontSize: "14px",
                color: "#1f2937",
                marginBottom: "14px",
                lineHeight: "1.5",
            }}>
                {question}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {options.map((opt, i) => {
                    let borderColor = "#d1d5db";
                    let bg = "white";
                    let textColor = "#374151";

                    if (selected === i && !showResult) {
                        borderColor = "#6366f1";
                        bg = "#eef2ff";
                    }
                    if (showResult && i === correctIndex) {
                        borderColor = "#16a34a";
                        bg = "#f0fdf4";
                        textColor = "#166534";
                    }
                    if (showResult && selected === i && i !== correctIndex) {
                        borderColor = "#dc2626";
                        bg = "#fef2f2";
                        textColor = "#991b1b";
                    }

                    return (
                        <button
                            key={i}
                            onClick={() => handleSelect(i)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                padding: "10px 14px",
                                border: `2px solid ${borderColor}`,
                                borderRadius: "8px",
                                background: bg,
                                cursor: showResult ? "default" : "pointer",
                                fontSize: "14px",
                                color: textColor,
                                textAlign: "left",
                                fontFamily: "inherit",
                                transition: "all 0.15s ease",
                                width: "100%",
                            }}
                        >
                            <span style={{
                                width: "24px",
                                height: "24px",
                                borderRadius: "50%",
                                border: `2px solid ${borderColor}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "12px",
                                fontWeight: 600,
                                flexShrink: 0,
                                background: selected === i ? (showResult ? bg : "#eef2ff") : "white",
                            }}>
                                {String.fromCharCode(65 + i)}
                            </span>
                            <span style={{ fontFamily: "monospace", fontSize: "13px" }}>{opt}</span>
                        </button>
                    );
                })}
            </div>
            <div style={{ marginTop: "14px", display: "flex", gap: "8px", alignItems: "center" }}>
                {!showResult ? (
                    <button
                        onClick={handleCheck}
                        disabled={selected === null}
                        style={{
                            padding: "8px 20px",
                            border: "none",
                            borderRadius: "6px",
                            background: selected === null ? "#d1d5db" : "#4f46e5",
                            color: "white",
                            cursor: selected === null ? "not-allowed" : "pointer",
                            fontWeight: 500,
                            fontSize: "13px",
                        }}
                    >
                        Check Answer
                    </button>
                ) : (
                    <button
                        onClick={handleReset}
                        style={{
                            padding: "8px 20px",
                            border: "none",
                            borderRadius: "6px",
                            background: "#6b7280",
                            color: "white",
                            cursor: "pointer",
                            fontWeight: 500,
                            fontSize: "13px",
                        }}
                    >
                        Try Again
                    </button>
                )}
            </div>
            {showResult && (
                <div style={{
                    marginTop: "12px",
                    padding: "12px 14px",
                    borderRadius: "8px",
                    background: isCorrect ? "#f0fdf4" : "#fef2f2",
                    border: `1px solid ${isCorrect ? "#bbf7d0" : "#fecaca"}`,
                    fontSize: "13px",
                    lineHeight: "1.6",
                    color: isCorrect ? "#166534" : "#991b1b",
                }}>
                    <strong>{isCorrect ? "Correct!" : "Not quite."}</strong>{" "}
                    {explanation}
                </div>
            )}
        </div>
    );
}

export { QuizBox };
