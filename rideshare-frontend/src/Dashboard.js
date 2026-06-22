import React, { useState } from "react";

function Dashboard({ user }) {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [rides, setRides] = useState([]);
  const [aiResult, setAiResult] = useState("");

  // 🔍 search rides
  const searchRides = async () => {
    const res = await fetch(
      `http://localhost:8080/rides/search?source=${source}&destination=${destination}`
    );
    const data = await res.json();
    setRides(data);
  };

  // 🤖 AI suggest
  const aiSuggest = async () => {
    const res = await fetch(
      `http://localhost:8080/rides/ai-suggest?source=${source}&destination=${destination}`
    );
    const text = await res.text();
    setAiResult(text);
  };

  // 👥 join ride
  const joinRide = async (rideId) => {
    await fetch(
      `http://localhost:8080/rides/join?rideId=${rideId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id })
      }
    );
    alert("Joined!");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Welcome, {user.name} 🚗</h2>

      <input
        placeholder="Source"
        value={source}
        onChange={(e) => setSource(e.target.value)}
      />

      <input
        placeholder="Destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />

      <br /><br />

      <button onClick={searchRides}>Search Rides</button>
      <button onClick={aiSuggest}>AI Suggest</button>

      <h3>AI Result:</h3>
      <p>{aiResult}</p>

      <h3>Available Rides:</h3>
      {rides.map((ride) => (
        <div key={ride.id} style={{ border: "1px solid black", margin: 10, padding: 10 }}>
          <p>{ride.source} → {ride.destination}</p>
          <p>Seats: {ride.availableSeats}</p>
          <button onClick={() => joinRide(ride.id)}>Join</button>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;