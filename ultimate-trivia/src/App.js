import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/LoginPage/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        {/* <Route path="/student" element={<StudentDashboard />}></Route>
        <Route path="/admin" element={<AdminDashboard />}></Route>
        <Route path="/librarian" element={<LibrarianDashboard />}></Route> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
