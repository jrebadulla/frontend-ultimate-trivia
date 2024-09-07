import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MultipleChoice.css";

const MultipleChoice = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    const gameId = 4;

    axios
      .get("http://127.0.0.1:8000/api/quiz-questions", {
        params: {
          game_id: gameId,
        },
      })
      .then((response) => {
        const transformedQuestions = response.data.map((question) => ({
          ...question,
          options: [
            question.option_a,
            question.option_b,
            question.option_c,
            question.option_d,
          ],
        }));
        setQuestions(transformedQuestions);
      })
      .catch((error) => {
        console.error("Error fetching the questions:", error);
      });
  }, []);

  const handleAnswer = (answer) => {
    setUserAnswers([...userAnswers, answer]);
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handlePlayAgain = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setQuizFinished(false);
  };

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const totalCorrectAnswers = userAnswers.filter(
    (answer, index) => answer === questions[index].correct_answer
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
                    userAnswers[index] === q.correct_answer
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
          <div className="options">
            {currentQuestion.options &&
              currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  className="option-button"
                  onClick={() => handleAnswer(option)}
                >
                  {option}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultipleChoice;
