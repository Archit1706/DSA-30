import React from "react";

const complexityColors = {
    "O(1)": { bg: "#dcfce7", text: "#166534", label: "Constant" },
    "O(log n)": { bg: "#dbeafe", text: "#1e40af", label: "Logarithmic" },
    "O(n)": { bg: "#fef9c3", text: "#854d0e", label: "Linear" },
    "O(n log n)": { bg: "#fed7aa", text: "#9a3412", label: "Linearithmic" },
    "O(n^2)": { bg: "#fecaca", text: "#991b1b", label: "Quadratic" },
    "O(n^3)": { bg: "#fca5a5", text: "#7f1d1d", label: "Cubic" },
    "O(2^n)": { bg: "#f9a8d4", text: "#831843", label: "Exponential" },
};

function ComplexityBadge({ complexity }) {
    const style = complexityColors[complexity] || { bg: "#f3f4f6", text: "#374151", label: "" };
    return (
        <span style={{
            display: "inline-block",
            padding: "2px 10px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: 600,
            fontFamily: "monospace",
            background: style.bg,
            color: style.text,
        }}>
            {complexity}
        </span>
    );
}

function ComplexityTable({ operations }) {
    const cellStyle = {
        padding: "10px 14px",
        borderBottom: "1px solid #e5e7eb",
        fontSize: "14px",
    };

    const headerStyle = {
        ...cellStyle,
        fontWeight: 600,
        background: "#f9fafb",
        color: "#374151",
        fontSize: "13px",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
    };

    return (
        <div style={{ overflowX: "auto", margin: "16px 0" }}>
            <table style={{
                width: "100%",
                borderCollapse: "collapse",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                overflow: "hidden",
            }}>
                <thead>
                    <tr>
                        <th style={headerStyle}>Operation</th>
                        <th style={{ ...headerStyle, textAlign: "center" }}>Time</th>
                        <th style={{ ...headerStyle, textAlign: "center" }}>Space</th>
                        <th style={headerStyle}>Notes</th>
                    </tr>
                </thead>
                <tbody>
                    {operations.map((op, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? "white" : "#fafafa" }}>
                            <td style={{ ...cellStyle, fontWeight: 500 }}>{op.name}</td>
                            <td style={{ ...cellStyle, textAlign: "center" }}>
                                <ComplexityBadge complexity={op.time} />
                            </td>
                            <td style={{ ...cellStyle, textAlign: "center" }}>
                                <ComplexityBadge complexity={op.space} />
                            </td>
                            <td style={{ ...cellStyle, color: "#6b7280", fontSize: "13px" }}>{op.notes || "-"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export { ComplexityTable, ComplexityBadge };
