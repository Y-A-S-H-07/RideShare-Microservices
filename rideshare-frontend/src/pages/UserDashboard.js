import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

function UserDashboard() {
  const API = process.env.REACT_APP_API_URL;

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [myRides, setMyRides] = useState([]);

  useEffect(() => {
    if (!user || user.role !== "USER") {
      navigate("/login");
    }
  }, []);

  const fetchMyRides = async () => {
    try {

      const res = await fetch(`${API}/rides/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const data = await res.json();

      console.log("ALL RIDES =", data);
      console.log("CURRENT USER =", user);

      const filtered = data
        .filter(
          (ride) =>
            ride.hostId === user.id &&
            ride.status !== "COMPLETED"
        )
        .sort((a, b) => b.id - a.id);

      setMyRides(filtered);

    } catch (err) {
      console.error("Error fetching rides:", err);
    }
  };
  useEffect(() => {
    fetchMyRides();
  }, []);

  const fetchRequests = async (rideId) => {
    try {
      const res = await fetch(`${API}/rides/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await res.json();

      const ride = data.find((r) => r.id === rideId);
      if (!ride) return;

      const requests = (ride.participants || []).filter(
        (p) => p.status === "PENDING"
      );

      const updatedRide = { ...ride, requests };

      setMyRides((prev) =>
        prev.map((r) => (r.id === rideId ? updatedRide : r))
      );
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  const acceptRequest = async (rideId, userId) => {
    try {
      await fetch(
        `${API}/rides/accept-request?rideId=${rideId}&userId=${userId}&hostId=${user.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      fetchMyRides();
    } catch (err) {
      console.error("Error accepting request:", err);
    }
  };

  const rejectRequest = async (rideId, userId) => {
    try {
      await fetch(
        `${API}/rides/reject-request?rideId=${rideId}&userId=${userId}&hostId=${user.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      fetchMyRides();
    } catch (err) {
      console.error("Error rejecting request:", err);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">

          {/* HEADER */}
          <h1 className="text-4xl font-semibold text-gray-900 mb-2">
            Welcome, {user.name}
          </h1>
          <p className="text-gray-500 mb-10">
            Manage your rides smoothly
          </p>

          {/* ACTIONS */}
          <div className="grid md:grid-cols-3 gap-5 mb-12">

            <div className="bg-white p-5 rounded-xl border hover:shadow-sm transition">
              <h3 className="text-base font-medium mb-4 text-gray-700">
                Create Ride
              </h3>
              <button
                className="w-full py-2 rounded-md bg-gray-900 text-white hover:bg-black transition"
                onClick={() => navigate("/create-ride")}
              >
                Open
              </button>
            </div>

            <div className="bg-white p-5 rounded-xl border hover:shadow-sm transition">
              <h3 className="text-base font-medium mb-4 text-gray-700">
                Search Ride
              </h3>
              <button
                className="w-full py-2 rounded-md bg-gray-900 text-white hover:bg-black transition"
                onClick={() => navigate("/search-ride")}
              >
                Open
              </button>
            </div>

            <div className="bg-white p-5 rounded-xl border hover:shadow-sm transition">
              <h3 className="text-base font-medium mb-4 text-gray-700">
                Ride History
              </h3>
              <button
                className="w-full py-2 rounded-md bg-gray-900 text-white hover:bg-black transition"
                onClick={() => navigate("/history")}
              >
                Open
              </button>
            </div>

          </div>

          {/* MY RIDES */}
          <h2 className="text-xl font-semibold text-gray-800 mb-5">
            My Rides
          </h2>

          {myRides.length === 0 ? (
            <p className="text-gray-400">No rides yet</p>
          ) : (
            <div className="space-y-5">
              {myRides.map((ride) => (
                <div
                  key={ride.id}
                  className="bg-white p-5 rounded-xl border hover:shadow-sm transition"
                >
                  <div className="flex justify-between items-center">
                    <p className="text-gray-900 font-medium">
                      {ride.source} → {ride.destination}
                    </p>
                    <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                      {ride.status}
                    </span>
                  </div>

                  <button
                    className="mt-3 text-sm text-gray-700 underline hover:text-black"
                    onClick={() => fetchRequests(ride.id)}
                  >
                    View Requests
                  </button>

                  {ride.requests && (
                    <div className="mt-4 space-y-2">
                      {ride.requests.length > 0 ? (
                        ride.requests.map((req) => (
                          <div
                            key={req.id}
                            className="flex justify-between items-center text-sm"
                          >
                            <p>User ID: {req.userId}</p>

                            <div className="flex gap-2">
                              <button
                                className="px-3 py-1 border rounded hover:bg-gray-100"
                                onClick={() =>
                                  acceptRequest(ride.id, req.userId)
                                }
                              >
                                Accept
                              </button>

                              <button
                                className="px-3 py-1 border rounded hover:bg-gray-100"
                                onClick={() =>
                                  rejectRequest(ride.id, req.userId)
                                }
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 text-sm">
                          No requests yet
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default UserDashboard;