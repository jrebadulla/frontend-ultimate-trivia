import React, { useState, useEffect } from "react";
import axios from "axios";
import "./BubblePop.css";

const BubblePopQuiz = React.memo(() => {
  const [bubbles, setBubbles] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [popBubbleId, setPopBubbleId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userId = user.user_id;
  const level_id = user.level_id;
  const gameId = 3;
  const currentQuestion = questions[currentQuestionIndex];

  const saveUserScore = async () => {
    try {
      console.log("User ID from localStorage:", userId);

      await axios.post("http://127.0.0.1:8000/api/saveUserScore", {
        user_id: userId,
        game_id: gameId,
        score: score,
        level: level_id
      });

      console.log("Score saved successfully");
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/quiz-questions", {
        params: {
          game_id: gameId,
        },
      })
      .then((response) => {
        const fetchedQuestions = response.data;

        const transformedQuestions = fetchedQuestions.map((question) => ({
          ...question,
          incorrect_answers: [
            question.option_a,
            question.option_b,
            question.option_c,
            question.option_d,
          ].filter((option) => option !== question.correct_answer),
        }));

        setQuestions(transformedQuestions);
      })
      .catch((error) => {
        console.error("Error fetching the questions:", error);
      });
  }, []);

  useEffect(() => {
    const createBubbles = () => {
      if (currentQuestion) {
        const incorrectAnswers = currentQuestion.incorrect_answers || [];
        const displayedIncorrectAnswers = incorrectAnswers.slice(0, 3);
        const allAnswers = [
          ...displayedIncorrectAnswers,
          currentQuestion.correct_answer,
        ];
        allAnswers.sort(() => Math.random() - 0.5);
        const newBubbles = allAnswers.map((answer) => ({
          id: Date.now() + Math.random(),
          left: Math.random() * 90 + "%",
          top: Math.random() * 90 + "%",
          answer: answer,
        }));
        setBubbles(newBubbles);
      }
    };

    createBubbles();
    const interval = setInterval(createBubbles, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [currentQuestion]);

  useEffect(() => {
    if (gameOver) {
      saveUserScore();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setGameOver(true);
          saveUserScore();
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameOver]);

  const handleBubbleClick = (id, answer) => {
    if (gameOver) return;

    setPopBubbleId(id);
    setTimeout(() => {
      if (answer === currentQuestion.correct_answer) {
        setScore((prevScore) => prevScore + 1);
      }

      setBubbles((prevBubbles) =>
        prevBubbles.filter((bubble) => bubble.id !== id)
      );
      setCurrentQuestionIndex((prevIndex) => {
        const newIndex =
          prevIndex < questions.length - 1 ? prevIndex + 1 : prevIndex;
        if (newIndex === questions.length - 1) {
          setGameOver(true);
          saveUserScore();
        }
        return newIndex;
      });
      setPopBubbleId(null);
    }, 500);
  };

  const restartGame = () => {
    setBubbles([]);
    setScore(0);
    setTimeLeft(30);
    setCurrentQuestionIndex(0);
    setGameOver(false);
  };

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="quiz-modal">
      {!gameOver ? (
        <div className="bubble-quiz-container">
          <div className="bubble-quiz-header">
            <h2>Bubble Pop Quiz</h2>
            <div className="score-container">
              <div className="score">{score}</div>
              <div className="score-label">Score</div>
            </div>
            <p className="timer">Time Left: {timeLeft}s</p>
            <p className="current-question">
              {currentQuestion ? currentQuestion.question_text : "Loading..."}
            </p>
          </div>
          <div className="bubble-quiz-area">
            {bubbles.map((bubble) => (
              <div
                key={bubble.id}
                className={`bubble ${popBubbleId === bubble.id ? "pop" : ""}`}
                style={{ left: bubble.left, top: bubble.top }}
                onClick={() => handleBubbleClick(bubble.id, bubble.answer)}
              >
                <span className="bubble-text">{bubble.answer}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="game-over-container">
          <div className="game-over-header">Game Over!</div>
          <div className="game-over-score">Final Score: {score}</div>
          <div className="game-over-buttons">
            <button onClick={restartGame}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
});

export default BubblePopQuiz;
