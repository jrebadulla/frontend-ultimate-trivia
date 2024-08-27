import React, { useState } from "react";
import "./DashboardLayout.css";
import Logo from "../Image/trivia-logo.png";
import Trivia from "../Trivia/Trivia";
import Tutorials from "../../Tutorial/Tutorial";
import QuizGame from "../QuizGame/QuizGame";

const DashboardLayout = () => {
  const [activeComponent, setActiveComponent] = useState("trivia");

  const handleTriviaClick = () => {
    setActiveComponent("trivia");
  };

  const handleTutorialClick = () => {
    setActiveComponent("tutorial");
  };

  const handleQuizClick = () => {
    setActiveComponent("quiz");
  };

  return (
    <div className="dashboard-container">
      <div className="header-container">
        <img src={Logo} alt="Ultimate Trivia Logo" />
        <h3>Ultimate Trivia</h3>
        <div className="links">
          <a href="#!" onClick={handleTriviaClick}>Trivia</a>
          <a href="#!" onClick={handleTutorialClick}>Tutorials</a>
          <a href="#!" onClick={handleQuizClick}>Quiz</a>
        </div>
        <button>Logout</button>
      </div>
      <div className="content">
        {activeComponent === "trivia" && <Trivia />}
        {activeComponent === "tutorial" && <Tutorials />}
        {activeComponent === "quiz" && <QuizGame />}
      </div>
   </div>
  );
};

export default DashboardLayout;
