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
  const [startTime, setStartTime] = useState(null); // Track start time
  const [endTime, setEndTime] = useState(null); // Track end time
  const [currentDay, setCurrentDay] = useState(""); // Track current day
  const [highScore, setHighScore] = useState(0);

  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userId = user.user_id;
  const levelId = user.level_id;
  const gameId = 5; // Game ID for FourPicsOneWord
  const baseURL = "https://3.107.73.113"; // Your backend API URL

  // Fetch questions and high score on component mount
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setCurrentDay(today); // Set the current day

    setStartTime(new Date()); // Start time when the game starts

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

    axios
      .get(`${baseURL}/api/user-high-score`, { params: { user_id: userId, game_id: gameId } })
      .then((response) => {
        setHighScore(response.data.high_score);
      })
      .catch((error) => {
        console.error("Error fetching high score:", error);
      });
  }, [userId, gameId]);

  const handleLetterChange = (index, letter) => {
    const newAnswer = userAnswer.split("");
    newAnswer[index] = letter;
    setUserAnswer(newAnswer.join(""));
  };

  const handleSubmitAnswer = async () => {
    if (quizFinished) return;

    if (correctAnswer && userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase()) {
      setGameStatus("Correct!");
      setInputClass("correct");

      const newScore = score + 1;
      setScore(newScore);
      setShowScore(true);

      // Save user answer after each submission
      await saveUserAnswer(userAnswer, true);

      setTimeout(() => {
        if (currentQuestionIndex + 1 < questions.length) {
          const nextQuestion = questions[currentQuestionIndex + 1];
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
          setCorrectAnswer(nextQuestion?.correct_answer || "");
          setUserAnswer("");
          setShowScore(false);
        } else {
          // Set endTime before saving the score
          setEndTime(new Date());
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

      // Save user answer after each submission
      await saveUserAnswer(userAnswer, false);
    }
  };

  const calculatePlaytime = () => {
    if (startTime && endTime) {
      return Math.floor((endTime - startTime) / 1000); // Playtime in seconds
    }
    return 0;
  };

  const saveUserAnswer = async (userAnswer, isCorrect) => {
    const currentQuestion = questions[currentQuestionIndex];
    try {
      await axios.post(`${baseURL}/api/user-answers`, {
        user_id: userId,
        game_id: gameId,
        question_id: currentQuestion.question_id,
        user_answer: userAnswer,
        correct_answer: currentQuestion.correct_answer,
        is_correct: isCorrect,
      });
      console.log("User answer saved successfully");
    } catch (error) {
      console.error("Error saving user answer:", error);
    }
  };

  const saveUserScore = async (calculatedScore) => {
    // Set a slight delay to ensure that the endTime is updated before calculating playtime
    setTimeout(async () => {
      const playtime = calculatePlaytime(); // Calculate playtime in seconds
      const updatedHighScore = Math.max(calculatedScore, highScore); // Update high score if needed

      try {
        const response = await axios.post(`${baseURL}/api/saveUserScore`, {
          user_id: userId,
          game_id: gameId,
          score: calculatedScore,
          level: levelId,
          playtime: playtime,
          day: currentDay,
          high_score: updatedHighScore,
        });
        console.log("Score, playtime, and day saved successfully", response.data);
      } catch (error) {
        console.error("Error saving score:", error);
      }
    }, 500); // Delay of 500 milliseconds to ensure correct endTime
  };

  if (questions.length === 0) {
    return <div className="FourPic-question-container">Loading...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answerLength = correctAnswer.length;

  return (
    <div className="quiz-modal active">
      <div className="score-summary">
        <p className="highest-score">
          Your Highest Score: {highScore} / {questions.length}
        </p>
      </div>
      <div className="FourPic-question-container">
        <div className="FourPic-container">
          <div>
            <p className="modal-header">Level {currentQuestionIndex + 1}</p>
          </div>
          <p className="fourPic-score">Score: {score}</p>
          <h2 className="FourPic-question-text">{currentQuestion.question_text}</h2>
          <div className="FourPic-images">
            {currentQuestion.image1 && <img src={`${baseURL}${currentQuestion.image1}`} alt="Image 1" />}
            {currentQuestion.image2 && <img src={`${baseURL}${currentQuestion.image2}`} alt="Image 2" />}
            {currentQuestion.image3 && <img src={`${baseURL}${currentQuestion.image3}`} alt="Image 3" />}
            {currentQuestion.image4 && <img src={`${baseURL}${currentQuestion.image4}`} alt="Image 4" />}
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
          {showScore && <div className="FourPic-status-message">{gameStatus}</div>}
        </div>
      </div>
    </div>
  );
};

export default FourPicsOneWord;
