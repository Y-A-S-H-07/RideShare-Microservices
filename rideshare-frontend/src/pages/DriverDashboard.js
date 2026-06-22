import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

function DriverDashboard() {
  const API = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [rides, setRides] = useState([]);
  const [driverId, setDriverId] = useState(null);
  const [hasActiveRide, setHasActiveRide] = useState(false);
  const [loading, setLoading] = useState(false);
  const [driverLoading, setDriverLoading] = useState(true);
  const [activeRide, setActiveRide] = useState(null);
  const token = localStorage.getItem("token");

  // redirect if not driver
  useEffect(() => {
    if (!user || user.role !== "DRIVER") {
      navigate("/login");
    }
  }, []);

  // load driver info
  useEffect(() => {
    fetchDriver();
  }, []);

  // fetch active ride after driver loads
  useEffect(() => {
    if (driverId) {
      fetchActiveRide();
    }
  }, [driverId]);

  const fetchActiveRide = async () => {
    const res = await fetch(`${API}/rides/all`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();

    const current = data.find(
      (r) =>
        r.driver?.id === driverId &&
        ["ACCEPTED", "ARRIVED", "STARTED"].includes(r.status)
    );

    setActiveRide(current);
  };

  const fetchDriver = async () => {
    try {
      const res = await fetch(
        `${API}/drivers/by-user?userId=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      setDriverId(data.id);
      setDriverLoading(false);
      checkActiveRide(data.id);
    } catch (err) {
      console.error(err);
      setDriverLoading(false);
    }
  };

  // check if driver already has an active ride
  const checkActiveRide = async (driverId) => {
    const res = await fetch(`${API}/rides/all`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();

    const active = data.find(
      (r) =>
        r.driver?.id === driverId &&
        ["ACCEPTED", "STARTED"].includes(r.status)
    );

    setHasActiveRide(!!active);
  };

  const fetchRides = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${API}/rides/available`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      setRides(data);
    } catch (err) {
      toast.error("Failed to load rides");
    }

    setLoading(false);
  };

  const acceptRide = async (rideId) => {
    try {
      const response = await fetch(
        `${API}/rides/accept?rideId=${rideId}&driverId=${driverId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
      } else {
        toast.success("Ride accepted");
        navigate(`/driver/ride/${rideId}`);
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const startRide = async (rideId) => {
    await fetch(`${API}/rides/start?rideId=${rideId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    toast.success("Ride started");
    fetchRides();
    checkActiveRide(driverId);
  };

  const completeRide = async (rideId) => {
    await fetch(`${API}/rides/complete?rideId=${rideId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    toast.success("Ride completed");
    fetchRides();
    checkActiveRide(driverId);
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4">

          <h1 className="text-3xl font-semibold text-gray-900 mb-6">
            Driver Dashboard
          </h1>

          {driverLoading ? (
            <div className="flex justify-center">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* active ride */}
              {activeRide && (
                <div className="bg-white p-5 rounded-xl border mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Active Ride
                  </h3>
                  <p className="text-gray-700">
                    {activeRide.source} → {activeRide.destination}
                  </p>

                  <button
                    className="mt-3 px-4 py-2 border rounded-md hover:bg-gray-100 active:scale-95"
                    onClick={() =>
                      navigate(`/driver/ride/${activeRide.id}`)
                    }
                  >
                    Go to Ride
                  </button>
                </div>
              )}

              <button
                className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-black transition active:scale-95 mb-6"
                onClick={fetchRides}
              >
                Load Available Rides
              </button>

              {loading && (
                <div className="flex justify-center">
                  <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
                </div>
              )}

              {!loading && rides.length === 0 && (
                <p className="text-center text-gray-400">
                  No available rides
                </p>
              )}

              {/* ride list */}
              <div className="space-y-4">
                {rides.map((ride) => (
                  <div
                    key={ride.id}
                    className="bg-white p-5 rounded-xl border hover:shadow-md transition cursor-pointer"
                    onClick={() =>
                      navigate("/ride-details", { state: ride })
                    }
                  >
                    <p className="font-medium text-gray-900">
                      {ride.source} → {ride.destination}
                    </p>

                    <div className="text-sm text-gray-600 mt-2 space-y-1">
                      <p>Status: {ride.status}</p>
                      <p>Fare: ₹{ride.totalFare?.toFixed(2)}</p>
                      <p>Distance: {ride.distance?.toFixed(2)} km</p>
                    </div>

                    <div className="mt-3 flex gap-2 flex-wrap">

                      {/* accept */}
                      <button
                        disabled={hasActiveRide || ride.status !== "CREATED"}
                        className={`px-3 py-1.5 border rounded-md text-sm active:scale-95 ${
                          hasActiveRide || ride.status !== "CREATED"
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          acceptRide(ride.id);
                        }}
                      >
                        {ride.status !== "CREATED"
                          ? "Not Available"
                          : hasActiveRide
                          ? "Assigned"
                          : "Accept"}
                      </button>

                      {/* start */}
                      {ride.status === "ACCEPTED" &&
                        ride.driver?.id === driverId && (
                          <button
                            className="px-3 py-1.5 border rounded-md text-sm hover:bg-gray-100 active:scale-95"
                            onClick={(e) => {
                              e.stopPropagation();
                              startRide(ride.id);
                            }}
                          >
                            Start
                          </button>
                        )}

                      {/* complete */}
                      {ride.status === "STARTED" &&
                        ride.driver?.id === driverId && (
                          <button
                            className="px-3 py-1.5 border rounded-md text-sm hover:bg-gray-100 active:scale-95"
                            onClick={(e) => {
                              e.stopPropagation();
                              completeRide(ride.id);
                            }}
                          >
                            Complete
                          </button>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default DriverDashboard;