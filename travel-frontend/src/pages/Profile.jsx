import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Edit, Save, Plane, Wallet, MapPin, Star } from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [edit, setEdit] = useState(false);
  const [tempName, setTempName] = useState("");
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedName = localStorage.getItem("username") || "Traveler";
    const token = localStorage.getItem("token");

    if (storedUser) {
      setUser(storedUser);
      setName(storedUser.name || storedName);
      setTempName(storedUser.name || storedName);
    } else {
      setName(storedName);
      setTempName(storedName);
    }

    const fetchTrips = async () => {
      try {
        const res = await fetch("http://localhost:5000/get-trips", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setTrips(data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchTrips();
    } else {
      setLoading(false);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("username", tempName);

    if (user) {
      const updatedUser = { ...user, name: tempName };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    }

    setName(tempName);
    setEdit(false);
  };

  const totalTrips = trips.length;

  const totalBudget = trips.reduce((sum, trip) => {
    return sum + (Number(trip.budget) || 0);
  }, 0);

  const recentTrip = trips[0];

  const destinationCount = trips.reduce((acc, trip) => {
    if (trip.destination) {
      acc[trip.destination] = (acc[trip.destination] || 0) + 1;
    }
    return acc;
  }, {});

  const favoriteDestination =
    Object.keys(destinationCount).length > 0
      ? Object.entries(destinationCount).sort((a, b) => b[1] - a[1])[0][0]
      : "No trips yet";

  const destinationChartData = Object.entries(destinationCount).map(
    ([destination, count]) => ({
      destination,
      trips: count,
    })
  );

  const budgetChartData = trips.slice(0, 5).map((trip) => ({
    destination: trip.destination,
    budget: Number(trip.budget) || 0,
  }));

  const pieData = [
    { name: "Trips", value: totalTrips || 1 },
    { name: "Budget", value: totalBudget || 1 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-900 text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="bg-white/20 p-5 rounded-full">
                <User size={42} />
              </div>

              <div>
                {!edit ? (
                  <h1 className="text-3xl font-bold">👋 Hello, {name}</h1>
                ) : (
                  <input
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="p-3 rounded-xl text-black outline-none"
                  />
                )}

                <p className="text-gray-300 mt-2">
                  {user?.email || "Your travel companion dashboard"}
                </p>
              </div>
            </div>

            {!edit ? (
              <button
                onClick={() => setEdit(true)}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-5 py-3 rounded-xl font-semibold"
              >
                <Edit size={18} /> Edit Name
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-5 py-3 rounded-xl font-semibold"
              >
                <Save size={18} /> Save
              </button>
            )}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
            <Plane className="mb-4 text-blue-300" />
            <p className="text-gray-300">Total Trips</p>
            <h2 className="text-3xl font-bold mt-2">{totalTrips}</h2>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
            <Wallet className="mb-4 text-green-300" />
            <p className="text-gray-300">Total Budget</p>
            <h2 className="text-3xl font-bold mt-2">₹{totalBudget}</h2>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
            <MapPin className="mb-4 text-pink-300" />
            <p className="text-gray-300">Recent Trip</p>
            <h2 className="text-xl font-bold mt-2">
              {recentTrip?.destination || "No trips yet"}
            </h2>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
            <Star className="mb-4 text-yellow-300" />
            <p className="text-gray-300">Favorite Destination</p>
            <h2 className="text-xl font-bold mt-2">
              {favoriteDestination}
            </h2>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-300">Loading dashboard...</p>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold mb-6">
                Trips by Destination
              </h2>

              {destinationChartData.length === 0 ? (
                <p className="text-gray-300">No trip data available.</p>
              ) : (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={destinationChartData}>
                      <XAxis dataKey="destination" stroke="#ddd" />
                      <YAxis stroke="#ddd" />
                      <Tooltip />
                      <Bar dataKey="trips" fill="#60a5fa" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold mb-6">
                Budget by Recent Trips
              </h2>

              {budgetChartData.length === 0 ? (
                <p className="text-gray-300">No budget data available.</p>
              ) : (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={budgetChartData}>
                      <XAxis dataKey="destination" stroke="#ddd" />
                      <YAxis stroke="#ddd" />
                      <Tooltip />
                      <Bar
                        dataKey="budget"
                        fill="#34d399"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-6">Recent Saved Trips</h2>

            {trips.length === 0 ? (
              <p className="text-gray-300">No saved trips found.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {trips.slice(0, 4).map((trip) => (
                  <div
                    key={trip._id}
                    className="bg-white/10 rounded-2xl p-5 border border-white/20"
                  >
                    <h3 className="text-xl font-bold">
                      {trip.destination}
                    </h3>
                    <p className="text-gray-300 mt-2">
                      {trip.days || "N/A"} Days • ₹{trip.budget || "N/A"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-6">Trip Summary</h2>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    outerRadius={85}
                    label
                  >
                    <Cell fill="#60a5fa" />
                    <Cell fill="#f472b6" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}