import React, { useState } from "react";
import "./Login.css";
import { UserOutlined } from "@ant-design/icons";
import { Input, Button, Form } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { TextArea } = Input;

const Login = () => {
  const [isActive, setIsActive] = useState(false);

  const handleRegisterClick = () => {
    setIsActive(true);
  };

  // Handle login button click
  const handleLoginClick = () => {
    setIsActive(false);
  };

  //   const [passwordVisible, setPasswordVisible] = React.useState(false);
  //   const [showForm, setShowForm] = useState(false);
  //   const [username, setUsername] = useState("");
  //   const [password, setPassword] = useState("");

  //   const navigate = useNavigate();

  //   const openForm = () => {
  //     setShowForm(true);
  //   };

  //   const handleCancelSave = () => {
  //     setShowForm(false);
  //   };

  //   // const handleLogout = () => {
  //   //   localStorage.removeItem('user_id');
  //   //   navigate('/login'); // Redirect to login page or home page
  //   // };

  //   const handleLogin = () => {
  //     axios
  //       .post("http://127.0.0.1:8000/api/userLogin", { username, password })
  //       .then((response) => {
  //         const { user_id, usertype } = response.data;

  //         localStorage.setItem("user_id", user_id);

  //         if (usertype === "admin") {
  //           navigate("/admin");
  //         } else if (usertype === "student") {
  //           navigate("/student");
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Login error:", error);
  //       });
  //   };

  return (
    // <div className="container">
    //   <p className="svcc-name">Ultimate Trivia</p>
    //   <div className="signIn-container"></div>
    //   <div className="login-container">
    //     <p className="styled-text">Login</p>
    //     <Input
    //       className="username-input"
    //       placeholder="Username"
    //       prefix={<UserOutlined />}
    //       value={username}
    //       onChange={(e) => setUsername(e.target.value)}
    //     />
    //     <Input.Password
    //       className="password"
    //       placeholder="Password"
    //       value={password}
    //       onChange={(e) => setPassword(e.target.value)}
    //     />
    //     <div className="link-container">
    //       <Button className="link" type="link" onClick={openForm}>
    //         Create an Account
    //       </Button>
    //       <Button className="link" type="link">
    //         Forgot Password?
    //       </Button>
    //     </div>
    //     <Button className="login" type="primary" onClick={handleLogin}>
    //       Login
    //     </Button>
    //   </div>

    // </div>

    <div className="main-container">
      <div className={`container ${isActive ? "active" : ""}`} id="container">
        <div class="form-container sign-up">
          <form>
            <h1>Create Acount</h1>
            <div class="social-icons">
              <a href="#" class="icon"></a>
            </div>
            <span>or user your email for regitration</span>
            <input type="text" placeholder="Name"></input>
            <input type="text" placeholder="Last Name"></input>
            <input type="text" placeholder="Address"></input>
            <input type="text" placeholder="Email"></input>
            <input type="text" placeholder="Pasoword"></input>
            <button>Sign Up</button>
          </form>
        </div>
        <div class="form-container sign-in">
          <form>
            <h1>Sign In</h1>
            <div class="social-icons">
              <a href="#" class="icon"></a>
            </div>
            <span>or use your email password</span>
            <input type="text" placeholder="Email"></input>
            <input type="text" placeholder="Pasoword"></input>
            <a href="#">Forget Your Password?</a>
            <button>Sign In</button>
          </form>
        </div>
        <div class="toggle-container">
          <div class="toggle">
            <div class="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p>Enter your personal details to use all the site features </p>
              <button class="hidden" id="login" onClick={handleLoginClick}>
                Sign In
              </button>
            </div>
            <div class="toggle-panel toggle-right">
              <h1>Hello, Friend!</h1>
              <p>
                Register with your personal details to use all the site features{" "}
              </p>
              <button
                class="hidden"
                id="register"
                onClick={handleRegisterClick}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
