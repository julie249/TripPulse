import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Trash2, Calendar, Wallet, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SavedTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first to view saved trips");
        navigate("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/get-trips", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.error || "Failed to fetch saved trips");
          return;
        }

        setTrips(data);
      } catch (err) {
        console.log(err);
        alert("Could not connect to backend");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [navigate]);

const deleteTrip = async (id) => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    navigate("/login");
    return;
  }

  const confirmDelete = confirm("Are you sure you want to delete this trip?");
  if (!confirmDelete) return;

  try {
    const res = await fetch(
      `http://localhost:5000/delete-trip/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Delete failed");
      return;
    }

    // remove from UI
    setTrips((prev) => prev.filter((t) => t._id !== id));

    alert("Trip deleted successfully 🗑️");
  } catch (err) {
    console.log(err);
    alert("Server error");
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white p-6">
      <div className="flex justify-between items-center mb-10">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <h1 className="text-3xl md:text-5xl font-bold text-center">
          ⭐ Saved Trips
        </h1>

        <div className="w-20"></div>
      </div>

      {trips.length === 0 ? (
        <p className="text-center text-gray-300">No saved trips yet 😢</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip, index) => (
            <motion.div
              key={trip._id || index}
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur p-6 rounded-2xl shadow-lg"
            >
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <MapPin size={18} />
                {trip.destination}
              </h2>

              <div className="text-sm text-gray-300 space-y-1 mb-4">
                <p className="flex items-center gap-2">
                  <Calendar size={14} />
                  {trip.days} Days
                </p>

                <p className="flex items-center gap-2">
                  <Wallet size={14} />₹{trip.budget}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => deleteTrip(trip._id)}
                  className="flex items-center gap-2 text-red-400 hover:text-red-200"
                >
                  <Trash2 size={16} /> Delete
                </button>

                <button
                  onClick={() => navigate("/trip-details", { state: trip })}
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