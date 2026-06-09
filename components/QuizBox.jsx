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

    const getOptionStyle = (i) => {
        if (showResult && i === correctIndex) {
            return {
                borderColor: "var(--comp-correct-border)",
                background: "var(--comp-correct-bg)",
                color: "var(--comp-correct-text)",
            };
        }
        if (showResult && selected === i && i !== correctIndex) {
            return {
                borderColor: "var(--comp-wrong-border)",
                background: "var(--comp-wrong-bg)",
                color: "var(--comp-wrong-text)",
            };
        }
        if (selected === i && !showResult) {
            return {
                borderColor: "var(--comp-selected-border)",
                background: "var(--comp-selected-bg)",
                color: "var(--comp-selected-text)",
            };
        }
        return {
            borderColor: "var(--comp-border-interactive)",
            background: "var(--comp-surface-2)",
            color: "var(--comp-text-2)",
        };
    };

    return (
        <div style={{
            border: "1px solid var(--comp-border)",
            borderRadius: "10px",
            padding: "20px",
            margin: "16px 0",
            background: "var(--comp-surface)",
        }}>
            <div style={{
                fontWeight: 600,
                fontSize: "14px",
                color: "var(--comp-text)",
                marginBottom: "14px",
                lineHeight: "1.5",
            }}>
                {question}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {options.map((opt, i) => {
                    const optStyle = getOptionStyle(i);
                    return (
                        <button
                            key={i}
                            onClick={() => handleSelect(i)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                padding: "10px 14px",
                                border: `2px solid ${optStyle.borderColor}`,
                                borderRadius: "8px",
                                background: optStyle.background,
                                cursor: showResult ? "default" : "pointer",
                                fontSize: "14px",
                                color: optStyle.color,
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
                                border: `2px solid ${optStyle.borderColor}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "12px",
                                fontWeight: 600,
                                flexShrink: 0,
                                background: selected === i ? optStyle.background : "var(--comp-surface-2)",
                                color: optStyle.color,
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
                            background: selected === null ? "var(--comp-border-interactive)" : "#4f46e5",
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
                            background: "var(--comp-text-muted)",
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
                    background: isCorrect ? "var(--comp-correct-bg)" : "var(--comp-wrong-bg)",
                    border: `1px solid ${isCorrect ? "var(--comp-correct-border)" : "var(--comp-wrong-border)"}`,
                    fontSize: "13px",
                    lineHeight: "1.6",
                    color: isCorrect ? "var(--comp-correct-text)" : "var(--comp-wrong-text)",
                }}>
                    <strong>{isCorrect ? "Correct!" : "Not quite."}</strong>{" "}
                    {explanation}
                </div>
            )}
        </div>
    );
}

export { QuizBox };
