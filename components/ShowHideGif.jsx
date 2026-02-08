import React, { useState } from "react";
function ShowHideGif({ gifUrl, pausedGifUrl }) {
    const [isPlaying, setIsPlaying] = useState(true);
    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <img
                style={{ height: "280", width: "280", cursor: "pointer" }}
                src={isPlaying ? gifUrl : pausedGifUrl}
                alt="GIF"
                onClick={togglePlay}
            />
        </div>
    );
}

export { ShowHideGif };
