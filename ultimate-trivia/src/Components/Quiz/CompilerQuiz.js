import React, { useState, useEffect } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import "./CompilerQuiz.css";

const CompilerQuiz = () => {
  const [question, setQuestion] = useState(null);
  const [userCode, setUserCode] = useState("");
  const [output, setOutput] = useState("");
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userId = user.user_id;
  const levelId = user.level_id;
  const gameId = 6;
  const baseURL = "http://3.107.73.113";

  useEffect(() => {
    axios
      .get(`${baseURL}/api/quiz-questions`, {
        params: { game_id: gameId },
      })
      .then((response) => {
        const fetchedQuestions = response.data;
        setQuestions(fetchedQuestions);
        setQuestion(fetchedQuestions[0]);
      })
      .catch((error) => {
        console.error("Error fetching the questions:", error);
      });
  }, [gameId]);

  useEffect(() => {
    if (questions.length > 0) {
      setQuestion(questions[currentQuestionIndex]);
    }
  }, [currentQuestionIndex, questions]);

  useEffect(() => {
    if (gameOver) {
      saveUserScore(score); 
    }
  }, [gameOver, score]);

  const handleCompile = () => {
    if (question) {
      const simulatedOutput = userCode.includes(question.correct_answer)
        ? "Correct Output"
        : "Incorrect Output";
      setOutput(simulatedOutput);

      if (userCode.includes(question.correct_answer)) {
        setScore((prevScore) => prevScore + 1); 
      }
    }
  };

  const handleSubmit = () => {
    handleCompile();

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setGameOver(true); 
    }
  };

  const saveUserScore = async (finalScore) => {
    try {
      await axios.post(`${baseURL}/api/saveUserScore`, {
        user_id: userId,
        game_id: gameId,
        score: finalScore, 
        level: levelId,
      });
      console.log("Score saved successfully");
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  const restartGame = () => {
    axios
      .get(`${baseURL}/api/quiz-questions`, {
        params: { game_id: gameId },
      })
      .then((response) => {
        const fetchedQuestions = response.data;
        setQuestions(fetchedQuestions);
        setCurrentQuestionIndex(0);
        setQuestion(fetchedQuestions[0]);
        setUserCode("");
        setOutput("");
        setScore(0);
        setGameOver(false);
      })
      .catch((error) => {
        console.error("Error fetching the questions on restart:", error);
      });
  };

  if (!question) {
    return <div>Loading...</div>;
  }

  return (
    <div className="compiler-quiz-container">
      {!gameOver ? (
        <div className="compiler-quiz-content">
          <div className="compiler-header">
            <h2>Compiler Quiz</h2>
            <p className="question-text">{question.question_text}</p>
          </div>
          <div className="compiler-layout">
            <div className="compiler-editor">
              <Editor
                height="100%" 
                language="java" 
                value={userCode}
                onChange={(value) => setUserCode(value || "")}
                theme="vs-dark"
              />
              <button onClick={handleSubmit} className="submit-button">
                Submit
              </button>
            </div>
            <div className="compiler-output">
              <h3>Output:</h3>
              <pre>{output}</pre>
            </div>
          </div>
        </div>
      ) : (
        <div className="game-over-container">
          <div className="game-over-header">Game Over!</div>
          <div className="game-over-score">Final Score: {score}</div>
          <button onClick={restartGame} className="restart-button">
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default CompilerQuiz;
