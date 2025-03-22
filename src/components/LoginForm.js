import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginForm.css";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // For password toggle


// const navigate = useNavigate();
const LoginForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    cpassword: "",
    acc_type: "Athlete",
    showPassword: false,
  });

  const [passwordErrors, setPasswordErrors] = useState([]);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Store backend errors

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      if (name === "password" || name === "cpassword") {
        validatePassword(updatedData.password, updatedData.cpassword);
      }

      return updatedData;
    });
  };

  // Toggle Password Visibility
  const togglePassword = () => {
    setFormData({ ...formData, showPassword: !formData.showPassword });
  };

  // Password Validator
  const validatePassword = (password, cpassword) => {
    let errors = [];

    if (password.length < 8) errors.push("Minimum 8 characters");
    if (!/[a-z]/.test(password)) errors.push("At least 1 lowercase letter");
    if (!/[A-Z]/.test(password)) errors.push("At least 1 uppercase letter");
    if (!/[0-9]/.test(password)) errors.push("At least 1 number");
    if (!/[!@#$%?=*&]/.test(password))
      errors.push("At least 1 special character (!@#$%?=*&)");

    if (password !== cpassword)
      errors.push("Password and Confirm Password must match");

    setPasswordErrors(errors);
    setIsPasswordValid(errors.length === 0);
  };

  // 🔹 Handle Registration API Request
  const handleRegister = async (e) => {
    e.preventDefault();

    const requestBody = {
      fname: formData.fname,
      lname: formData.lname,
      email: formData.email,
      password: formData.password,
      cPassword: formData.cpassword,
      acc_type: formData.acc_type
    };

    console.log("📤 Sending Data:", requestBody); // Debug frontend request

    try {
      const response = await fetch("http://localhost:8000/server/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Ensure JSON headers
        body: JSON.stringify(requestBody) // Ensure correct JSON format
      });

      const data = await response.json();
      if (data.success) {
        // navigate("/dashboard");
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error("❌ Network Error:", error);
    }
  };


  // 🔹 Handle Login API Request
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors

    try {
      const response = await fetch("http://localhost:8000/server/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Login failed");
      } else {
        alert("Login successful!");
        // Redirect or store token here
      }
    } catch (error) {
      setErrorMessage("Network error. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="form-box">
        <h2>Athlete Management System</h2>
        <div className="toggle-buttons">
          <button className={isLogin ? "active" : ""} onClick={() => setIsLogin(true)}>
            Login
          </button>
          <button className={!isLogin ? "active" : ""} onClick={() => setIsLogin(false)}>
            Register
          </button>
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Show backend errors */}

        {isLogin ? (
          // 🔹 Login Form
          <form className="login-form" onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              onChange={handleChange}
            />
            <div className="password-container">
              <input
                type={formData.showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                required
                onChange={handleChange}
              />
              <span className="eye-icon" onClick={togglePassword}>
                {formData.showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <button className="submit-btn">Login</button>
          </form>
        ) : (
          // 🔹 Register Form
          <form className="register-form" onSubmit={handleRegister}>
            <input type="text" name="fname" placeholder="First Name" required onChange={handleChange} />
            <input type="text" name="lname" placeholder="Last Name" required onChange={handleChange} />
            <input type="email" name="email" placeholder="Email" required onChange={handleChange} />

            <div className="password-container">
              <input
                type={formData.showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                required
                onChange={handleChange}
              />
              <span className="eye-icon" onClick={togglePassword}>
                {formData.showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="password-container">
              <input
                type="password"
                name="cpassword"
                placeholder="Confirm Password"
                required
                onChange={handleChange}
              />
            </div>

            {/* Display password validation errors */}
            <div className="password-errors">
              {passwordErrors.map((error, index) => (
                <p key={index} className="error-message">{error}</p>
              ))}
            </div>

            <select name="acc_type" onChange={handleChange}>
              <option value="Athlete">Athlete</option>
              <option value="Coach">Coach</option>
              <option value="Manager">Manager</option>
              <option value="Sponsor">Sponsor</option>
            </select>
            <button className="submit-btn" disabled={!isPasswordValid}>Register</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
