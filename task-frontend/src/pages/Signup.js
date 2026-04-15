import React, { useState } from "react";
import API from "../api/axios";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "USER"
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    try {
      setError("");
      setMessage("");

      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      await API.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role
      });

      setMessage("✅ Account created successfully! You can login now.");

    } catch (err) {
      setError("❌ Registration failed (Email may already exist)");
    }
  };

  return (
    <div className="form">

      <h2 style={{ marginBottom: "10px" }}>Create Account ✨</h2>
      <p style={{ fontSize: "14px", color: "gray" }}>
        Register to get started
      </p>

      {/* NAME */}
      <input
        placeholder="Full Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      {/* EMAIL */}
      <input
        type="email"
        placeholder="Email Address"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      {/* PASSWORD */}
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      {/* CONFIRM PASSWORD */}
      <input
        type="password"
        placeholder="Confirm Password"
        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
      />

      {/* ROLE */}
      <select
        onChange={(e) => setForm({ ...form, role: e.target.value })}
      >
        <option value="USER">USER</option>
        <option value="ADMIN">ADMIN</option>
      </select>

      {/* ERROR / SUCCESS */}
      {error && <p className="error">{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      {/* BUTTON */}
      <button onClick={handleSignup}>Create Account</button>

    </div>
  );
}

export default Signup;