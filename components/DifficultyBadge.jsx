import React from "react";

const difficultyStyles = {
    easy: { bg: "#dcfce7", color: "#166534", border: "#bbf7d0" },
    medium: { bg: "#fef9c3", color: "#854d0e", border: "#fde68a" },
    hard: { bg: "#fecaca", color: "#991b1b", border: "#fca5a5" },
};

function DifficultyBadge({ level }) {
    const style = difficultyStyles[level.toLowerCase()] || difficultyStyles.easy;
    return (
        <span style={{
            display: "inline-block",
            padding: "2px 10px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: 600,
            textTransform: "capitalize",
            background: style.bg,
            color: style.color,
            border: `1px solid ${style.border}`,
        }}>
            {level}
        </span>
    );
}

export { DifficultyBadge };
