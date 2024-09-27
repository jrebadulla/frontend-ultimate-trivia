import React, { useEffect, useState } from "react";
import axios from "axios";
import { Radar, Line } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  LinearScale,
  CategoryScale,
} from "chart.js";

// Register the chart components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  LinearScale,
  CategoryScale
);

const UserRadarChartWithSuggestions = () => {
  const [chartData, setChartData] = useState(null);
  const [timeData, setTimeData] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [noData, setNoData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      const user = JSON.parse(localStorage.getItem("user")) || {};
      const userId = user.user_id;
      try {
        const response = await axios.get(
          "http://3.107.73.113/api/user-difficulty",
          {
            params: { user_id: userId },
          }
        );
        const data = response.data;
        if (!data || data.length === 0) {
          setNoData(true);
        } else {
          processChartData(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setNoData(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Process chart data
  const processChartData = (data) => {
    if (!data || data.length === 0) {
      setNoData(true);
      return;
    }

    const labels = data.map((item) => item.game_name);
    const conversionRates = data.map((item) => parseFloat(item.conversion_rate));
    const times = data.map((item) => (item.session_length ? (item.session_length / 60).toFixed(2) : 0));

    // Check if data exists before setting chart data
    if (conversionRates.length > 0 && times.length > 0) {
      setChartData({
        labels,
        datasets: [
          {
            label: "Conversion Rate (%)",
            data: conversionRates,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "#FF6384",
            pointBackgroundColor: "#FF6384",
            borderWidth: 2,
            pointRadius: 3,
            fill: true,
          },
          {
            label: "Difficulty Score",
            data: conversionRates.map((rate) => 100 - rate),
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "#36A2EB",
            pointBackgroundColor: "#36A2EB",
            borderWidth: 2,
            pointRadius: 3,
            fill: true,
          },
        ],
      });

      setTimeData({
        labels,
        datasets: [
          {
            label: "Time in Game (minutes)",
            data: times,
            borderColor: "#4BC0C0",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: true,
            tension: 0.4,
          },
        ],
      });
    } else {
      setNoData(true);
    }

    // Set suggestions based on conversion rates
    setSuggestions(
      data.map((item) => {
        const conversionRate = parseFloat(item.conversion_rate);
        const quizName = item.game_name;
        return conversionRate >= 80
          ? `You are good in ${quizName}, keep it up!`
          : conversionRate >= 50
          ? `You are doing well in ${quizName}, but there's room for improvement.`
          : `Keep practicing in ${quizName}, you'll get better!`;
      })
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (noData) {
    return (
      <div>
        No data available. Please play a quiz to see performance metrics.
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100vh",
        backgroundColor: "#282c34",
        padding: "20px",
      }}
    >
      <div style={{ flex: 1, display: "flex", justifyContent: "space-between" }}>
        <div
          style={{
            width: "60%",
            padding: "20px",
            backgroundColor: "#1e1e2e",
            borderRadius: "8px",
          }}
        >
          {chartData && (
            <Radar
              data={chartData}
              options={{
                maintainAspectRatio: false,
                scales: {
                  r: {
                    angleLines: { color: "rgba(255, 255, 255, 0.5)" },
                    grid: { color: "rgba(255, 255, 255, 0.2)" },
                    ticks: { display: false },
                    pointLabels: {
                      color: "rgba(255, 255, 255, 0.8)",
                      font: { size: 14 },
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 2,
                    borderColor: "rgba(255, 255, 255, 0.8)",
                  },
                  point: {
                    radius: 4,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                  },
                },
                plugins: {
                  legend: {
                    labels: {
                      color: "white",
                      font: {
                        size: 14,
                      },
                      padding: 20,
                    },
                  },
                  tooltip: {
                    enabled: true,
                    mode: "index",
                    intersect: false,
                    // Tooltip callbacks removed for now
                  },
                },
              }}
            />
          )}
        </div>
        <div
          style={{
            width: "38%",
            padding: "20px",
            backgroundColor: "#1e1e2e",
            borderRadius: "8px",
          }}
        >
          {timeData && (
            <Line
              data={timeData}
              options={{
                responsive: true,
                scales: {
                  y: { beginAtZero: true, ticks: { color: "#ffffff" } },
                  x: { ticks: { color: "#ffffff" } },
                },
                plugins: { legend: { labels: { color: "#ffffff" } } },
              }}
            />
          )}
        </div>
      </div>
      <div
        style={{
          width: "100%",
          padding: "20px",
          backgroundColor: "#1e1e2e",
          borderRadius: "8px",
          marginTop: "20px",
        }}
      >
        <h2
          style={{ color: "white", textAlign: "center", marginBottom: "20px" }}
        >
          Performance Suggestions
        </h2>
        <ul style={{ listStyle: "none", padding: 0, textAlign: "center" }}>
          {suggestions.map((suggestion, index) => (
            <li key={index} style={{ color: "white", marginBottom: "10px" }}>
              {suggestion}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserRadarChartWithSuggestions;
