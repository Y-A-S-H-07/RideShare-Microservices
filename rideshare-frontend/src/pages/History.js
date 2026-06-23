import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function History() {
  const API = process.env.REACT_APP_API_URL;
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      const res = await fetch(`${API}/rides/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      const myRides = data.filter((ride) => {
        const isHost = ride.hostId === user.id;

        const isParticipant = (ride.participants || []).some(
          (p) => p.userId === user.id
        );

        return isHost || isParticipant;
      });

      setRides(myRides);
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4">

          <h1 className="text-3xl font-semibold text-gray-900 mb-6">
            My Ride History
          </h1>

          {loading && (
            <div className="flex justify-center">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
            </div>
          )}

          {!loading && rides.length === 0 && (
            <p className="text-center text-gray-400">
              No rides found
            </p>
          )}

          <div className="space-y-4">
            {rides.map((ride) => {
              const isHost = ride.hostId === user.id;

              const myParticipant = (ride.participants || []).find(
                (p) => p.userId === user.id
              );

              return (
                <div
                  key={ride.id}
                  className="bg-white p-5 rounded-xl border hover:shadow-md transition"
                >
                  <p className="font-medium text-gray-900">
                    {ride.source} → {ride.destination}
                  </p>

                  <div className="text-sm text-gray-600 mt-2 space-y-1">
                    <p>Ride Status: {ride.status}</p>
                    <p>Fare: ₹{Number(ride.totalFare).toFixed(2)}</p>

                    <p>
                      Role: {isHost ? "Host" : "Participant"}
                    </p>

                    {!isHost && myParticipant && (
                      <p>
                        Request Status: {myParticipant.status}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </>
  );
}

export default History;