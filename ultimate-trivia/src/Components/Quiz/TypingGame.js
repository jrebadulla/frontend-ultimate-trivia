import React, { useState, useEffect } from "react";
import "./TypingGame.css"; // Import the CSS file

const TypingGame = () => {
  const [snippet, setSnippet] = useState("");
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [timeTaken, setTimeTaken] = useState(null);
  const [accuracy, setAccuracy] = useState(null);

  const snippets = [
    "console.log('Hello, world!');",
    "function add(a, b) { return a + b; }",
    "let x = 10; const y = 20;",
    "<div className='container'></div>",
    "if (isTrue) { doSomething(); }",
  ];

  useEffect(() => {
    const randomSnippet = snippets[Math.floor(Math.random() * snippets.length)];
    setSnippet(randomSnippet);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;

    if (!startTime) {
      setStartTime(Date.now());
    }

    if (value === snippet) {
      const endTime = Date.now();
      setTimeTaken((endTime - startTime) / 1000);
    }

    const matchingChars = value
      .split("")
      .filter((char, i) => char === snippet[i]).length;
    setAccuracy((matchingChars / snippet.length) * 100);

    setUserInput(value);
  };

  const handlePaste = (e) => {
    e.preventDefault(); // Prevent pasting
    alert("Pasting is not allowed! Please type the code.");
  };

  const resetGame = () => {
    setUserInput("");
    setTimeTaken(null);
    setAccuracy(null);
    setStartTime(null);
    const randomSnippet = snippets[Math.floor(Math.random() * snippets.length)];
    setSnippet(randomSnippet);
  };

  return (
    <div className="typing-game">
      <h2>Type the Code Snippet Below</h2>
      <pre>{snippet}</pre>

      <input
        type="text"
        value={userInput}
        onChange={handleInputChange}
        onPaste={handlePaste}
        placeholder="Start typing..."
        className="input-field"
      />

      {timeTaken && (
        <div className="results">
          <p>Time Taken: {timeTaken.toFixed(2)} seconds</p>
          <p>Accuracy: {accuracy.toFixed(2)}%</p>
        </div>
      )}

      <button onClick={resetGame}>Reset</button>
    </div>
  );
};

export default TypingGame;
