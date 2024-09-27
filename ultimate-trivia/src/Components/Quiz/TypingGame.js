import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TypingGame.css"; 

const TypingGame = () => {
  const [snippet, setSnippet] = useState("");
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timeTaken, setTimeTaken] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [gameFinished, setGameFinished] = useState(false); 
  const [userScore, setUserScore] = useState(0); 
  const [currentDay, setCurrentDay] = useState(""); 
  const [currentQuestion, setCurrentQuestion] = useState(null); 

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userId = user.user_id;
  const levelId = user.level_id;
  const gameId = 9;
  const baseURL = "http://3.107.73.113"; 

  // Sound effect
  const typingSound = new Audio("/sounds/type-sound.mp3");

  // Fetch questions and set current day
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; 
    setCurrentDay(today);

    axios
      .get(`${baseURL}/api/quiz-questions`, {
        params: { game_id: gameId },
      })
      .then((response) => {
        setQuestions(response.data);
        const randomQuestion = response.data[Math.floor(Math.random() * response.data.length)];
        setSnippet(randomQuestion.question_text); 
        setCurrentQuestion(randomQuestion); 
      })
      .catch((error) => {
        console.error("Error fetching snippets:", error);
      });
  }, [gameId, baseURL]);

  const handleInputChange = (e) => {
    const value = e.target.value;

    // Play typing sound on key press
    if (value.length > userInput.length) {
      typingSound.play();
    }

    if (!startTime) {
      setStartTime(Date.now());
    }

    const matchingChars = value
      .split("")
      .filter((char, i) => char === snippet[i]).length;
    setAccuracy((matchingChars / snippet.length) * 100);
    
    setUserInput(value);

    if (value === snippet && !gameFinished) {
      const endTimeValue = Date.now();
      setEndTime(endTimeValue); 
      setTimeTaken((endTimeValue - startTime) / 1000); 
      const calculatedScore = calculateScore(); 
      setUserScore(calculatedScore); 

      setGameFinished(true); 
      saveUserAnswer(value); 
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
    setEndTime(null); 
    setGameFinished(false); 
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    setSnippet(randomQuestion.question_text);
    setCurrentQuestion(randomQuestion); 
  };

  const calculateScore = () => {
    return accuracy ? Math.round(accuracy) : 0;
  };

  const calculatePlaytime = (endTimeValue) => {
    if (startTime && endTimeValue) {
      return Math.floor((endTimeValue - startTime) / 1000); 
    }
    return 0;
  };

  const saveUserScore = async (calculatedScore, endTimeValue) => {
    const playtime = calculatePlaytime(endTimeValue); 
    
    try {
      await axios.post(`${baseURL}/api/saveUserScore`, {
        user_id: userId,
        game_id: gameId,
        level: levelId,
        score: calculatedScore,
        day: currentDay, 
        playtime: playtime, 
      });

      console.log("Score, playtime, and day saved successfully");
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  const saveUserAnswer = async (userAnswer) => {
    try {
      await axios.post(`${baseURL}/api/user-answers`, {
        user_id: userId,
        game_id: gameId,
        question_id: currentQuestion.question_id,
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
