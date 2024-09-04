import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DashboardLayout.css";
import Logo from "../Image/trivia-logo.png";
import Trivia from "../Trivia/Trivia";
import Tutorials from "../../Tutorial/Tutorial";
import QuizDashboard from "../Quiz/QuizDashboard";

const DashboardLayout = () => {
  const [activeComponent, setActiveComponent] = useState("trivia");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      console.log("User from localStorage:", storedUser);
    } else {
      console.log("No user found in localStorage");
    }
  }, []);

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
          <a href="#!" onClick={handleTriviaClick}>
            Trivia
          </a>
          <a href="#!" onClick={handleTutorialClick}>
            Tutorials
          </a>
          <a href="#!" onClick={handleQuizClick}>
            Quiz
          </a>
        </div>
        <div className="profile-container">
          {user ? (
            <>
              <p className="username">
                {user.firstname} {user.lastname}
              </p>
              <div className="progress-container">
                <svg
                  className="progress-bar"
                  width="70"
                  height="70"
                  viewBox="0 0 70 70"
                >
                  <circle
                    cx="35"
                    cy="35"
                    r="30"
                    className="progress-bg"
                    strokeWidth="5"
                    fill="none"
                  />
                  <circle
                    cx="35"
                    cy="35"
                    r="30"
                    className="progress"
                    strokeWidth="5"
                    fill="none"
                    style={{
                      strokeDasharray: 188.4, // Circumference of the circle
                      strokeDashoffset: 188.4 - 188.4 * 0.5, // Example for 50% progress
                    }}
                  />
                  <text x="35" y="35" className="progress-text">
                    50%
                  </text>
                </svg>
              </div>
            </>
          ) : (
            <p>Loading user data...</p>
          )}
        </div>
      </div>
      <div className="content">
        {activeComponent === "trivia" && <Trivia />}
        {activeComponent === "tutorial" && <Tutorials />}
        {activeComponent === "quiz" && <QuizDashboard />}
      </div>
    </div>
  );
};

export default DashboardLayout;
