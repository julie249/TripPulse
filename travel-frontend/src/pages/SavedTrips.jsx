import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Trash2, Calendar, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SavedTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 📥 FETCH FROM BACKEND (MongoDB)
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await fetch("http://localhost:5000/get-trips");
        const data = await res.json();
        setTrips(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  // 🗑️ DELETE (frontend only for now)
  const deleteTrip = (id) => {
    const updated = trips.filter((trip) => trip._id !== id);
    setTrips(updated);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        Loading saved trips...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white p-6">

      {/* HEADER */}
      <h1 className="text-3xl md:text-5xl font-bold mb-10 text-center">
        ⭐ Saved Trips
      </h1>

      {/* EMPTY STATE */}
      {trips.length === 0 ? (
        <p className="text-center text-gray-300">
          No saved trips yet 😢
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {trips.map((trip, index) => (
            <motion.div
              key={trip._id || index}
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur p-6 rounded-2xl shadow-lg"
            >

              {/* Destination */}
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <MapPin size={18} />
                {trip.destination}
              </h2>

              {/* Details */}
              <div className="text-sm text-gray-300 space-y-1 mb-4">

                <p className="flex items-center gap-2">
                  <Calendar size={14} />
                  {trip.days} Days
                </p>

                <p className="flex items-center gap-2">
                  <Wallet size={14} />
                  ₹{trip.budget}
                </p>

              </div>

              {/* Actions */}
              <div className="flex justify-between items-center">

                <button
                  onClick={() => deleteTrip(trip._id)}
                  className="flex items-center gap-2 text-red-400 hover:text-red-200"
                >
                  <Trash2 size={16} /> Delete
                </button>

                <button
                  onClick={() =>
                    navigate("/trip-details", { state: trip })
                  }
                  className="bg-blue-500 px-3 py-1 rounded-full text-sm"
                >
                  View
                </button>

              </div>

            </motion.div>
          ))}

        </div>
      )}
    </div>
  );
}