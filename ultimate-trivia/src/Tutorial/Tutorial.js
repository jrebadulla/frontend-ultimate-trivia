import React, { useRef } from "react";
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
  const videoRef = useRef(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen()
        .catch(err => console.log(`Error attempting to enable fullscreen mode: ${err.message}`));
    } else {
      document.exitFullscreen()
        .catch(err => console.log(`Error attempting to exit fullscreen mode: ${err.message}`));
    }
  };

  return (
    <div className="tutorial-container">
      <h2>Tutorials</h2>
      <div className="video-container">
        {videoData.map((video, index) => (
          <div className="video-item" key={index}>
            <video ref={videoRef} controls>
              <source src={video.src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <p className="title-video">{video.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tutorials;
