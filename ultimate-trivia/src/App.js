import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/LoginPage/Login";
import QuizGame from "./Components/QuizGame/QuizGame"; 
import DashboardLayout from "./Components/Dashboard/DashboardLayout";
import Trivia from "./Components/Trivia/Trivia";
import Tutorials from "./Tutorial/Tutorial";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/dashboard" element={<DashboardLayout />}></Route>
        <Route path="/quiz" element={<QuizGame />}></Route> 
        <Route path="/trivia" element={<Trivia />}></Route>
        <Route path="/tutorials" element={<Tutorials />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
