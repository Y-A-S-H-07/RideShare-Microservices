import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function SearchRide() {
  const API = process.env.REACT_APP_API_URL;

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [rides, setRides] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);

  const [debouncedSource, setDebouncedSource] = useState("");
  const [debouncedDestination, setDebouncedDestination] = useState("");

  // ------------------ DEBOUNCE ------------------
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSource(source);
    }, 500);

    return () => clearTimeout(timer);
  }, [source]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedDestination(destination);
    }, 500);

    return () => clearTimeout(timer);
  }, [destination]);

  // ------------------ FETCH LOCATIONS ------------------
  const fetchLocations = async (query, setSuggestions) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=5`,
        {
          headers: { "User-Agent": "ride-sharing-app" }
        }
      );

      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error("Location error:", err);
    }
  };

  // Call API only after debounce
  useEffect(() => {
    fetchLocations(debouncedSource, setSourceSuggestions);
  }, [debouncedSource]);

  useEffect(() => {
    fetchLocations(debouncedDestination, setDestinationSuggestions);
  }, [debouncedDestination]);

  // ------------------ SEARCH RIDES ------------------
  const searchRides = async () => {
    if (!source || !destination) {
      toast.error("Please enter source and destination");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${API}/rides/search?source=${source}&destination=${destination}`
      );

      const data = await res.json();
      setRides(data);
      setSearched(true);
    } catch (err) {
      toast.error("Failed to fetch rides");
    }

    setLoading(false);
  };

  // ------------------ JOIN RIDE ------------------
  const joinRide = async (rideId) => {
    try {
      const res = await fetch(
        `${API}/rides/join?rideId=${rideId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: user.id })
        }
      );

      const message = await res.text();
      toast.success(message);
    } catch (err) {
      toast.error("Failed to join ride");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4">

          <h1 className="text-3xl font-semibold text-gray-900 mb-6">
            Search Ride
          </h1>

          <div className="bg-white p-5 rounded-xl border space-y-4">

            {/* SOURCE */}
            <div>
              <input
                className="w-full border rounded-md px-3 py-2"
                placeholder="Enter source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
              />

              {sourceSuggestions.length > 0 && (
                <div className="border rounded-md mt-1 bg-white">
                  {sourceSuggestions.map((place, i) => (
                    <div
                      key={i}
                      className="px-3 py-2 hover:bg-gray-200 cursor-pointer text-sm"
                      onClick={() => {
                        setSource(place.display_name.split(",")[0].toLowerCase());
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
                className="w-full border rounded-md px-3 py-2"
                placeholder="Enter destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />

              {destinationSuggestions.length > 0 && (
                <div className="border rounded-md mt-1 bg-white">
                  {destinationSuggestions.map((place, i) => (
                    <div
                      key={i}
                      className="px-3 py-2 hover:bg-gray-200 cursor-pointer text-sm"
                      onClick={() => {
                        setDestination(place.display_name.split(",")[0].toLowerCase());
                        setDestinationSuggestions([]);
                      }}
                    >
                      {place.display_name.split(",").slice(0, 2).join(", ")}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* BUTTON */}
            <button
              className="w-full bg-gray-900 text-white py-2 rounded-md"
              onClick={searchRides}
            >
              Search
            </button>
          </div>

          {/* RESULTS */}
          <div className="mt-8 space-y-5">

            {loading && (
              <div className="flex justify-center mt-4">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
              </div>
            )}

            {searched && !loading && rides.length === 0 && (
              <p className="text-center text-gray-400 mt-6">
                No rides found for this route
              </p>
            )}

            {rides.map((ride) => (
              <div
                key={ride.id}
                className="bg-white p-5 rounded-xl border hover:shadow-md cursor-pointer"
                onClick={() =>
                  navigate("/ride-details", { state: ride })
                }
              >
                <p className="font-medium">
                  {ride.source} → {ride.destination}
                </p>

                <div className="text-sm mt-2 space-y-1">
                  <p>Fare: ₹{ride.totalFare?.toFixed(2)}</p>
                  <p>Distance: {ride.distance?.toFixed(1)} km</p>
                  <p>Seats: {ride.availableSeats}</p>
                  <p>Status: {ride.status}</p>
                </div>

                <button
                  className="mt-3 px-4 py-1.5 border rounded-md hover:bg-gray-100 text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    joinRide(ride.id);
                  }}
                >
                  Join Ride
                </button>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}

export default SearchRide;