import React, { useState, useEffect } from "react";
import axios from "axios";
import "./BubblePop.css";
import { v4 as uuidv4 } from "uuid"; 

const BubblePopQuiz = React.memo(() => {
  const [bubbles, setBubbles] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [popBubbleId, setPopBubbleId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startTime, setStartTime] = useState(null); 
  const [endTime, setEndTime] = useState(null); 

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userId = user.user_id;
  const level_id = user.level_id;
  const gameId = 3;
  const currentQuestion = questions[currentQuestionIndex];
  const baseURL = "http://127.0.0.1:8000"; 

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setStartTime(new Date());  
  }, []);

  const saveUserScore = async () => {
    const playtime = calculatePlaytime(); 
    const today = new Date().toISOString().split("T")[0];
    try {
      await axios.post(`${baseURL}/api/saveUserScore`, {
        user_id: userId,
        game_id: gameId,
        score: score,
        level: level_id,
        playtime: playtime, 
        day: today
      });
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/quiz-questions`, {
          params: { game_id: gameId },
        });
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
        setLoading(false);
      } catch (error) {
        setError("Error fetching the questions.");
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [gameId]);

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

        const newBubbles = [];
        const numColumns = 3;
        const numRows = 2;

        for (let i = 0; i < allAnswers.length; i++) {
          const column = i % numColumns;
          const row = Math.floor(i / numColumns);

          const position = {
            left: `${column * (100 / numColumns)}%`,
            top: `${row * (100 / numRows)}%`,
          };

          newBubbles.push({
            id: uuidv4(),
            left: position.left,
            top: position.top,
            answer: allAnswers[i],
          });
        }

        setBubbles(newBubbles);
      }
    };

    if (!gameOver) {
      createBubbles();
      const interval = setInterval(createBubbles, 5000);
      return () => clearInterval(interval);
    }
  }, [currentQuestion, gameOver]);

  useEffect(() => {
    if (gameOver) {
      setEndTime(new Date()); 
      saveUserScore();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setGameOver(true);
          setEndTime(new Date());
          saveUserScore();
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameOver]);

  const calculatePlaytime = () => {
    if (startTime && endTime) {
      return Math.floor((endTime - startTime) / 1000); // Playtime in seconds
    }
    return 0;
  };

  const handleBubbleClick = async (id, answer) => {
    if (gameOver) return;

    setPopBubbleId(id);
    setTimeout(async () => {
      const isCorrect = answer === currentQuestion.correct_answer;

      if (isCorrect) {
        setScore((prevScore) => prevScore + 1);
      }

      await axios.post(`${baseURL}/api/user-answers`, {
        user_id: userId,
        game_id: gameId,
        question_id: currentQuestion.question_id,
        user_answer: answer,
        correct_answer: currentQuestion.correct_answer,
        is_correct: isCorrect,
      });

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
    setStartTime(new Date());
    setEndTime(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="quiz-modal">
      {!gameOver ? (
        <div className="bubble-quiz-container">
          <div className="bubble-quiz-header">
            <div>
              <p className="modal-header">Level {currentQuestionIndex + 1}</p>
            </div>
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
