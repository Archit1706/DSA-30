import React, { useState } from "react";

function ShowHideSolution({ children }) {
    const [isHidden, setIsHidden] = useState(true);

    return (
        <div>
            <button
                onClick={() => setIsHidden(!isHidden)}
                style={{
                    background: "var(--comp-text)",
                    color: "var(--comp-surface)",
                    cursor: "pointer",
                    padding: "6px 12px",
                    border: "none",
                    borderRadius: "9px",
                    fontWeight: 500,
                    fontSize: "13px",
                }}
            >
                {isHidden ? "Show Solution" : "Hide Solution"}
            </button>
            {!isHidden && children}
        </div>
    );
}

export { ShowHideSolution };
