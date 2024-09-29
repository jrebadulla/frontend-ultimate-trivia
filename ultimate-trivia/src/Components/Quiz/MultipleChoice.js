import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MultipleChoice.css";

//merging sample

const MultipleChoice = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState(0);
  const [startTime, setStartTime] = useState(null); 
  const [endTime, setEndTime] = useState(null); 
  const [currentDay, setCurrentDay] = useState(""); 

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userId = user.user_id;
  const levelId = user.level_id;
  const gameId = 4; 
  const baseURL = "https://3.107.73.113"; 

  
  useEffect(() => {
    setStartTime(new Date()); 

    const today = new Date().toISOString().split("T")[0];
    setCurrentDay(today); 

    axios
      .get(`${baseURL}/api/quiz-questions`, {
        params: { game_id: gameId },
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

  const handleAnswer = async (answer) => {
    const newAnswers = [...userAnswers, answer];
    setUserAnswers(newAnswers);

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correct_answer;

    await axios.post(`${baseURL}/api/user-answers`, {
      user_id: userId,
      game_id: gameId,
      question_id: currentQuestion.question_id,
      user_answer: answer,
      correct_answer: currentQuestion.correct_answer,
      is_correct: isCorrect,
    });

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setEndTime(new Date()); 
      const correctAnswersCount = newAnswers.filter(
        (answer, index) => answer === questions[index].correct_answer
      ).length;

      setTotalCorrectAnswers(correctAnswersCount);
      setQuizFinished(true);
    }
  };

  useEffect(() => {
    if (quizFinished && endTime) {
      saveUserScore(totalCorrectAnswers);
    }
  }, [quizFinished, endTime]);

  const calculatePlaytime = () => {
    if (startTime && endTime) {
      const playtime = Math.floor((endTime - startTime) / 1000);
      return playtime;
    }
    return 0;
  };

  const saveUserScore = async (score) => {
    const playtime = calculatePlaytime();
  
    try {
      const response = await axios.post(`${baseURL}/api/saveUserScore`, {
        user_id: userId,
        game_id: gameId,
        score: score,
        level: levelId,
        playtime: playtime,
        day: currentDay,
      });
      
    } catch (error) {
      console.error("Error saving score:", error.response ? error.response.data : error.message);
    }
  };

  const handlePlayAgain = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setQuizFinished(false);
    setTotalCorrectAnswers(0);
    setStartTime(new Date()); 
    setEndTime(null); 
  };

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

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
            <p>Total Playtime: {calculatePlaytime()} seconds</p>
            <p>Played on: {currentDay}</p> 
          </div>
          <button className="play-again-button" onClick={handlePlayAgain}>
            Play Again
          </button>
        </div>
      ) : (
        <div className="question-container">
          <div>
            <p className="modal-header">Level {currentQuestionIndex + 1}</p>
          </div>
          <h2 className="multiple-question">{currentQuestion.question_text}</h2>
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
