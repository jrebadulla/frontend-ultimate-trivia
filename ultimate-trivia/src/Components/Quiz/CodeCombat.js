import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './CodeCombat.css'; // Import the updated CSS file

const EscapeRoom = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [quizFinished, setQuizFinished] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [remainingTime, setRemainingTime] = useState(30); // New state for remaining time
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const userId = user.user_id;
  const level_id = user.level_id;
  const gameId = 4; // Game ID for this quiz
  const timerRef = useRef(null);
  const countdownRef = useRef(null); // Ref for countdown timer

  useEffect(() => {
    // Fetch questions from the backend
    axios.get('http://127.0.0.1:8000/api/quiz-questions', {
      params: { game_id: gameId },
    })
    .then(response => {
      setQuestions(response.data);
    })
    .catch(error => {
      console.error('Error fetching the questions:', error);
    });
  }, []);

  useEffect(() => {
    // Start the timer when a new question is displayed
    if (questions.length > 0) {
      startTimer();
    }

    // Clear timers when the component unmounts or question changes
    return () => {
      clearTimeout(timerRef.current);
      clearInterval(countdownRef.current);
    };
  }, [currentQuestionIndex, questions]);

  const startTimer = () => {
    setTimeUp(false);
    setRemainingTime(30); // Reset remaining time to 30 seconds
    clearTimeout(timerRef.current);
    clearInterval(countdownRef.current);
    
    countdownRef.current = setInterval(() => {
      setRemainingTime(prevTime => {
        if (prevTime <= 1) {
          clearInterval(countdownRef.current);
          setTimeUp(true);
          setFeedback('Time is up! You were eaten by a bug monster while coding!');
          setTimeout(() => {
            setQuizFinished(true); // End the quiz when time is up
            saveUserScore(userAnswers.filter((answer, index) =>
              answer.toLowerCase() === questions[index]?.correct_answer.toLowerCase()
            ).length);
          }, 2000); // Brief delay before ending the quiz
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000); // Update every second

    timerRef.current = setTimeout(() => {
      clearInterval(countdownRef.current);
    }, 30000); // 30 seconds in milliseconds
  };

  const handleSubmit = () => {
    clearTimeout(timerRef.current); // Clear the timer when the user submits an answer
    clearInterval(countdownRef.current); // Clear the countdown interval
    const newAnswer = currentAnswer.trim();
    const updatedAnswers = [...userAnswers, newAnswer];
    const correctAnswer = questions[currentQuestionIndex]?.correct_answer || '';

    const isCorrect = newAnswer.toLowerCase() === correctAnswer.toLowerCase();
    if (isCorrect) {
      setFeedback('Correct! Moving to the next question...');
      setTimeout(() => {
        if (currentQuestionIndex + 1 >= questions.length) {
          setQuizFinished(true);
          saveUserScore(userAnswers.filter((answer, index) =>
            answer.toLowerCase() === questions[index].correct_answer.toLowerCase()
          ).length);
        } else {
          setCurrentQuestionIndex(prevIndex => prevIndex + 1);
          setCurrentAnswer('');
          setFeedback('');
          setUserAnswers(updatedAnswers);
          startTimer(); // Restart the timer for the next question
        }
      }, 1000); // Short delay before moving to the next question
    } else {
      setFeedback('Incorrect, try again.');
    }
  };

  const saveUserScore = async (calculatedScore) => {
    try {
      await axios.post('http://127.0.0.1:8000/api/saveUserScore', {
        user_id: userId,
        game_id: gameId,
        score: calculatedScore,
        level: level_id,
      });
      console.log('Score saved successfully');
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

  const handlePlayAgain = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setCurrentAnswer('');
    setFeedback('');
    setQuizFinished(false);
    setTimeUp(false);
  };

  if (questions.length === 0) {
    return <div className="escape-room-container">Loading...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="escape-room-container">
      {quizFinished ? (
        <div className="escape-room-feedback">
          <h2 className="escape-room-title">Quiz Completed!</h2>
          <p>Your quiz has finished. Thank you for playing!</p>
          <button className="escape-room-button" onClick={handlePlayAgain}>Play Again</button>
        </div>
      ) : (
        <div className="question-container">
          <h2 className="escape-room-title">{currentQuestion.question_text}</h2>
          <input
            type="text"
            className="escape-room-input"
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Type your answer here..."
          />
          <button className="escape-room-button" onClick={handleSubmit}>Submit</button>
          <div className="escape-room-feedback">{feedback}</div>
          <div className="escape-room-timer">Time remaining: {remainingTime}s</div> {/* Display remaining time */}
        </div>
      )}
    </div>
  );
};

export default EscapeRoom;
