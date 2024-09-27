import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  Button,
  Select,
  Box,
  Text,
  Heading,
  Flex,
  VStack,
  theme,
} from "@chakra-ui/react";
import MonacoEditor from "@monaco-editor/react";
import axios from "axios";
import { executeCode } from "./Api";
import { LANGUAGE_VERSIONS, CODE_SNIPPETS } from "./Constant.js";

const Compiler = () => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(CODE_SNIPPETS["javascript"]);
  const [output, setOutput] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false); 

  useEffect(() => {
    if (isQuizActive) {
      axios
        .get("http://3.107.73.113/api/quiz-questions", {
          params: { game_id: 8 }, 
        })
        .then((response) => {
          console.log("Fetched Questions:", response.data); 
          setQuestions(response.data);

          const answers = response.data.map((q) =>
            q.correct_answer ? q.correct_answer.trim().toLowerCase() : ""
          );
          setCorrectAnswers(answers);
        })
        .catch((error) => console.error("Error fetching questions:", error));
    }
  }, [isQuizActive]);

  const normalizeOutput = (output) => {
    return output
      .trim() 
      .toLowerCase() 
      .replace(/\s+/g, ' ') 
      .replace(/[\r\n]+/g, ' ') 
      .replace(/,/g, '') 
      .replace(/[^\d.]/g, ''); 
  };

  const handleRunCode = async () => {
    try {
      const currentQuestion = questions[currentQuestionIndex] || {};
      if (!currentQuestion.question_text) {
        console.error("Current question is missing.");
        return;
      }

      const functionCall = currentQuestion.function_call ? currentQuestion.function_call[language] : '';
      const fullCode = `${code}\n${functionCall}`;

      const result = await executeCode(language, fullCode);
      console.log("Execution Result:", result);

      const userOutput = result.run.stdout || result.run.stderr;
      const normalizedUserOutput = normalizeOutput(userOutput);
      
      setOutput(userOutput);

      const expectedOutput = normalizeOutput(correctAnswers[currentQuestionIndex] || "");

      const userNumber = parseFloat(normalizedUserOutput);
      const expectedNumber = parseFloat(expectedOutput);

      console.log("User Answer:", normalizedUserOutput);
      console.log("Expected Output:", expectedOutput);

      setIsCorrect(
        isNaN(userNumber) || isNaN(expectedNumber)
          ? normalizedUserOutput === expectedOutput
          : userNumber === expectedNumber
      );
    } catch (error) {
      console.error("Error executing code:", error);
      setOutput("Error executing code");
    }
  };

  const handleConfirm = () => {
    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setCode(CODE_SNIPPETS[language]); 
      setOutput("");
    } else {
      setQuizFinished(true);
      const finalScore = score + (isCorrect ? 1 : 0);
      console.log("Saving Final Score:", finalScore);
      saveUserScore(finalScore);
    }
  };

  const saveUserScore = async (calculatedScore) => {
    try {
      const user = JSON.parse(localStorage.getItem("user")) || {};
      const userId = user.user_id;
      const level_id = user.level_id;

      await axios.post("http://3.107.73.113/api/saveUserScore", {
        user_id: userId,
        game_id: 8,
        score: calculatedScore,
        level: level_id,
      });

      console.log("Score saved successfully");
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  const handlePlayAgain = () => {
    setCurrentQuestionIndex(0);
    setCode(CODE_SNIPPETS[language]); 
    setOutput("");
    setQuizFinished(false);
    setScore(0);
    setIsQuizActive(false);
  };

  const currentQuestion = questions[currentQuestionIndex] || {};

  return (
    <ChakraProvider theme={theme}>
      <Flex direction="column" align="center" p={5} bg="#1A202C" minH="100vh">
        <Flex direction="column" w="full" maxW="900px" mb={6}>
          <Box
            w="full"
            bg="#2D3748"
            borderRadius="md"
            p={4}
            mb={4}
            boxShadow="lg"
          >
            {isQuizActive ? (
              quizFinished ? (
                <VStack spacing={4} align="center">
                  <Heading color="white">Quiz Finished!</Heading>
                  <Text color="white">Your Score: {score} / {questions.length}</Text>
                  <Button
                    bg="#3182ce"
                    color="white"
                    _hover={{ bg: "#2b6cb0" }}
                    _active={{ bg: "#2b6cb0" }}
                    onClick={handlePlayAgain}
                  >
                    Play Again
                  </Button>
                </VStack>
              ) : (
                <VStack spacing={4} align="center">
                  {currentQuestion.question_text ? (
                    <Text fontWeight="bold" color="white">
                      {currentQuestion.question_text}
                    </Text>
                  ) : (
                    <Text color="white">Loading question...</Text>
                  )}
                </VStack>
              )
            ) : (
              <Button
                bg="#3182ce"
                color="white"
                _hover={{ bg: "#2b6cb0" }}
                _active={{ bg: "#2b6cb0" }}
                onClick={() => setIsQuizActive(true)}
              >
                Start Quiz
              </Button>
            )}
          </Box>

          <Flex justify="space-between" align="center" mb={4}>
            <Flex align="center">
              <Select
                color="white"
                bg="#2D3748"
                borderColor="#4A5568"
                value={language}
                onChange={(e) => {
                  const selectedLanguage = e.target.value;
                  setLanguage(selectedLanguage);
                  setCode(CODE_SNIPPETS[selectedLanguage]);
                }}
                width="200px"
                mr={4}
                _hover={{ borderColor: "#63B3ED" }}
                _focus={{
                  borderColor: "#63B3ED",
                  boxShadow: "0 0 0 1px #63B3ED",
                }}
                sx={{
                  option: {
                    color: "black", 
                    bg: "white", 
                    _hover: {
                      bg: "#63B3ED", 
                      color: "white", 
                    },
                    _active: {
                      bg: "#3182ce", 
                      color: "white", 
                    },
                  },
                }}
              >
                {Object.keys(LANGUAGE_VERSIONS).map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </Select>

              <Button
                bg="transparent"
                borderColor="#A6F6FF"
                borderWidth="1px"
                color="#A6F6FF"
                _hover={{ borderColor: "#A6F6FF" }}
                _active={{ borderColor: "#A6F6FF" }}
                onClick={handleRunCode}
              >
                Run Code
              </Button>
            </Flex>
          </Flex>

          <Flex w="full" maxW="900px" gap={6}>
            <Box flex={1} bg="transparent" borderRadius="md" borderColor="#A6F6FF" borderWidth="1px" p={4} boxShadow="lg">
              <MonacoEditor
                height="350px"
                language={language}
                value={code}
                onChange={(value) => setCode(value)}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  lineNumbers: "on",
                  roundedSelection: true,
                }}
              />
            </Box>

            <Box flex={1} bg="transparent" borderRadius="md" borderColor="#A6F6FF" borderWidth="1px" p={4} boxShadow="lg" height="400px" overflowY="auto">
              <Box bg="#1A202C" color="white" p={3} height="100%" overflowY="auto">
                <pre>{output}</pre>
              </Box>
            </Box>
          </Flex>

          {isQuizActive && !quizFinished && output && (
            <Button
              bg="#3182ce"
              color="white"
              _hover={{ bg: "#2b6cb0" }}
              _active={{ bg: "#2b6cb0" }}
              mt={4}
              onClick={handleConfirm}
            >
              Submit
            </Button>
          )}
        </Flex>
      </Flex>
    </ChakraProvider>
  );
};

export default Compiler;
