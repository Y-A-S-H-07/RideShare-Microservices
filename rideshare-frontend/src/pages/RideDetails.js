import { useLocation, useNavigate } from "react-router-dom";
import React from "react";
import Navbar from "../components/Navbar";

function RideDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const ride = location.state;

  if (!ride) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
          <p className="text-gray-500 mb-4">No ride data found</p>

          <button
            className="px-4 py-2 border rounded-md hover:bg-gray-100"
            onClick={() => navigate("/search-ride")}
          >
            Go Back
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">

          {/* BACK BUTTON */}
          <button
            className="mb-6 text-sm text-gray-500 hover:text-black"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          {/* TITLE */}
          <h1 className="text-3xl font-semibold text-gray-900 mb-6">
            Ride Details
          </h1>

          {/* CARD */}
          <div className="bg-white p-6 rounded-xl border space-y-4">

            <div className="flex justify-between">
              <span className="text-gray-500">Route</span>
              <span className="font-medium text-gray-900">
                {ride.source} → {ride.destination}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                {ride.status}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Fare</span>
              <span className="font-medium text-gray-900">
                ₹{ride.totalFare?.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Distance</span>
              <span className="font-medium text-gray-900">
                {ride.distance?.toFixed(2)} km
              </span>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}

export default RideDetails;