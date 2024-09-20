import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TypingGame.css"; 

const TypingGame = () => {
  const [snippet, setSnippet] = useState("");
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null); // Track end time
  const [timeTaken, setTimeTaken] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [gameFinished, setGameFinished] = useState(false); 
  const [userScore, setUserScore] = useState(0); 
  const [currentDay, setCurrentDay] = useState(""); // Track current day
  const [currentQuestion, setCurrentQuestion] = useState(null); // Track current question

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userId = user.user_id;
  const levelId = user.level_id;
  const gameId = 9; // Example Game ID
  const baseURL = "http://127.0.0.1:8000"; // Replace with your actual API URL

  // Fetch questions and set current day
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // Set current day
    setCurrentDay(today);

    axios
      .get(`${baseURL}/api/quiz-questions`, {
        params: { game_id: gameId },
      })
      .then((response) => {
        setQuestions(response.data);
        const randomQuestion = response.data[Math.floor(Math.random() * response.data.length)];
        setSnippet(randomQuestion.question_text); 
        setCurrentQuestion(randomQuestion); // Store current question details
      })
      .catch((error) => {
        console.error("Error fetching snippets:", error);
      });
  }, [gameId, baseURL]);

  const handleInputChange = (e) => {
    const value = e.target.value;

    // Start the timer when the user starts typing
    if (!startTime) {
      setStartTime(Date.now());
    }

    // Calculate accuracy as the user types
    const matchingChars = value
      .split("")
      .filter((char, i) => char === snippet[i]).length;
    setAccuracy((matchingChars / snippet.length) * 100);
    
    setUserInput(value);

    // If the user finishes typing the entire snippet correctly
    if (value === snippet && !gameFinished) {
      const endTimeValue = Date.now();
      setEndTime(endTimeValue); // Capture end time when finished
      setTimeTaken((endTimeValue - startTime) / 1000); // Calculate time taken in seconds
      const calculatedScore = calculateScore(); 
      setUserScore(calculatedScore); 

      // Set game as finished to prevent multiple submissions
      setGameFinished(true); 
      saveUserAnswer(value); // Save the user's completed answer

      // Calculate and save user score and playtime
      saveUserScore(calculatedScore, endTimeValue);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault(); 
    alert("Pasting is not allowed! Please type the code.");
  };

  const resetGame = () => {
    setUserInput("");
    setTimeTaken(null);
    setAccuracy(null);
    setStartTime(null);
    setEndTime(null); // Reset end time when the game is reset
    setGameFinished(false); // Reset the game finished state
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    setSnippet(randomQuestion.question_text);
    setCurrentQuestion(randomQuestion); // Reset to a new random question
  };

  const calculateScore = () => {
    return accuracy ? Math.round(accuracy) : 0;
  };

  // Use startTime and endTime to calculate playtime
  const calculatePlaytime = (endTimeValue) => {
    if (startTime && endTimeValue) {
      return Math.floor((endTimeValue - startTime) / 1000); // Playtime in seconds
    }
    return 0; // Default to 0 if the playtime cannot be calculated
  };

  // Save user score to the server
  const saveUserScore = async (calculatedScore, endTimeValue) => {
    const playtime = calculatePlaytime(endTimeValue); // Calculate playtime based on the end time
    
    try {
      await axios.post(`${baseURL}/api/saveUserScore`, {
        user_id: userId,
        game_id: gameId,
        level: levelId,
        score: calculatedScore,
        day: currentDay, // Add the day field
        playtime: playtime, // Add playtime (in seconds)
      });

      console.log("Score, playtime, and day saved successfully");
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  // Save the user's answer
  const saveUserAnswer = async (userAnswer) => {
    try {
      await axios.post(`${baseURL}/api/user-answers`, {
        user_id: userId,
        game_id: gameId,
        question_id: currentQuestion.question_id, // Use the current question ID
        user_answer: userAnswer,
        correct_answer: currentQuestion.correct_answer,
        is_correct: userAnswer === currentQuestion.correct_answer,
      });

      console.log("User answer saved successfully");
    } catch (error) {
      console.error("Error saving user answer:", error);
    }
  };

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="quiz-modal active">
      <div className="typing-game">
        <h2>Type the Code Snippet Below</h2>
        <pre>{snippet}</pre>

        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          onPaste={handlePaste}
          placeholder="Start typing..."
          className="input-field"
        />

        {gameFinished && (
          <div className="results">
            <p>Time Taken: {timeTaken ? timeTaken.toFixed(2) : "N/A"} seconds</p>
            <p>Accuracy: {accuracy ? accuracy.toFixed(2) : "N/A"}%</p>
            <p>Score: {userScore}</p>
          </div>
        )}

        <button onClick={resetGame}>Reset</button>
      </div>
    </div>
  );
};

export default TypingGame;
