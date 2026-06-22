import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaBell, FaWallet } from "react-icons/fa";

function Navbar() {
  const API = process.env.REACT_APP_API_URL;

  const playSound = () => {
    const audio = new Audio("/notification.mp3");
    audio.play();
  };


  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [balance, setBalance] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [unseenCount, setUnseenCount] = useState(0);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Wallet
  useEffect(() => {
    if (user) fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const res = await fetch(
        `${API}/users/wallet?userId=${user.id}`
      );
      const data = await res.json();
      setBalance(data.balance);
    } catch (err) {
      console.error("Wallet error:", err);
    }
  };

  // Notifications
  useEffect(() => {
    if (!user) return;

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(
        `${API}/users/notifications?userId=${user.id}`
      );

      const data = await res.json();

      const storedCount = Number(localStorage.getItem("lastCount") || 0);

      // 🔔 play sound only for new ones
      if (data.length > storedCount) {
        playSound();
      }

      // ✅ calculate unseen count
      setUnseenCount(data.length - storedCount);

      setNotifications([...data].reverse());
    } catch (err) {
      console.error("Notification error:", err);
    }
  };

  // 👉 mark as read when opening
  const openNotifications = () => {
    setShowSidebar(true);
    localStorage.setItem("lastCount", notifications.length);
    setUnseenCount(0);
  };

  return (
    <>
      {/* NAVBAR */}
      <div className="w-full bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">

          {/* LEFT */}
          <h2
            className="text-lg font-semibold text-gray-900 cursor-pointer"
            onClick={() => navigate("/user-dashboard")}
          >
            RideShare
          </h2>

          {/* RIGHT */}
          {user && (
            <div className="flex items-center gap-6 text-sm text-gray-700">

              {/* USER */}
              <span className="text-gray-500">
                {user.name} ({user.role}) • ₹{Number(balance).toFixed(2)}
              </span>

              {/* WALLET */}
              <button
                className="flex items-center gap-2 hover:text-black transition"
                onClick={() => navigate("/wallet")}
              >
                <FaWallet />
                Wallet
              </button>

              {/* NOTIFICATIONS */}
              <button
                className="relative flex items-center gap-2 hover:text-black transition"
                onClick={openNotifications}
              >
                <FaBell />
                Notifications

                {unseenCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-black text-white text-xs px-2 py-0.5 rounded-full">
                    {unseenCount}
                  </span>
                )}
              </button>

              {/* LOGOUT */}
              <button
                className="hover:text-black transition"
                onClick={logout}
              >
                Logout
              </button>

            </div>
          )}
        </div>
      </div>

      {/* BACKDROP */}
      {showSidebar && (
        <div
          onClick={() => setShowSidebar(false)}
          className="fixed inset-0 bg-black/30"
        />
      )}

      {/* SIDEBAR */}
      {showSidebar && (
        <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg p-5 overflow-y-auto z-50">

          <h3 className="text-lg font-semibold mb-4">Notifications</h3>

          <button
            onClick={() => setShowSidebar(false)}
            className="mb-4 text-sm text-gray-500 hover:text-black"
          >
            Close
          </button>

          {notifications.length === 0 && (
            <p className="text-gray-400">No notifications</p>
          )}

          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="p-3 bg-gray-100 rounded-lg"
              >
                <p className="text-sm">{n.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

        </div>
      )}
    </>
  );
}

export default Navbar;