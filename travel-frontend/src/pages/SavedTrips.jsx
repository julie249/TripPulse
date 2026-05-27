import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Trash2,
  Calendar,
  Wallet,
  ArrowLeft,
  Search,
  Users,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../components/DeleteModal";

export default function SavedTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState(null);

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
        const res = await fetch("https://trippulse-11nu.onrender.com/get-trips", {
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

    try {
      const res = await fetch(`https://trippulse-11nu.onrender.com/delete-trip/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Delete failed");
        return;
      }

      setTrips((prev) => prev.filter((t) => t._id !== id));
      setShowDeleteModal(false);
      setSelectedTripId(null);
    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };

  const openDeleteModal = (id) => {
    setSelectedTripId(id);
    setShowDeleteModal(true);
  };

  const filteredTrips = trips
    .filter((trip) =>
      trip.destination?.toLowerCase().includes(search.toLowerCase())
    )
    .filter((trip) => {
      const budget = Number(trip.budget);

      if (budgetFilter === "low") return budget <= 10000;
      if (budgetFilter === "medium") return budget > 10000 && budget <= 50000;
      if (budgetFilter === "high") return budget > 50000;

      return true;
    })
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }

      if (sortOrder === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }

      if (sortOrder === "budgetLow") {
        return Number(a.budget) - Number(b.budget);
      }

      if (sortOrder === "budgetHigh") {
        return Number(b.budget) - Number(a.budget);
      }

      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200"
          >
            <ArrowLeft size={18} /> Back
          </button>

          <h1 className="text-3xl md:text-5xl font-bold text-center">
            ⭐ Saved Trips
          </h1>

          <div className="w-20"></div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 mb-8 shadow-xl">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
              />
              <input
                type="text"
                placeholder="Search destination..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-11 pr-4 py-3 outline-none placeholder:text-gray-300"
              />
            </div>

            <select
              value={budgetFilter}
              onChange={(e) => setBudgetFilter(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 outline-none"
            >
              <option className="text-black" value="all">
                All Budgets
              </option>
              <option className="text-black" value="low">
                Below ₹10,000
              </option>
              <option className="text-black" value="medium">
                ₹10,000 - ₹50,000
              </option>
              <option className="text-black" value="high">
                Above ₹50,000
              </option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 outline-none"
            >
              <option className="text-black" value="newest">
                Newest First
              </option>
              <option className="text-black" value="oldest">
                Oldest First
              </option>
              <option className="text-black" value="budgetLow">
                Budget: Low to High
              </option>
              <option className="text-black" value="budgetHigh">
                Budget: High to Low
              </option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-300 text-lg">
            Loading saved trips...
          </p>
        ) : filteredTrips.length === 0 ? (
          <div className="text-center bg-white/10 rounded-3xl p-10">
            <p className="text-gray-300 text-lg">
              No matching saved trips found 😢
            </p>
            <button
              onClick={() => navigate("/plan-trip")}
              className="mt-5 bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-full font-semibold"
            >
              Plan New Trip
            </button>
          </div>
        ) : (
          <>
            <p className="text-gray-300 mb-5">
              Showing {filteredTrips.length} of {trips.length} saved trips
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrips.map((trip, index) => (
                <motion.div
                  key={trip._id || index}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-xl"
                >
                  <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
                    <MapPin size={22} />
                    {trip.destination}
                  </h2>

                  <div className="text-sm text-gray-300 space-y-3 mb-6">
                    <p className="flex items-center gap-2">
                      <Calendar size={16} />
                      {trip.days || "N/A"} Days
                    </p>

                    <p className="flex items-center gap-2">
                      <Wallet size={16} />₹{trip.budget || "N/A"}
                    </p>

                    <p className="flex items-center gap-2">
                      <Users size={16} />
                      {trip.travelers || "N/A"} Travelers
                    </p>
                  </div>

                  <div className="flex justify-between items-center gap-3">
                    <button
                      onClick={() => openDeleteModal(trip._id)}
                      className="flex items-center gap-2 text-red-300 hover:text-red-100"
                    >
                      <Trash2 size={17} /> Delete
                    </button>

                    <button
                      onClick={() =>
                        navigate("/trip-details", {
                          state: { trip },
                        })
                      }
                      className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-full text-sm font-semibold"
                    >
                      <Eye size={16} /> View
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedTripId(null);
        }}
        onConfirm={() => deleteTrip(selectedTripId)}
      />
    </div>
  );
}