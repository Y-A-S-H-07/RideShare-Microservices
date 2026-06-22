import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

function Wallet() {
  const API = process.env.REACT_APP_API_URL;
  const user = JSON.parse(localStorage.getItem("user"));

  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWallet = async () => {
    const res = await fetch(
      `${API}/users/wallet?userId=${user.id}`
    );
    const data = await res.json();
    setBalance(data.balance);
  };

  const fetchTransactions = async () => {
    const res = await fetch(
      `${API}/users/transactions?userId=${user.id}`
    );
    const data = await res.json();
    setTransactions(data);
  };

  useEffect(() => {
    fetchWallet();
    fetchTransactions();
    setLoading(false);
  }, []);

  const addMoney = async (customAmount) => {
    const finalAmount = customAmount || amount;

    if (!finalAmount || finalAmount <= 0) {
      toast.error("Enter valid amount");
      return;
    }

    await fetch(`${API}/wallet/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: user.id,
        amount: Number(finalAmount)
      })
    });

    toast.success("Money added");

    setAmount("");
    fetchWallet();
    fetchTransactions();
  };

  const isCredit = (t) => t.toUser?.id === user.id;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 space-y-6">

          {/* TITLE */}
          <h1 className="text-3xl font-semibold text-gray-900">
            Wallet
          </h1>

          {/* BALANCE CARD */}
          <div className="bg-black text-white p-6 rounded-xl text-center">
            <p className="text-sm text-gray-300">Available Balance</p>
            <h2 className="text-3xl font-semibold mt-2">
              ₹{Number(balance).toFixed(2)}
            </h2>
          </div>

          {/* ADD MONEY */}
          <div className="bg-white p-5 rounded-xl border space-y-4">
            <h3 className="font-medium text-gray-900">Add Money</h3>

            <input
              className="w-full border rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            {/* QUICK BUTTONS */}
            <div className="flex gap-2">
              {[100, 500, 1000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => addMoney(amt)}
                  className="px-3 py-1 border rounded-md text-sm hover:bg-gray-100 active:scale-95"
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            <button
              className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-black transition active:scale-95"
              onClick={() => addMoney()}
            >
              Add Money
            </button>
          </div>

          {/* TRANSACTIONS */}
          <div className="bg-white p-5 rounded-xl border">
            <h3 className="font-medium text-gray-900 mb-4">
              Transaction History
            </h3>

            {transactions.length === 0 && (
              <p className="text-gray-400 text-sm">
                No transactions yet
              </p>
            )}

            <div className="space-y-3">
              {transactions.map((t) => (
                <div
                  key={t.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {isCredit(t) ? "Received" : "Paid"} ({t.type})
                    </p>

                    <p className="text-xs text-gray-500">
                      {new Date(t.createdAt).toLocaleString()}
                    </p>

                    {t.ride && (
                      <p className="text-xs text-gray-400">
                        Ride ID: {t.ride.id}
                      </p>
                    )}
                  </div>

                  <p
                    className={`text-sm font-medium ${
                      isCredit(t)
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {isCredit(t) ? "+" : "-"} ₹
                    {Number(t.amount).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default Wallet;