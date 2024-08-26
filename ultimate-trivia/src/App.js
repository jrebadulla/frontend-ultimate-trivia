import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/LoginPage/Login";
import QuizGame from "./Components/QuizGame/QuizGame"; 
import DashboardLayout from "./Components/Dashboard/DashboardLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/dashboard" element={<DashboardLayout />}></Route>
        <Route path="/quiz" element={<QuizGame />}></Route> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
