import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import "./Auth.css";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-container">

      {/* LEFT PANEL */}
      <div className="auth-left">
        <div className="brand">
          🛡️ <span>TaskSecure</span>
        </div>

        <div className="left-content">
          <h1>Secure Role-Based Task & Collaboration</h1>
          <p>
            Manage projects with confidence. Role-based access ensures
            the right people have the right permissions at every level.
          </p>
        </div>

        <div className="footer">
          © 2026 TaskSecure. Enterprise-grade security.
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="auth-right">
        <div className="auth-card">

          <h2>Welcome back</h2>
          <p className="subtitle">
            Sign in to your account to continue
          </p>

          {/* FORM SWITCH */}
          {isLogin ? <Login /> : <Signup />}

          <p className="switch">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <span onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? " Create account" : " Login"}
            </span>
          </p>

        </div>
      </div>

    </div>
  );
}

export default AuthPage;