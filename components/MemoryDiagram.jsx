import React, { useState } from "react";

function MemoryDiagram({ baseAddress = 1000, elementSize = 4, values = [10, 20, 30, 40, 50], variableName = "arr" }) {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    return (
        <div style={{
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            padding: "20px",
            margin: "16px 0",
            background: "#fafafa",
            overflowX: "auto",
        }}>
            <div style={{ fontWeight: 600, fontSize: "14px", color: "#374151", marginBottom: "14px" }}>
                Memory Layout: <code style={{ color: "#6366f1" }}>{variableName}[{values.length}]</code>
            </div>

            {/* Memory blocks */}
            <div style={{ display: "flex", gap: "0px", minWidth: "fit-content" }}>
                {values.map((val, i) => {
                    const addr = baseAddress + i * elementSize;
                    const isHovered = hoveredIndex === i;
                    return (
                        <div
                            key={i}
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                cursor: "default",
                            }}
                        >
                            {/* Address label */}
                            <div style={{
                                fontSize: "10px",
                                fontFamily: "monospace",
                                color: isHovered ? "#4f46e5" : "#9ca3af",
                                marginBottom: "4px",
                                fontWeight: isHovered ? 600 : 400,
                                transition: "all 0.15s ease",
                            }}>
                                0x{addr.toString(16).toUpperCase()}
                            </div>

                            {/* Memory cell */}
                            <div style={{
                                width: "64px",
                                height: "48px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderTop: "2px solid",
                                borderBottom: "2px solid",
                                borderLeft: i === 0 ? "2px solid" : "1px dashed",
                                borderRight: i === values.length - 1 ? "2px solid" : "1px dashed",
                                borderColor: isHovered ? "#6366f1" : "#94a3b8",
                                background: isHovered ? "#eef2ff" : "#ffffff",
                                fontFamily: "monospace",
                                fontWeight: 700,
                                fontSize: "16px",
                                color: isHovered ? "#4338ca" : "#1e293b",
                                transition: "all 0.15s ease",
                            }}>
                                {val}
                            </div>

                            {/* Index label */}
                            <div style={{
                                fontSize: "11px",
                                fontFamily: "monospace",
                                color: isHovered ? "#4f46e5" : "#6b7280",
                                marginTop: "4px",
                                fontWeight: isHovered ? 600 : 400,
                            }}>
                                {variableName}[{i}]
                            </div>

                            {/* Size indicator */}
                            <div style={{
                                fontSize: "9px",
                                fontFamily: "monospace",
                                color: "#d1d5db",
                                marginTop: "2px",
                            }}>
                                {elementSize}B
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Formula display */}
            {hoveredIndex !== null && (
                <div style={{
                    marginTop: "14px",
                    padding: "10px 14px",
                    background: "#eef2ff",
                    border: "1px solid #c7d2fe",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontFamily: "monospace",
                    color: "#4338ca",
                    transition: "all 0.15s ease",
                }}>
                    Address of {variableName}[{hoveredIndex}] = {baseAddress} + ({hoveredIndex} x {elementSize}) = <strong>{baseAddress + hoveredIndex * elementSize}</strong>
                </div>
            )}
        </div>
    );
}

export { MemoryDiagram };
