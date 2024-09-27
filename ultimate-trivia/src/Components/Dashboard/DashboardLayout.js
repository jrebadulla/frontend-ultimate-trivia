import React, { useEffect, useState } from "react";
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

  const handleCompilerClick = () => {
    setActiveComponent("compiler");
  };

  const handleVisualizationClick = () => {
    setActiveComponent("visualization");
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
            Quiz Game
          </a>
          <a href="#!" onClick={handleCompilerClick} color="teal.500">
            Compiler
          </a>
          <a href="#!" onClick={handleVisualizationClick} color="teal.500">
            Statistics
          </a>
        </div>
        <div className="profile-container">
          {user ? (
            <>
              <p className="username">
                {user.firstname} {user.lastname}
              </p>
              <img
                src={`http://3.107.73.113/${user.profile_picture}`}
                alt={`${user.firstname} ${user.lastname}'s Profile Picture`}
                className="profile-image"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
                onError={(e) => {
                  e.target.src = "/path/to/default-image.jpg";
                }}
              />
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
        {activeComponent === "visualization" && (
          <UserRadarChartWithSuggestions />
        )}
      </div>
    </div>
  );
};

export default DashboardLayout;
