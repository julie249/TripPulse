import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, CalendarDays, Wallet } from "lucide-react";

export default function TripForm() {
  const [form, setForm] = useState({
    destination: "",
    days: "",
    budget: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/loading", { state: form });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/30 overflow-hidden"
    >
      
      {/* Gradient Glow */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-400/10 to-purple-400/10 opacity-70"></div>

      <div className="relative z-10">
        
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold mb-6 text-center text-gray-800"
        >
          ✨ Plan Your Dream Trip
        </motion.h2>

        {/* Destination */}
        <div className="relative mb-5">
          <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            name="destination"
            placeholder="Destination"
            className="w-full pl-10 pr-3 py-3 rounded-xl border bg-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            onChange={handleChange}
            required
          />
        </div>

        {/* Days */}
        <div className="relative mb-5">
          <CalendarDays className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="number"
            name="days"
            placeholder="Number of Days"
            className="w-full pl-10 pr-3 py-3 rounded-xl border bg-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            onChange={handleChange}
            required
          />
        </div>

        {/* Budget */}
        <div className="relative mb-6">
          <Wallet className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="number"
            name="budget"
            placeholder="Budget (₹)"
            className="w-full pl-10 pr-3 py-3 rounded-xl border bg-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            onChange={handleChange}
            required
          />
        </div>

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          Generate Plan 🚀
        </motion.button>
      </div>
    </motion.form>
  );
}