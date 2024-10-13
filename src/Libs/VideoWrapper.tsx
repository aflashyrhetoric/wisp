import React, { useRef } from "react";
import videojs from "video.js";

// This imports the functional component from the previous sample.
import VideoPlayer from "./VideoPlayer";

export const VideoWrapper = ({ src }: { src: string }) => {
  const playerRef = useRef(null);

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: false,
    fluid: true,
    loop: true,
    sources: [
      {
        src,
        type: "video/mp4",
      },
    ],
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };

  return (
    <>
      <VideoPlayer options={videoJsOptions} onReady={handlePlayerReady} />
    </>
  );
};
