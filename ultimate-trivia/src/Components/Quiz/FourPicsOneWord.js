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
  const [quizFinished, setQuizFinished] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userId = user.user_id;
  const levelId = user.level_id;
  const gameId = 5;
  const baseURL = "http://127.0.0.1:8000";

  useEffect(() => {
    axios
      .get(`${baseURL}/api/quiz-questions`, { params: { game_id: gameId } })
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

  const handleLetterChange = (index, letter) => {
    const newAnswer = userAnswer.split("");
    newAnswer[index] = letter;
    setUserAnswer(newAnswer.join(""));
  };

  const handleSubmitAnswer = () => {
    if (quizFinished) {
      return;
    }

    if (
      correctAnswer &&
      userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase()
    ) {
      setGameStatus("Correct!");
      setInputClass("correct");

      const newScore = score + 1;
      setScore(newScore);
      setShowScore(true);

      setTimeout(() => {
        if (currentQuestionIndex + 1 < questions.length) {
          const nextQuestion = questions[currentQuestionIndex + 1];
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
          setCorrectAnswer(nextQuestion?.correct_answer || "");
          setUserAnswer("");
          setShowScore(false);
        } else {
          setGameStatus("Game Over!");
          setInputClass("");
          setQuizFinished(true);
          saveUserScore(newScore);
        }
      }, 1000);
    } else {
      setGameStatus("Wrong! Try Again.");
      setInputClass("incorrect");
      setShowScore(true);
    }
  };

  const saveUserScore = async (updatedScore) => {
    try {
      await axios.post(`${baseURL}/api/saveUserScore`, {
        user_id: userId,
        game_id: gameId,
        score: updatedScore,
        level: levelId,
      });
      console.log("Score saved successfully");
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  if (questions.length === 0) {
    return <div className="FourPic-question-container">Loading...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answerLength = correctAnswer.length;

  return (
    <div className="quiz-modal active">
    <div className="FourPic-question-container">
      <div className="FourPic-container">
        <div>
          <p className="modal-header">Level {currentQuestionIndex + 1}</p>
        </div>
        <p className="fourPic-score">Score: {score}</p>
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
        <div className="FourPic-answer-boxes">
          {Array.from({ length: answerLength }).map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={userAnswer[index] || ""}
              onChange={(e) => handleLetterChange(index, e.target.value)}
              className={`FourPic-answer-box ${inputClass}`}
            />
          ))}
        </div>
        <button
          className="FourPic-submit-button"
          onClick={handleSubmitAnswer}
          disabled={userAnswer.length < answerLength}
        >
          Submit
        </button>
        {showScore && (
          <div className="FourPic-status-message">{gameStatus} </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default FourPicsOneWord;
