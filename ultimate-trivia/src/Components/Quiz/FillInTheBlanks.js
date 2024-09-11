import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FillInTheBlanks.css";

const FillInTheBlank = () => {
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [quizFinished, setQuizFinished] = useState(false);
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userId = user.user_id;
  const level_id = user.level_id;
  const gameId = 7;

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/quiz-questions", {
        params: {
          game_id: gameId,
        },
      })
      .then((response) => {
        setQuestions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching the questions:", error);
      });
  }, []);

  const handleSubmit = () => {
    const newAnswer = currentAnswer.trim();
    const updatedAnswers = [...userAnswers, newAnswer];

    const totalCorrectAnswers = updatedAnswers.filter(
      (answer, index) =>
        answer.toLowerCase() === questions[index].correct_answer.toLowerCase()
    ).length;

    setUserAnswers(updatedAnswers);
    setCurrentAnswer("");

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setScore(totalCorrectAnswers);
      setQuizFinished(true);

      saveUserScore(totalCorrectAnswers);
    }
  };

  const saveUserScore = async (calculatedScore) => {
    try {
      await axios.post("http://127.0.0.1:8000/api/saveUserScore", {
        user_id: userId,
        game_id: gameId,
        score: calculatedScore,
        level: level_id,
      });

      console.log("Score saved successfully");
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  const handlePlayAgain = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setCurrentAnswer("");
    setQuizFinished(false);
  };

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const totalCorrectAnswers = userAnswers.filter(
    (answer, index) =>
      answer.toLowerCase() === questions[index].correct_answer.toLowerCase()
  ).length;

  return (
    <div className="quiz-modal active">
      {quizFinished ? (
        <div className="results">
          <h2 className="modal-header">Game Over!</h2>
          <p>Your answers:</p>
          <ul>
            {questions.map((q, index) => (
              <li key={index}>
                <strong>{q.question_text}</strong> <br />
                Your answer:{" "}
                <span
                  className={
                    userAnswers[index].toLowerCase() ===
                    q.correct_answer.toLowerCase()
                      ? "correct"
                      : "incorrect"
                  }
                >
                  {userAnswers[index]}
                </span>{" "}
                <br />
                Correct answer:{" "}
                <span className="correct">{q.correct_answer}</span>
              </li>
            ))}
          </ul>
          <div className="score-summary">
            <h3>
              Total Score: {totalCorrectAnswers} / {questions.length}
            </h3>
          </div>
          <button className="play-again-button" onClick={handlePlayAgain}>
            Play Again
          </button>
        </div>
      ) : (
        <div className="question-container">
          <h2 className="modal-header">{currentQuestion.question_text}</h2>
          <input
            type="text"
            className="input-answer"
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Type your answer here..."
          />
          <button className="submit-button" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default FillInTheBlank;
