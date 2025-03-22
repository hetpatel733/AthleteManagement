import React from "react";
import LoginForm from "../components/LoginForm";
import HeroSection from "../components/HeroSection";
import "../styles/AuthPage.css";

const AuthPage = () => {
  return (
    <div className="auth-container">
      <div className="login-section">
        <LoginForm />
      </div>
      <div className="hero-section">
        <HeroSection />
      </div>
    </div>
  );
};

export default AuthPage;
