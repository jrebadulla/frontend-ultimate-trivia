import React, { useState, useEffect } from "react";
import axios from "axios";
import "./BubblePop.css";
import { v4 as uuidv4 } from "uuid";
import useSound from "use-sound";

const BubblePopQuiz = React.memo(() => {
  const [bubbles, setBubbles] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(100);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [popBubbleId, setPopBubbleId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [feedback, setFeedback] = useState("");

  const [playPopSound, { isLoading: popIsLoading, error: popSoundError }] =
    useSound(["/sounds/pop.mp3", "/sounds/pop.ogg"], { volume: 0.75 });
  const [playCorrectSound, { error: correctSoundError }] = useSound(
    ["/sounds/correct.mp3", "/sounds/correct.ogg"],
    { volume: 0.75 }
  );
  const [playWrongSound, { error: wrongSoundError }] = useSound(
    ["/sounds/wrong.mp3", "/sounds/wrong.ogg"],
    { volume: 0.75 }
  );
  const [playGameOverSound, { error: gameOverSoundError }] = useSound(
    ["/sounds/game-over.mp3", "/sounds/game-over.ogg"],
    { volume: 0.75 }
  );

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const { user_id: userId, level_id } = user;
  const gameId = 3;
  const currentQuestion = questions[currentQuestionIndex];
  const baseURL = "http://3.107.73.113";

  useEffect(() => {
    setStartTime(new Date());
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/quiz-questions`, {
        params: { game_id: gameId },
      });
      const transformedQuestions = response.data.map((question) => ({
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

  useEffect(() => {
    if (!gameOver) {
      createBubbles();
      const interval = setInterval(createBubbles, 5000);
      return () => clearInterval(interval);
    }
  }, [currentQuestion, gameOver]);

  const createBubbles = () => {
    if (!currentQuestion) return;

    const allAnswers = [
      ...currentQuestion.incorrect_answers.slice(0, 3),
      currentQuestion.correct_answer,
    ].sort(() => Math.random() - 0.5);

    const newBubbles = allAnswers.map((answer, index) => ({
      id: uuidv4(),
      left: `${(index % 3) * (100 / 3)}%`,
      top: `${Math.floor(index / 3) * (100 / 2)}%`,
      answer,
    }));

    setBubbles(newBubbles);
  };

  useEffect(() => {
    if (gameOver) {
      setEndTime(new Date());
      playGameOverSound();
      saveUserScore();
    } else {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setGameOver(true);
            playGameOverSound();
            setEndTime(new Date());
            saveUserScore();
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameOver]);

  const calculatePlaytime = () => {
    return startTime && endTime ? Math.floor((endTime - startTime) / 1000) : 0;
  };

  const saveUserScore = async () => {
    const playtime = calculatePlaytime();
    try {
      await axios.post(`${baseURL}/api/saveUserScore`, {
        user_id: userId,
        game_id: gameId,
        score,
        level: level_id,
        playtime,
      });
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  const handleBubbleClick = (id, answer) => {
    if (gameOver) return;

    setPopBubbleId(id);
    playPopSound();

    setTimeout(() => {
      const isCorrect = answer === currentQuestion.correct_answer;
      if (isCorrect) {
        setScore((prevScore) => prevScore + 1);
        playCorrectSound();
      } else {
        playWrongSound();
      }

      setTimeout(() => setFeedback(""), 1500);

      setBubbles((prevBubbles) =>
        prevBubbles.filter((bubble) => bubble.id !== id)
      );
      setCurrentQuestionIndex((prevIndex) => {
        const newIndex =
          prevIndex < questions.length - 1 ? prevIndex + 1 : prevIndex;
        if (newIndex === questions.length - 1) {
          setGameOver(true);
          setEndTime(new Date());
        }
        return newIndex;
      });
      setPopBubbleId(null);
    }, 500);
  };

  const restartGame = () => {
    setBubbles([]);
    setScore(0);
    setTimeLeft(100);
    setCurrentQuestionIndex(0);
    setGameOver(false);
    setStartTime(new Date());
    setEndTime(null);
  };

  useEffect(() => {
    if (popSoundError) console.error("Error loading pop sound:", popSoundError);
    if (correctSoundError)
      console.error("Error loading correct sound:", correctSoundError);
    if (wrongSoundError)
      console.error("Error loading wrong sound:", wrongSoundError);
    if (gameOverSoundError)
      console.error("Error loading game-over sound:", gameOverSoundError);
  }, [popSoundError, correctSoundError, wrongSoundError, gameOverSoundError]);

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
            <p className="modal-header">Level {currentQuestionIndex + 1}</p>
            <div className="score-container"></div>
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
          <div className="game-over-score">You Got: {score}</div>
          <div className="game-over-buttons">
            <button onClick={restartGame}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
});

export default BubblePopQuiz;
