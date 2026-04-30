import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Edit, Save } from "lucide-react";

export default function Profile() {
  const [name, setName] = useState("");
  const [edit, setEdit] = useState(false);
  const [tempName, setTempName] = useState("");

  const [tripsCount, setTripsCount] = useState(0);

  // Load data
  useEffect(() => {
    const storedName = localStorage.getItem("username") || "Traveler";
    setName(storedName);
    setTempName(storedName);

    const trips = JSON.parse(localStorage.getItem("trips")) || [];
    setTripsCount(trips.length);
  }, []);

  // Save name
  const handleSave = () => {
    localStorage.setItem("username", tempName);
    setName(tempName);
    setEdit(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white flex flex-col items-center justify-center px-4">

      {/* PROFILE CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md text-center"
      >

        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <div className="bg-white/20 p-4 rounded-full">
            <User size={40} />
          </div>
        </div>

        {/* Name */}
        {!edit ? (
          <h2 className="text-2xl font-bold mb-2">
            👋 Hello, {name}
          </h2>
        ) : (
          <input
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            className="w-full p-2 rounded text-black mb-2"
          />
        )}

        {/* Edit / Save Button */}
        {!edit ? (
          <button
            onClick={() => setEdit(true)}
            className="flex items-center gap-2 mx-auto mt-2 text-blue-300"
          >
            <Edit size={16} /> Edit Name
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="flex items-center gap-2 mx-auto mt-2 text-green-300"
          >
            <Save size={16} /> Save
          </button>
        )}

        {/* Stats */}
        <div className="mt-6 bg-white/20 p-4 rounded-xl">
          <p className="text-lg font-semibold">
            ✈️ Trips Planned: {tripsCount}
          </p>
        </div>

        {/* Extra Info */}
        <p className="text-sm text-gray-300 mt-4">
          Your travel companion dashboard ✨
        </p>

      </motion.div>

    </div>
  );
}