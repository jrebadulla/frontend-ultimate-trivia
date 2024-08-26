import React, { useState } from "react";
import "./QuizGame.css";
import appleRed from "../Image/applered.png"; 
import dota2 from "../Image/dota.jpg"; 

const imageSets = [
    {
      images: [appleRed, appleRed, appleRed, appleRed],
      answer: "apple",
    },
    {
      images: [dota2, dota2, dota2, dota2], 
      answer: "dota",
    },
    // Add more sets as needed
  ];
  

const QuizGame = () => {
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [answer, setAnswer] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [correct, setCorrect] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); 
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);


  const handleGameClick = () => {
    if (!quizCompleted) {
        setShowModal(true);
    } else {
        alert("You have already completed this quiz. Please reset to try again.");
    }
};

const resetQuiz = () => {
    setScore(0);
    setQuizCompleted(false);
    setErrorMessage("");
};

  const handleChange = (e) => {
    setAnswer(e.target.value);
    setErrorMessage("");
  };

  const closeModal = () => {
    if (currentSetIndex >= imageSets.length - 1) {
        setQuizCompleted(true);
    }
    setShowModal(false);
    setAnswer("");
    setAttempts(0);
    setCorrect(false);
    setErrorMessage(""); 
    setCurrentSetIndex(0); 
};

  const handleSubmit = () => {

    if (answer.toLowerCase() === imageSets[currentSetIndex].answer) {
      alert("Correct! The answer is " + imageSets[currentSetIndex].answer);
      setCorrect(true);
      setErrorMessage(""); 
       setScore(score + 1);
    } else {
      setAttempts(attempts + 1);
      if (attempts >= 2) {
        alert("Incorrect! You've used all your attempts. The correct answer was " + imageSets[currentSetIndex].answer);
        setCorrect(false); 
      } else {
        alert(`Incorrect! You have ${2 - attempts} attempts left.`);
        setErrorMessage(""); // Clear any previous error message
      }
    }
  };



  const handleNext = () => {
    if (correct || attempts >= 3) {
        if (currentSetIndex < imageSets.length - 1) {
            setCurrentSetIndex(prevIndex => prevIndex + 1);
            setAnswer(""); 
            setAttempts(0); 
            setCorrect(false); 
            setErrorMessage(""); 
        } else {
            alert("You have completed all sets!");
            closeModal();
        }
    } else {
        setErrorMessage("Please try to answer remaining attempts before proceeding to next!"); 
    }
};

  return (
    <div className="quiz-game-container">
      <h1>Quiz Game</h1>
      <div className="quiz-categories">
        <div className="quiz-card" onClick={handleGameClick}>
          CSS<br /><span>3/30</span>
        </div>
        <div className="quiz-card">JavaScript<br /><span>13/30</span></div>
        <div className="quiz-card">PHP<br /><span>0/30</span></div>
        <div className="quiz-card">HTML<br /><span>0/30</span></div>
        <div className="quiz-card">Java<br /><span>0/30</span></div>
        <div className="quiz-card">C#<br /><span>0/30</span></div>
        <div className="quiz-card">
            4 pics 1 word
            <br />
            <span>{score}/{imageSets.length}</span> {/* Display the score */}
            <br />
            {!quizCompleted && (
                <button onClick={handleGameClick} className="start-button">
                    Start Quiz
                </button>
            )}
            {quizCompleted && (
                <button onClick={resetQuiz} className="reset-button">
                    Reset Quiz
                </button>
            )}
        </div>
      </div>
      {showModal && (
            <div className="modal">
                <div className="modal-content">
                    <span className="close" onClick={closeModal}>&times;</span>
                    <h2>What's the word?</h2>
                    <div className="images-container">
                        {imageSets[currentSetIndex].images.map((imgSrc, index) => (
                            <img src={imgSrc} alt={`Hint ${index + 1}`} className="game-image" key={index} />
                        ))}
                    </div>
                    <input
                        type="text"
                        value={answer}
                        onChange={handleChange}
                        placeholder="Enter your answer"
                        className="answer-input"
                    />
                    <button 
                        onClick={handleSubmit} 
                        className="submit-button"
                        disabled={correct} // Disable if the answer is correct
                    >
                        Submit
                    </button>
                    <button 
                        onClick={handleNext} 
                        className="next-button"
                    >
                     Next
                    </button>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </div>
            </div>
        )}
    </div>
);}

export default QuizGame;
