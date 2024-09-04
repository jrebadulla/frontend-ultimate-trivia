import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FourPicsOneWord.css";

const FourPicsOneWord = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [gameStatus, setGameStatus] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [inputClass, setInputClass] = useState("");
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const gameId = 5;
    const baseURL = "http://127.0.0.1:8000/api/quiz-questions";

    axios
      .get(baseURL, { params: { game_id: gameId } })
      .then((response) => {
        const questionsData = response.data;
        setQuestions(questionsData);
        if (questionsData.length > 0) {
          setCorrectAnswer(questionsData[0].correct_answer);
        }
      })
      .catch((error) => {
        console.error("Error fetching the questions:", error);
      });
  }, []);

  const handleAnswerChange = (e) => {
    setUserAnswer(e.target.value);
  };

  const handleSubmitAnswer = () => {
    if (correctAnswer && userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase()) {
      setGameStatus("Correct!");
      setInputClass("correct");
      setScore(prevScore => prevScore + 1);
      setShowScore(true);
      setUserAnswer("");

      // Move to next question after a delay
      setTimeout(() => {
        if (currentQuestionIndex + 1 < questions.length) {
          const nextQuestion = questions[currentQuestionIndex + 1];
          setCurrentQuestionIndex(prevIndex => prevIndex + 1);
          setCorrectAnswer(nextQuestion?.correct_answer || "");
          setShowScore(false);
        } else {
          setGameStatus("Game Over!");
          setInputClass("");
        }
      }, 1000);

    } else {
      setGameStatus("Wrong! Try Again.");
      setInputClass("incorrect");
      setShowScore(true);
    }
  };

  if (questions.length === 0) {
    return <div className="FourPic-question-container">Loading...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const baseURL = "http://127.0.0.1:8000";

  return (
    <div className="FourPic-question-container">
      <div className="FourPic-container">
        <div className="FourPic-score">Score: {score}</div>
        <h2 className="FourPic-question-text">
          {currentQuestion.question_text}
        </h2>
        <div className="FourPic-images">
          {currentQuestion.image1 && (
            <img src={`${baseURL}${currentQuestion.image1}`} alt="Image 1" />
          )}
          {currentQuestion.image2 && (
            <img src={`${baseURL}${currentQuestion.image2}`} alt="Image 2" />
          )}
          {currentQuestion.image3 && (
            <img src={`${baseURL}${currentQuestion.image3}`} alt="Image 3" />
          )}
          {currentQuestion.image4 && (
            <img src={`${baseURL}${currentQuestion.image4}`} alt="Image 4" />
          )}
        </div>
        <input
          type="text"
          value={userAnswer}
          onChange={handleAnswerChange}
          placeholder="Type your answer here"
          className={`FourPic-answer-input ${inputClass}`}
        />
        <button
          className="FourPic-submit-button"
          onClick={handleSubmitAnswer}
          disabled={!userAnswer.trim()}
        >
          Submit
        </button>
        {showScore && (
          <div className="FourPic-status-message">
            {gameStatus} {gameStatus === "Correct!" && <span>Score: {score}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default FourPicsOneWord;
