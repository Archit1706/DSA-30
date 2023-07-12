import React, { useState } from "react";

function ShowHideSolution({ children }) {
    const [isHidden, setIsHidden] = useState(true);

    const toggleVisibility = () => {
        setIsHidden(!isHidden);
    };

    const buttonStyle = {
        background: "black",
        color: "white",
        cursor: "pointer",
        padding: "6px 12px",
        border: "none",
        borderRadius: "9px",
    };

    return (
        <div>
            <button style={buttonStyle} onClick={toggleVisibility}>
                {isHidden ? "Show Solution" : "Hide Solution"}
            </button>
            {!isHidden && children}
        </div>
    );
}

export { ShowHideSolution };
