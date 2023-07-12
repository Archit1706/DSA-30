import React, { useState } from "react";
function ShowHideGif({ gifUrl, pausedGifUrl }) {
    // const gifUrl = "https://i.giphy.com/media/3ov9jQX2Ow4bM5xxuM/giphy.webp";
    const [isPlaying, setIsPlaying] = useState(true);

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    // Replace the pausedGifUrl with the URL of the paused GIF
    // const pausedGifUrl = "/assets/recursion-gif.jpg";

    return (
        <div
            style={{
                display: "flex",
                "justify-content": "center",
                "align-items": "center",
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
