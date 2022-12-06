import React, { useRef } from "react";
import YouTube from "react-youtube";

export const YoutubePlayer = ({ id, playNext, playPrevious }) => {
  id = "5eSlSDEpZic";
  const playerRef = useRef(null);

  const playerOptions = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 0,
      controls: 0,
      fs: 0,
      rel: 0,
      modestbranding: 1,
      playsinline: 1,
    },
  };

  function onPlayerReady(event) {
    playerRef.current = event.target;
  }

  // THIS IS OUR EVENT HANDLER FOR WHEN THE YOUTUBE PLAYER'S STATE
  // CHANGES. NOTE THAT playerStatus WILL HAVE A DIFFERENT INTEGER
  // VALUE TO REPRESENT THE TYPE OF STATE CHANGE. A playerStatus
  // VALUE OF 0 MEANS THE SONG PLAYING HAS ENDED.
  function onPlayerStateChange(event) {
    let playerStatus = event.data;
    if (playerStatus === -1) {
      // VIDEO UNSTARTED
      console.debug("-1 Video unstarted");
    } else if (playerStatus === 0) {
      // THE VIDEO HAS COMPLETED PLAYING
      console.debug("0 Video ended");
    } else if (playerStatus === 1) {
      // THE VIDEO IS PLAYED
      console.debug("1 Video played");
    } else if (playerStatus === 2) {
      // THE VIDEO IS PAUSED
      console.debug("2 Video paused");
    } else if (playerStatus === 3) {
      // THE VIDEO IS BUFFERING
      console.debug("3 Video buffering");
    } else if (playerStatus === 5) {
      // THE VIDEO HAS BEEN CUED
      console.debug("5 Video cued");
    }
  }

  const onPlay = () => {
    playerRef.current.playVideo();
  };

  const onPause = () => {
    playerRef.current.pauseVideo();
  };

  return (
    <div>
      <YouTube
        videoId={id}
        opts={playerOptions}
        onReady={onPlayerReady}
        onStateChange={onPlayerStateChange}
        onEnd={playNext}
      />
      <div>
        <button onClick={playPrevious}>Previous</button>
        <button onClick={onPlay}>Play</button>
        <button onClick={onPause}>Pause</button>
        <button onClick={playNext}>Next</button>
      </div>
    </div>
  );
};
