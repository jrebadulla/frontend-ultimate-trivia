import React, { useState } from "react";
import "./Login.css";
import { UserOutlined } from "@ant-design/icons";
import { Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import Logo from "../Image/trivia-logo.png";
import axios from "axios";

const Login = () => {
  const [isActive, setIsActive] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    address: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRegisterClick = () => {
    setIsActive(true);
  };

  const handleClick = () => {
    setIsActive(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/insertUsers",
        formData
      );
      message.success("Sign up successful!");
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    axios
      .post("http://127.0.0.1:8000/api/userLogin", { email, password })
      .then((response) => {
        const { user_id } = response.data;
        message.success("Login successful!");
        localStorage.setItem("user_id", user_id);
        navigate("/dashboard");
      })
      .catch((error) => {
        message.error(
          "Login failed. Please check your credentials and try again."
        );
      });
  };

  return (
    <div className="main-container">
      <div className={`container ${isActive ? "active" : ""}`} id="container">
        <div className="form-container sign-up">
          <form>
            <h1>Create Acount</h1>
            <br></br>
            <div className="social-icons">
              <a href="#" className="icon"></a>
            </div>
            <input
              type="firstname"
              placeholder="Name"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              required
            ></input>
            <input
              type="lastname"
              placeholder="Last Name"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              required
            ></input>
            <input
              type="address"
              placeholder="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            ></input>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            ></input>
            <input
              type="password"
              placeholder="Pasoword"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            ></input>
            <button onClick={handleSignUp}>Sign Up</button>
          </form>
        </div>
        <div className="form-container sign-in">
          <form>
            <h1>Sign In</h1>
            <br></br>
            <div className="social-icons">
              <a href="#" className="icon"></a>
            </div>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            ></input>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Pasoword"
              required
            ></input>
            <a href="#">Forget Your Password?</a>
            <button onClick={handleSignIn}>Login</button>
          </form>
        </div>
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <img src={Logo} />
              <h1>Welcome Back!</h1>
              <p>Enter your personal details to use all the site features </p>
              <button className="hidden" id="login" onClick={handleClick}>
                Sign In
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <img src={Logo} />
              <h1>Welcome, To Ultimate Trivia!</h1>
              <p>
                Register with your personal details to use all the site features{" "}
              </p>
              <button
                className="hidden"
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
