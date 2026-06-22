import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

function Login() {

  const API = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.userId) {

        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.userId,
            name: data.name,
            role: data.role
          })
        );

        localStorage.setItem("token", data.token);

        if (data.role === "USER") {
          navigate("/user-dashboard");
        } else {
          navigate("/driver-dashboard");
        }

      } else {
        alert("Invalid login");
      }
    } catch (err) {
      alert("Backend error");
    }
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f5f5f5"
    }}>
      <div style={{
        width: 350,
        padding: 30,
        background: "white",
        borderRadius: 10,
        boxShadow: "0 0 10px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ textAlign: "center" }}>Login</h2>

        <input
          style={{ width: "100%", padding: 10, marginTop: 20 }}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={{ width: "100%", padding: 10, marginTop: 15 }}
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          style={{
            width: "100%",
            padding: 10,
            marginTop: 20,
            background: "black",
            color: "white",
            border: "none"
          }}
          onClick={handleLogin}
        >
          Login
        </button>

        <p
          style={{ marginTop: 15, textAlign: "center", cursor: "pointer" }}
          onClick={() => navigate("/register")}
        >
          New user? Sign Up
        </p>
      </div>
    </div>
  );
}

export default Login;