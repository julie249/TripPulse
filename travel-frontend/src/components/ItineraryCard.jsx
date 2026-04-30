import { motion } from "framer-motion";
import { CalendarDays, MapPin, ArrowRight } from "lucide-react";

export default function ItineraryCard({ day, plan, onView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -12, scale: 1.04 }}
      transition={{ duration: 0.4 }}
      className="group relative bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-lg hover:shadow-2xl overflow-hidden"
    >
      
      {/* 🌈 Animated Gradient Glow */}
      <motion.div
        className="absolute inset-0 bg-linear-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-2xl"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      />

      {/* ✨ Floating Shine Effect */}
      <motion.div
        animate={{ x: ["-100%", "100%"] }}
        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
        className="absolute top-0 left-0 w-1/2 h-full bg-white/10 blur-xl rotate-12"
      />

      <div className="relative z-10">
        
        {/* 📅 Header */}
        <motion.div 
          className="flex items-center gap-3 mb-3"
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-blue-100 p-2 rounded-full group-hover:bg-blue-200 transition">
            <CalendarDays className="text-blue-600 w-5 h-5" />
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-gray-800 group-hover:text-blue-600 transition">
            {day}
          </h3>
        </motion.div>

        {/* 📍 Plan */}
        <motion.div 
          className="flex items-start gap-2 text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <MapPin className="w-4 h-4 mt-1 text-gray-400 group-hover:text-blue-500 transition" />
          <p className="text-sm leading-relaxed">{plan}</p>
        </motion.div>

        {/* 🚀 Button */}
        <motion.button
          onClick={onView}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-purple-600 transition"
        >
          View Details

          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          >
            <ArrowRight className="w-4 h-4" />
          </motion.span>
        </motion.button>

      </div>
    </motion.div>
  );
}