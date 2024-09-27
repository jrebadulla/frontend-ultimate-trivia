import React, { useState, useRef } from "react";
import "./Tutorial.css";
import Js from "../Components/Videos/Js.mp4";

const videoData = [
  { src: Js, title: "Learn JavaScript" },
  { src: Js, title: "Learn CSS" },
  { src: Js, title: "Learn HTML" },
  { src: Js, title: "Learn React" },
  { src: Js, title: "Learn React" },
];

const Tutorials = () => {
  const videoRefs = useRef([]);
  const [isPlaying, setIsPlaying] = useState(videoData.map(() => false)); // Track play state for each video

  const toggleFullscreen = (index) => {
    const videoElement = videoRefs.current[index];
    if (videoElement) {
      if (!document.fullscreenElement) {
        videoElement
          .requestFullscreen()
          .catch((err) =>
            console.log(
              `Error attempting to enable fullscreen mode: ${err.message}`
            )
          );
      } else {
        document
          .exitFullscreen()
          .catch((err) =>
            console.log(
              `Error attempting to exit fullscreen mode: ${err.message}`
            )
          );
      }
    }
  };

  const handlePlay = (index) => {
    videoRefs.current[index].play();
    const updatedPlayState = [...isPlaying];
    updatedPlayState[index] = true; // Hide play button for the specific video
    setIsPlaying(updatedPlayState);
  };

  const handleVideoEnded = (index) => {
    const updatedPlayState = [...isPlaying];
    updatedPlayState[index] = false; // Show play button when video ends
    setIsPlaying(updatedPlayState);
  };

  return (
    <div className="tutorial-container">
      <h2>Tutorials</h2>
      <div className="video-container">
        {videoData.map((video, index) => (
          <div className="video-item" key={index}>
            <div className="video-wrapper">
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                controls
                poster="/path/to/your/thumbnail.png"
                onEnded={() => handleVideoEnded(index)} // Reset button visibility after video ends
              >
                <source src={video.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {!isPlaying[index] && ( // Conditionally render the play button based on play state
                <button
                  className="play-btn"
                  onClick={() => handlePlay(index)}
                >
                  ▶
                </button>
              )}
            </div>
            <p className="title-video">{video.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tutorials;
