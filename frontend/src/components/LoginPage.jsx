import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState(""); // Corrected setLastName to setUsername
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/api/auth/login",
        {
          username,
          password,
        }
      );

      // Store JWT in localStorage if login is successful
      localStorage.setItem("token", response.data.token);

      // Redirect to the feedback page
      navigate("/feedback");
    } catch (err) {
      // Handle error: display the error message returned from the backend
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message); // Show server's error message
      } else {
        setError("An error occurred during login.");
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Corrected onChange handler
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
      <p>
        Do not have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
};

export default LoginPage;
