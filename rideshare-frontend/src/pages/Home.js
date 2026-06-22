import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* navbar */}
      <div className="w-full bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">

          <h2
            className="text-lg font-semibold cursor-pointer"
            onClick={() => navigate("/")}
          >
            RideShare
          </h2>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-1.5 text-sm border rounded-md hover:bg-gray-100"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/register")}
              className="px-4 py-1.5 text-sm bg-gray-900 text-white rounded-md hover:bg-black"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>

      {/* hero */}
      <div className="flex flex-col items-center justify-center text-center px-4 mt-32">

        <h1 className="text-4xl font-semibold text-gray-900">
          RideShare
        </h1>

        <p className="text-gray-600 mt-3">
          Smart ride sharing platform for users and drivers
        </p>

        <p className="text-gray-500 mt-2">
          Share rides. Save money. Travel smarter.
        </p>

        <button
          onClick={() => navigate("/register")}
          className="mt-6 px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-black transition active:scale-95"
        >
          Get Started
        </button>

      </div>

    </div>
  );
}

export default Home;