import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FillInTheBlanks.css";

const FillInTheBlank = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState(0);
  const [startTime, setStartTime] = useState(null); // Track start time
  const [endTime, setEndTime] = useState(null); // Track end time
  const [currentDay, setCurrentDay] = useState(""); // Track current day
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [highScore, setHighScore] = useState(0);

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userId = user.user_id;
  const levelId = user.level_id;
  const gameId = 7; // Game ID for Fill-in-the-Blanks quiz
  const baseURL = "http://127.0.0.1:8000"; 

  useEffect(() => {
    setStartTime(new Date()); 
    const today = new Date().toISOString().split("T")[0];
    setCurrentDay(today);

    // Fetch the quiz questions
    axios
      .get(`${baseURL}/api/quiz-questions`, {
        params: { game_id: gameId },
      })
      .then((response) => {
        setQuestions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching the questions:", error);
      });

    // Fetch the user's high score for this quiz
    axios
      .get(`${baseURL}/api/user-high-score`, {
        params: { user_id: userId, game_id: gameId },
      })
      .then((response) => {
        setHighScore(response.data.high_score);
      })
      .catch((error) => {
        console.error("Error fetching high score:", error);
      });
  }, [userId, gameId]);

  const handleAnswer = async () => {
    const trimmedAnswer = currentAnswer.trim();
    const updatedAnswers = [...userAnswers, trimmedAnswer];

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect =
      trimmedAnswer.toLowerCase() === currentQuestion.correct_answer.toLowerCase();

    // Post the answer to the backend after each question
    await axios.post(`${baseURL}/api/user-answers`, {
      user_id: userId,
      game_id: gameId,
      question_id: currentQuestion.question_id,
      user_answer: trimmedAnswer,
      correct_answer: currentQuestion.correct_answer,
      is_correct: isCorrect,
    });

    // Update the state
    setUserAnswers(updatedAnswers);
    setCurrentAnswer("");

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setEndTime(new Date()); // Set end time when quiz finishes
      const correctAnswersCount = updatedAnswers.filter(
        (answer, index) =>
          answer.toLowerCase() === questions[index].correct_answer.toLowerCase()
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
      const playtime = Math.floor((endTime - startTime) / 1000); // Playtime in seconds
      return playtime;
    }
    return 0;
  };

  const saveUserScore = async (score) => {
    const playtime = calculatePlaytime();
    const updatedHighScore = Math.max(score, highScore);

    try {
      const response = await axios.post(`${baseURL}/api/saveUserScore`, {
        user_id: userId,
        game_id: gameId,
        score: score,
        level: levelId,
        playtime: playtime,
        day: currentDay,
        high_score: updatedHighScore,
        game_name: 'Fill in the Blanks',
      });

      console.log("Response from saveUserScore:", response.data);
      console.log("Score, playtime, and day saved successfully");
    } catch (error) {
      console.error("Error saving score:", error);
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
          <h2 className="fill-in-the-blank-questions">
            {currentQuestion.question_text}
          </h2>
          <input
            type="text"
            className="input-answer"
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Type your answer here..."
          />
          <button className="submit-button" onClick={handleAnswer}>
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default FillInTheBlank;
