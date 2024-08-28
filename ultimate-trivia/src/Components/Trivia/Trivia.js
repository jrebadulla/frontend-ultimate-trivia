import React, { useState, useEffect, useRef } from "react";
import "./Trivia.css";
import Crow from "../Image/crow.jpg";
import butterfly1 from "../Image/butterfly1.jpeg";
import butterfly2 from "../Image/butterfly2.jpg";
import eagel1 from "../Image/eagel1.jpg";
import eagel3 from "../Image/eagel3.jpg";
import cloner from "../Image/elk_cloner.png";
import Fox from "../Image/fireFox5.png";
import Google from "../Image/Google.png";
import Martin from "../Image/matin1.png";

const Trivia = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);
  const listRef = useRef(null);
  const runningTimeRef = useRef(null);
  const timeRunning = 3000;
  const timeAutoNext = 50000;

  useEffect(() => {
    const nextBtn = carouselRef.current.querySelector(".next");
    const prevBtn = carouselRef.current.querySelector(".prev");
    const runningTime = runningTimeRef.current;

    let runTimeOut;
    let runNextAuto = setTimeout(() => {
      nextBtn.click();
    }, timeAutoNext);

    const resetTimeAnimation = () => {
      runningTime.style.animation = "none";
      void runningTime.offsetHeight; /* trigger reflow */
      runningTime.style.animation = "runningTime 7s linear 1 forwards";
    };
    const showSlider = (type) => {
      const sliderItemsDom = listRef.current.querySelectorAll(".item");
      if (type === "next") {
        listRef.current.appendChild(sliderItemsDom[0]);
        carouselRef.current.classList.add("next");
      } else {
        listRef.current.prepend(sliderItemsDom[sliderItemsDom.length - 1]);
        carouselRef.current.classList.add("prev");
      }

      clearTimeout(runTimeOut);

      runTimeOut = setTimeout(() => {
        carouselRef.current.classList.remove("next");
        carouselRef.current.classList.remove("prev");
      }, timeRunning);

      clearTimeout(runNextAuto);
      runNextAuto = setTimeout(() => {
        nextBtn.click();
      }, timeAutoNext);

      resetTimeAnimation();
    };

    nextBtn.onclick = () => {
      showSlider("next");
    };

    prevBtn.onclick = () => {
      showSlider("prev");
    };

    // Start the initial animation
    resetTimeAnimation();

    // Cleanup on unmount
    return () => {
      clearTimeout(runTimeOut);
      clearTimeout(runNextAuto);
    };
  }, [currentSlide]);

  const items = [
    {
      name: "Firefox ",
      image: Fox,
      title: "  The Firefox logo isn't a fox It's actually a red panda.",
      description:
        "It’s a common misbelief that the Firefox logo is a fox (I mean… it is in the name), but it is actually a red panda!.",
    },
    {
      name: "Google",
      image: Google,
      title: "Google's First Tweet was in binary.",
      description:
        "Google’s first tweet was in 2009, and it was gibberish to most. Translated from binary to English, it reads, “I’m feeling lucky”.",
    },
    {
      name: "Martin Cooper",
      image: Martin,
      title:
        "Motorola produced the first handheld mobile phoneand their first phone call was to their rival.",
      description:
        "On April 3, 1973, Martin Cooper, a Motorola researcher and executive, made the first mobile telephone call from handheld subscriber equipment, placing a call to Dr. Joel S. Engel of Bell Labs (AT&T), his rival.",
    },
    {
      name: "Martin Cooper",
      image: Martin,
      title:
        "Motorola produced the first handheld mobile phoneand their first phone call was to their rival.",
      description:
        "On April 3, 1973, Martin Cooper, a Motorola researcher and executive, made the first mobile telephone call from handheld subscriber equipment, placing a call to Dr. Joel S. Engel of Bell Labs (AT&T), his rival.",
    },
    {
      name: "Martin Cooper",
      image: Crow,
      title:
        "Motorola produced the first handheld mobile phoneand their first phone call was to their rival.",
      description:
        "On April 3, 1973, Martin Cooper, a Motorola researcher and executive, made the first mobile telephone call from handheld subscriber equipment, placing a call to Dr. Joel S. Engel of Bell Labs (AT&T), his rival.",
    },
    {
      name: "Martin Cooper",
      image: Martin,
      title:
        "Motorola produced the first handheld mobile phoneand their first phone call was to their rival.",
      description:
        "On April 3, 1973, Martin Cooper, a Motorola researcher and executive, made the first mobile telephone call from handheld subscriber equipment, placing a call to Dr. Joel S. Engel of Bell Labs (AT&T), his rival.",
    },
    {
      name: "Martin Cooper",
      image: Martin,
      title:
        "Motorola produced the first handheld mobile phoneand their first phone call was to their rival.",
      description:
        "On April 3, 1973, Martin Cooper, a Motorola researcher and executive, made the first mobile telephone call from handheld subscriber equipment, placing a call to Dr. Joel S. Engel of Bell Labs (AT&T), his rival.",
    },
  ];

  return (
    <>
      <div className="carousel" ref={carouselRef}>
        <div className="list" ref={listRef}>
          {items.map((item, index) => (
            <div
              className="item"
              key={index}
              style={{ backgroundImage: `url(${item.image})` }}
            >
              <div className="content">
                <div className="content-inner">
                  <div className="title">Trivia</div>
                  <div className="name">{item.name}</div>
                  <div className="des">{item.title}
                  <div className="des">{item.description}</div>
                  </div>
               
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="arrows">
          <button className="prev">{"<"}</button>
          <button className="next">{">"}</button>
        </div>

        <div className="timeRunning" ref={runningTimeRef}></div>
      </div>
    </>
  );
};

export default Trivia;
