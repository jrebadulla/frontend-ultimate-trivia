import React, { useState } from "react";
import "./QuizDashboard.css";
import BubblePopQuiz from "./BubblePop";
import MultipleChoice from "./MultipleChoice";
import FillInTheBlank from "./FillInTheBlanks";
import FourPicsOneWord from "./FourPicsOneWord";
import TypingGame from "./TypingGame";
import EscapeRoom from "./CodeCombat";

const QuizDashboard = () => {
  const [activeQuiz, setActiveQuiz] = useState(null);

  const handleQuizClick = (quizName) => {
    setActiveQuiz((prevQuiz) => (prevQuiz !== quizName ? quizName : null));
  };

  const handleCloseModal = () => {
    setActiveQuiz(null);
  };

  return (
    <div className="quiz-container">
      <div className="quizes-container">
        <div onClick={() => handleQuizClick("Multiple Choice")}>
          Multiple Choice
        </div>
        <div onClick={() => handleQuizClick("Fill in the Blanks")}>
          Fill in the Blanks
        </div>
        <div onClick={() => handleQuizClick("Bubble Pop Quiz")}>
          Bubble Pop Quiz
        </div>
        <div onClick={() => handleQuizClick("Four Pics One Word")}>
          Four Pics One Word
        </div>
        <div onClick={() => handleQuizClick("Typing Game")}>Typing Game</div>
        <div onClick={() => handleQuizClick("Code Combat")}>Code Combat</div>
      </div>

      {activeQuiz && (
        <div className={`quiz-modal ${activeQuiz ? "active" : ""}`}>
          <button className="close-button" onClick={handleCloseModal}>
            ×
          </button>
          <div className="modal-header">{activeQuiz}</div>
          <div className="modal-debug">
            {activeQuiz === "Bubble Pop Quiz" ? (
              <BubblePopQuiz />
            ) : activeQuiz === "Multiple Choice" ? (
              <MultipleChoice />
            ) : activeQuiz === "Fill in the Blanks" ? (
              <FillInTheBlank />
            ) : activeQuiz === "Four Pics One Word" ? (
              <FourPicsOneWord />
            ) : activeQuiz === "Typing Game" ? (
              <TypingGame />
            ) : activeQuiz === "Code Combat" ? (
              <EscapeRoom />
            ) : (
              <p>This is where you play the {activeQuiz} quiz!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default QuizDashboard;
