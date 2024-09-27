import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './CodeCombat.css'; 

const EscapeRoom = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [quizFinished, setQuizFinished] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [remainingTime, setRemainingTime] = useState(30); 
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const userId = user.user_id;
  const level_id = user.level_id;
  const gameId = 4; 
  const timerRef = useRef(null);
  const countdownRef = useRef(null); 

  useEffect(() => {
 
    axios.get('http://3.107.73.113/api/quiz-questions', {
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
  
    if (questions.length > 0) {
      startTimer();
    }

    return () => {
      clearTimeout(timerRef.current);
      clearInterval(countdownRef.current);
    };
  }, [currentQuestionIndex, questions]);

  const startTimer = () => {
    setTimeUp(false);
    setRemainingTime(60); 
    clearTimeout(timerRef.current);
    clearInterval(countdownRef.current);
    
    countdownRef.current = setInterval(() => {
      setRemainingTime(prevTime => {
        if (prevTime <= 1) {
          clearInterval(countdownRef.current);
          setTimeUp(true);
          setFeedback('Time is up! You were eaten by a bug monster while coding!');
          setTimeout(() => {
            setQuizFinished(true); 
            saveUserScore(userAnswers.filter((answer, index) =>
              answer.toLowerCase() === questions[index]?.correct_answer.toLowerCase()
            ).length);
          }, 2000); 
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    timerRef.current = setTimeout(() => {
      clearInterval(countdownRef.current);
    }, 60000); 
  };

  const handleSubmit = () => {
    clearTimeout(timerRef.current); 
    clearInterval(countdownRef.current); 
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
          startTimer(); 
        }
      }, 1000); 
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
    <div className="quiz-modal active">
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
          <div className="escape-room-timer">Time remaining: {remainingTime}s</div>
        </div>
      )}
    </div>
    </div>   
  );
};

export default EscapeRoom;
