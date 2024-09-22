import React, { useState } from "react";
import "./Login.css";
import { UserOutlined } from "@ant-design/icons";
import { Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import Logo from "../Image/trivia-logo.png";
import axios from "axios";

const Login = () => {
  const [isActive, setIsActive] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    username: "",
    level_id: "",
    profile_picture: null,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      profile_picture: file,
    });

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleRegisterClick = () => {
    setIsActive(true);
  };

  const handleClick = () => {
    setIsActive(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    formDataToSend.append("firstname", formData.firstname);
    formDataToSend.append("lastname", formData.lastname);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("username", formData.username);
    formDataToSend.append("level_id", formData.level_id);

    if (formData.profile_picture) {
      formDataToSend.append("profile_picture", formData.profile_picture);
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/insertUsers",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      message.success("Sign up successful!");
      console.log(response.data);
    } catch (error) {
      console.error(error);
      message.error("Error during signup");
    }
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    axios
      .post("http://127.0.0.1:8000/api/userLogin", { username, password })
      .then((response) => {
        const { user_id, firstname, lastname, level_id, profile_picture } =
          response.data.user;

        localStorage.setItem(
          "user",
          JSON.stringify({
            firstname,
            lastname,
            user_id,
            level_id,
            profile_picture,
          })
        );

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
              type="username"
              placeholder="Username"
              name="username"
              value={formData.username}
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
            <select
              name="level_id"
              value={formData.level_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Your Year Level</option>
              <option value="1">First Year</option>
              <option value="2">Second Year</option>
              <option value="3">Third Year</option>
              <option value="4">Fourth Year</option>
            </select>
            <label className="upload-btn" htmlFor="file-upload">
              Upload Profile Picture
            </label>
            <input
              type="file"
              id="file-upload"
              name="profile_picture"
              accept="image/*"
              onChange={handleFileChange}
            />

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="upload-preview"
              />
            )}
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
              type="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
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
