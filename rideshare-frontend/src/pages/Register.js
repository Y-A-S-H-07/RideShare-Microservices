import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const API = process.env.REACT_APP_API_URL;

  const [role, setRole] = useState("USER");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [vehicleName, setVehicleName] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [maxSeats, setMaxSeats] = useState(4);

  const navigate = useNavigate();

  const register = async () => {
    const url =
      role === "DRIVER"
        ? `${API}/drivers/register`
        : `${API}/users/register`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(
          role === "DRIVER"
            ? {
                name,
                email,
                password,
                vehicleName,
                vehicleNumber,
                maxSeats: Number(maxSeats)
              }
            : { name, email, password }
        )
      });

      const text = await res.text();
      console.log(text);

      if (res.ok) {
        alert("Registered successfully");
        navigate("/login");
      } else {
        alert(text);
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
        width: 400,
        padding: 30,
        background: "white",
        borderRadius: 10,
        boxShadow: "0 0 10px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ textAlign: "center" }}>Register</h2>

        <select
          style={{ width: "100%", padding: 10, marginTop: 15 }}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="USER">User</option>
          <option value="DRIVER">Driver</option>
        </select>

        <input
          style={{ width: "100%", padding: 10, marginTop: 15 }}
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          style={{ width: "100%", padding: 10, marginTop: 15 }}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={{ width: "100%", padding: 10, marginTop: 15 }}
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        {role === "DRIVER" && (
          <>
            <input
              style={{ width: "100%", padding: 10, marginTop: 15 }}
              placeholder="Vehicle Name"
              onChange={(e) => setVehicleName(e.target.value)}
            />

            <input
              style={{ width: "100%", padding: 10, marginTop: 15 }}
              placeholder="Vehicle Number"
              onChange={(e) => setVehicleNumber(e.target.value)}
            />

            <input
              style={{ width: "100%", padding: 10, marginTop: 15 }}
              type="number"
              placeholder="Max Seats"
              onChange={(e) => setMaxSeats(e.target.value)}
            />
          </>
        )}

        <button
          style={{
            width: "100%",
            padding: 10,
            marginTop: 20,
            background: "black",
            color: "white",
            border: "none"
          }}
          onClick={register}
          
        >

          
          Register
        </button>

        <p
          style={{ marginTop: 15, textAlign: "center", cursor: "pointer" }}
          onClick={() => navigate("/login")}
        >
          Already have an account? Login
        </p>
      </div>
    </div>
  );
}

export default Register;