import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const UserRadarChartWithSuggestions = () => {
  const [chartData, setChartData] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/user-difficulty') 
      .then(response => {
        const data = response.data;

        const labels = data.map(item => item.game_name);
        const conversionRates = data.map(item => parseFloat(item.conversion_rate));

        setChartData({
          labels: labels,
          datasets: [{
            label: 'Conversion Rate (%)',
            data: conversionRates,
            backgroundColor: 'rgba(255, 99, 132, 0.3)',  
            borderColor: '#FF6384',  
            pointBackgroundColor: '#FF6384', 
            borderWidth: 2,
            pointRadius: 3, 
            fill: true, 
          },
          {
            label: 'Difficulty Score',
            data: conversionRates.map(rate => 100 - rate),  
            backgroundColor: 'rgba(54, 162, 235, 0.3)', 
            borderColor: '#36A2EB', 
            pointBackgroundColor: '#36A2EB', 
            borderWidth: 2,
            pointRadius: 3,
            fill: true, 
          }]
        });

        const newSuggestions = data.map(item => {
          const conversionRate = parseFloat(item.conversion_rate);
          const quizName = item.game_name;

          if (conversionRate >= 80) {
            return `You are good in ${quizName}, keep it up!`;
          } else if (conversionRate >= 50) {
            return `You are doing well in ${quizName}, but there's room for improvement.`;
          } else {
            return `Keep practicing in ${quizName}, you'll get better!`;
          }
        });

        setSuggestions(newSuggestions);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div style={{
      display: 'flex', 
      justifyContent: 'space-between',  
      alignItems: 'center', 
      width: '100%', 
      height: '88vh', 
      backgroundColor: '#1E1E1E',  
      padding: '20px',
    }}>
      <div style={{
        width: '55%',  
        height: '100%',
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {chartData ? (
          <Radar
            data={chartData}
            options={{
              maintainAspectRatio: false,
              scales: {
                r: {
                  angleLines: {
                    color: '#4CAF50',  
                  },
                  grid: {
                    color: '#4CAF50',  
                  },
                  ticks: {
                    display: false,  
                  },
                  pointLabels: {
                    color: '#FFF', 
                    font: {
                      size: 16,  
                      family: 'Arial', 
                    }
                  }
                }
              },
              elements: {
                line: {
                  borderWidth: 2,
                },
                point: {
                  radius: 4, 
                }
              },
              plugins: {
                legend: {
                  position: 'top',
                  labels: {
                    color: 'white', 
                    font: {
                      size: 14,  
                    },
                    padding: 20 
                  }
                }
              }
            }}
          />
        ) : (
          <p style={{ color: 'white' }}>Loading chart...</p>
        )}
      </div>

      <div style={{
        width: '40%', 
        color: '#FFF',  
        paddingLeft: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',  
        height: '100%',
      }}>
        <h3 style={{
          fontSize: '24px',  
          fontWeight: 'bold',
          marginBottom: '20px', 
        }}>Performance Suggestions</h3>
        <ul style={{
          listStyleType: 'none', 
          paddingLeft: 0,
          lineHeight: '1.8',  
        }}>
          {suggestions.map((suggestion, index) => (
            <li key={index} style={{
              marginBottom: '10px', 
              fontSize: '18px',  
            }}>
              {suggestion}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserRadarChartWithSuggestions;
