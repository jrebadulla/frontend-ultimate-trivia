import React from "react";
import "./DashboardLayout.css";
import Logo from "../Image/trivia-logo.png";
import { Carousel } from "antd";

const DashboardLayout = () => {
  const contentStyle = {
    margin: 0,
    height: "400px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
  };

  return (
    <div className="dashboard-container">
      <div className="header-container">
        <img src={Logo} />
        <h3>Ultimate Trivia</h3>
        <div className="links">
          <a href="/dashboard">Trivia</a>
          <a href="/quiz">Quiz Game</a>
          <a href="/tutorials">Tutorials</a>
        </div>
        <button>Logout</button>
      </div>
    </div>
  );
};

export default DashboardLayout;
