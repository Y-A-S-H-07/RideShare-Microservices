import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

function DriverRideDetails() {
  const API = process.env.REACT_APP_API_URL;
  const { rideId } = useParams();
  const navigate = useNavigate();

  const [ride, setRide] = useState(null);

  // fetch ride details
  const fetchRide = async () => {
    try {
      const res = await fetch(`${API}/rides/all`);
      const data = await res.json();

      const currentRide = data.find(
        (r) => r.id === parseInt(rideId)
      );

      setRide(currentRide);
    } catch (err) {
      toast.error("Failed to load ride");
    }
  };

  useEffect(() => {
    fetchRide();
  }, []);

  const arrived = async () => {
    await fetch(`${API}/rides/arrived?rideId=${rideId}`, {
      method: "POST",
    });
    toast.success("Arrived at pickup");
    fetchRide();
  };

  const startRide = async () => {
    await fetch(`${API}/rides/start?rideId=${rideId}`, {
      method: "POST",
    });
    toast.success("Ride started");
    fetchRide();
  };

  const completeRide = async () => {
    await fetch(`${API}/rides/complete?rideId=${rideId}`, {
      method: "POST",
    });
    toast.success("Ride completed");
    fetchRide();
  };

  if (!ride) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex justify-center items-center">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-xl mx-auto px-4">

          {/* back */}
          <button
            onClick={() => navigate(-1)}
            className="mb-6 text-sm text-gray-500 hover:text-black"
          >
            ← Back
          </button>

          {/* ride info */}
          <div className="bg-white p-6 rounded-xl border space-y-4">

            <h2 className="text-xl font-semibold text-gray-900">
              Ride Details
            </h2>

            <div className="flex justify-between">
              <span className="text-gray-500">Route</span>
              <span className="font-medium">
                {ride.source} → {ride.destination}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                {ride.status}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Fare</span>
              <span className="font-medium">
                ₹{ride.totalFare?.toFixed(2)}
              </span>
            </div>

            {/* actions */}
            <div className="pt-4">

              {ride.status === "ACCEPTED" && (
                <button
                  onClick={arrived}
                  className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-black transition active:scale-95"
                >
                  Arrived
                </button>
              )}

              {ride.status === "ARRIVED" && (
                <button
                  onClick={startRide}
                  className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-black transition active:scale-95"
                >
                  Start Ride
                </button>
              )}

              {ride.status === "STARTED" && (
                <button
                  onClick={completeRide}
                  className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-black transition active:scale-95"
                >
                  Complete Ride
                </button>
              )}

            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default DriverRideDetails;