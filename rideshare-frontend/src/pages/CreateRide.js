import React, { useState } from "react";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import { useEffect } from "react";

function CreateRide() {



  const API = process.env.REACT_APP_API_URL;
  const user = JSON.parse(localStorage.getItem("user"));

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [hostSeats, setHostSeats] = useState(1);
  const [hasActiveRide, setHasActiveRide] = useState(false);

  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);

  const [fares, setFares] = useState({});
  const [loadingFare, setLoadingFare] = useState(false);

  const fetchLocations = async (query, setSuggestions) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=5`,
        { headers: { "User-Agent": "ride-sharing-app" } }
      );

      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error("Location error:", err);
    }
  };

  const getFare = async () => {
    if (!source || !destination) {
      toast.error("Enter source and destination first");
      return;
    }

    setLoadingFare(true);

    const types = ["3_SEATER", "4_SEATER", "5_SEATER", "7_SEATER"];
    const result = {};

    try {
      for (let type of types) {
        const res = await fetch(
          `${API}/rides/estimate?source=${source}&destination=${destination}&vehicleType=${type}`
        );

        const data = await res.json();
        result[type] = data.toFixed(2);
      }

      setFares(result);
    } catch (err) {
      toast.error("Error fetching fare");
    }

    setLoadingFare(false);
  };

  const createRide = async () => {
    if (hasActiveRide) {
      toast.error("You already have an active ride");
      return;
    }

    if (!vehicleType) {
      toast.error("Please select vehicle type");
      return;
    }

    try {
      const res = await fetch(`${API}/rides/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source,
          destination,
          vehicleType,
          hostSeats,
          totalFare: Number(fares[vehicleType] || 0),
          host: { id: user.id }
        })
      });

      const data = await res.json();

      toast.success(
        `Ride Created! ₹${data.totalFare.toFixed(2)} • ${data.distance.toFixed(1)} km`
      );
      setHasActiveRide(true);
    } catch (err) {
      toast.error("Error creating ride");
    }
  };

  useEffect(() => {
    fetch(`${API}/rides/all`)
      .then(res => res.json())
      .then(data => {
        const active = data.some(
          r =>
            r.host?.id === user.id &&
            ["CREATED", "ACCEPTED", "STARTED"].includes(r.status)
        );
        setHasActiveRide(active);
      });
  }, []);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4">

          <h1 className="text-3xl font-semibold text-gray-900 mb-6">
            Create Ride
          </h1>

          <div className="bg-white p-5 rounded-xl border space-y-4">

            {/* SOURCE */}
            <div>
              <input
                className="w-full border rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
                placeholder="Enter source"
                value={source}
                onChange={(e) => {
                  const value = e.target.value;
                  setSource(value);
                  fetchLocations(value, setSourceSuggestions);
                }}
              />

              {sourceSuggestions.length > 0 && (
                <div className="border rounded-md mt-1 bg-white">
                  {sourceSuggestions.map((place, i) => (
                    <div
                      key={i}
                      className="px-3 py-2 hover:bg-gray-200 cursor-pointer text-sm"
                      onClick={() => {
                        setSource(place.display_name);
                        setSourceSuggestions([]);
                      }}
                    >
                      {place.display_name.split(",").slice(0, 2).join(", ")}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* DESTINATION */}
            <div>
              <input
                className="w-full border rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
                placeholder="Enter destination"
                value={destination}
                onChange={(e) => {
                  const value = e.target.value;
                  setDestination(value);
                  fetchLocations(value, setDestinationSuggestions);
                }}
              />

              {destinationSuggestions.length > 0 && (
                <div className="border rounded-md mt-1 bg-white">
                  {destinationSuggestions.map((place, i) => (
                    <div
                      key={i}
                      className="px-3 py-2 hover:bg-gray-200 cursor-pointer text-sm"
                      onClick={() => {
                        setDestination(place.display_name);
                        setDestinationSuggestions([]);
                      }}
                    >
                      {place.display_name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SEATS */}
            <input
              className="w-full border rounded-md px-3 py-2 text-gray-900"
              type="number"
              placeholder="Host Seats"
              value={hostSeats}
              onChange={(e) => setHostSeats(e.target.value)}
            />

            {/* GET FARE */}
            <button
              className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-black transition active:scale-95"
              onClick={getFare}
            >
              Get Fare
            </button>

            {loadingFare && (
              <div className="flex justify-center mt-2">
                <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
              </div>
            )}

            {/* VEHICLE SELECT */}
            {Object.keys(fares).length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Select Vehicle</p>

                {Object.entries(fares).map(([type, price]) => (
                  <div
                    key={type}
                    onClick={() => setVehicleType(type)}
                    className={`p-3 rounded-md border cursor-pointer transition ${
                      vehicleType === type
                        ? "border-black bg-gray-100"
                        : "border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {type.replace("_", " ")} — ₹{price}
                  </div>
                ))}
              </div>
            )}

            {/* CREATE */}
            <button
              disabled={hasActiveRide}
              className={`w-full py-2 rounded-md text-white ${
                hasActiveRide
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-900 hover:bg-black"
              }`}
              onClick={createRide}
            >
              {hasActiveRide ? "Active Ride Exists" : "Create Ride"}
            </button>

          </div>
        </div>
      </div>
    </>
  );
}

export default CreateRide;