import React, { useState } from "react";
import "./Login.css";
import { UserOutlined } from "@ant-design/icons";
import { Input, Button, Form } from "antd";
import { useNavigate } from "react-router-dom";
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

  const handleSignInClick = () => {
    setIsActive(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/insertUsers",
        formData
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignIn = () => {
    axios
      .post("http://127.0.0.1:8000/api/userLogin", { email, password })
      .then((response) => {
        const { user_id } = response.data;

        localStorage.setItem("user_id", user_id);

        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("Login error:", error);
      });
  };

  return (
    <div className="main-container">
      <div className={`container ${isActive ? "active" : ""}`} id="container">
        <div class="form-container sign-up">
          <form>
            <h1>Create Acount</h1>
            <br></br>
            <div class="social-icons">
              <a href="#" class="icon"></a>
            </div>
            <input
              type="text"
              placeholder="Name"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              required
            ></input>
            <input
              type="text"
              placeholder="Last Name"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              required
            ></input>
            <input
              type="text"
              placeholder="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            ></input>
            <input
              type="text"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            ></input>
            <input
              type="text"
              placeholder="Pasoword"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            ></input>
            <button onClick={handleSignUp}>Sign Up</button>
          </form>
        </div>
        <div class="form-container sign-in">
          <form>
            <h1>Sign In</h1>
            <br></br>
            <div class="social-icons">
              <a href="#" class="icon"></a>
            </div>

            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            ></input>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Pasoword"
            ></input>
            <a href="#">Forget Your Password?</a>
            <button onClick={handleSignIn}>Sign In</button>
          </form>
        </div>
        <div class="toggle-container">
          <div class="toggle">
            <div class="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p>Enter your personal details to use all the site features </p>
              <button class="hidden" id="login" onClick={handleSignInClick}>
                Sign In
              </button>
            </div>
            <div class="toggle-panel toggle-right">
              <h1>Welcome, To Ultimate Trivia!</h1>
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
