import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TypingGame.css"; 

const TypingGame = () => {
  const [snippet, setSnippet] = useState("");
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [timeTaken, setTimeTaken] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [gameFinished, setGameFinished] = useState(false); 
  const [userScore, setUserScore] = useState(0); 

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userId = user.user_id;
  const gameId = 4; 

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/quiz-questions", {
        params: {
          game_id: gameId,
        },
      })
      .then((response) => {
        setQuestions(response.data);
        const randomQuestion = response.data[Math.floor(Math.random() * response.data.length)];
        setSnippet(randomQuestion.question_text); 
      })
      .catch((error) => {
        console.error("Error fetching snippets:", error);
      });
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;

    if (!startTime) {
      setStartTime(Date.now());
    }

    if (value === snippet) {
      const endTime = Date.now();
      setTimeTaken((endTime - startTime) / 1000);
      setGameFinished(true); 
      const calculatedScore = calculateScore(); 
      setUserScore(calculatedScore); 
      saveUserScore(calculatedScore); 
    }

    const matchingChars = value
      .split("")
      .filter((char, i) => char === snippet[i]).length;
    setAccuracy((matchingChars / snippet.length) * 100);

    setUserInput(value);
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
    setGameFinished(false);
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    setSnippet(randomQuestion.question_text);
  };

  const calculateScore = () => {
    return accuracy ? Math.round(accuracy) : 0;
  };

  const saveUserScore = async (calculatedScore) => {
    try {
      await axios.post("http://127.0.0.1:8000/api/saveUserScore", {
        user_id: userId,
        game_id: gameId,
        score: calculatedScore,
      });

      console.log("Score saved successfully");
    } catch (error) {
      console.error("Error saving score:", error);
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
