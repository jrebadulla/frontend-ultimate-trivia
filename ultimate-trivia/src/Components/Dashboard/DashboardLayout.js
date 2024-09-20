import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DashboardLayout.css";
import Logo from "../Image/trivia-logo.png";
import Trivia from "../Trivia/Trivia";
import Tutorials from "../../Tutorial/Tutorial";
import QuizDashboard from "../Quiz/QuizDashboard";
import Compiler from "../../Compiler/Compiler";
import theme from "./Theme.js";

import { ChakraProvider, Box } from "@chakra-ui/react";
import UserRadarChartWithSuggestions from "../DataVisualization/DataVisualization.js";

const DashboardLayout = () => {
  const [activeComponent, setActiveComponent] = useState("trivia");
  const [user, setUser] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const [maxPossibleScore, setMaxPossibleScore] = useState(0);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      fetchUserProgress(storedUser.user_id);
    }
  }, []);

  const fetchUserProgress = async (userId) => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/users-score",
        {
          params: { user_id: userId },
        }
      );
      setTotalScore(response.data.total_score);
      setMaxPossibleScore(response.data.max_possible_score);
    } catch (error) {
      console.error("Error fetching user progress:", error);
    }
  };

  const handleTriviaClick = () => {
    setActiveComponent("trivia");
  };

  const handleTutorialClick = () => {
    setActiveComponent("tutorial");
  };

  const handleQuizClick = () => {
    setActiveComponent("quiz");
  };

  const handleCompilerClick = () => {
    setActiveComponent("compiler");
  };

  const handleVisualizationClick = () => {
    setActiveComponent("visualization");
  };

  const progressPercentage =
    maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;

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
          <a href="#!" onClick={handleCompilerClick} color="teal.500">
            Compiler
          </a>
          <a href="#!" onClick={handleVisualizationClick} color="teal.500">
            Visualization
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
                      strokeDasharray: 188.4,
                      strokeDashoffset:
                        188.4 - 188.4 * (progressPercentage / 100),
                    }}
                  />
                  <text x="35" y="35" className="progress-text">
                    {Math.round(progressPercentage)}%
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
        {activeComponent === "compiler" && (
          <ChakraProvider theme={theme}>
            <Box minH="100vh" bg="#0f0a19" color="gray.500" px={6} py={8}>
              <Compiler />
            </Box>
          </ChakraProvider>
        )}
        {activeComponent === "visualization" && <UserRadarChartWithSuggestions />}
      </div>
    </div>
  );
};

export default DashboardLayout;
