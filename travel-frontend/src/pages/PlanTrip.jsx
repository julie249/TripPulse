import { motion } from "framer-motion";
import { useState } from "react";
import TripForm from "../components/TripForm";
import { MapPin, CalendarDays, Wallet, Sparkles } from "lucide-react";

export default function PlanTrip() {
  // 🌟 Live Preview State
  const [trip, setTrip] = useState({
    destination: "",
    days: "",
    budget: "",
  });

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden flex flex-col items-center justify-center px-4 text-white">

      {/* 🌄 Background */}
      <motion.div
        animate={{ scale: [1.05, 1.1, 1.05] }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470')",
        }}
      />

      {/* 🌈 Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-purple-900/70 to-blue-900/80"></div>

      {/* ☁️ Clouds */}
      {[10, 20, 30].map((top, i) => (
        <motion.div
          key={i}
          animate={{ x: ["-20%", "120%"] }}
          transition={{
            duration: 25 + i * 5,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute text-3xl md:text-5xl opacity-40"
          style={{ top: `${top}%` }}
        >
          ☁️
        </motion.div>
      ))}

      {/* ✈️ Plane */}
      <motion.div
        animate={{ x: ["-20%", "120%"], y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-24 text-3xl md:text-4xl"
      >
        ✈️
      </motion.div>

      {/* ✨ Sparkles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -20, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3 + i, repeat: Infinity }}
          className="absolute text-yellow-300 text-xl"
          style={{
            top: `${20 + i * 10}%`,
            left: `${10 + i * 15}%`,
          }}
        >
          ✨
        </motion.div>
      ))}

      {/* MAIN */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-5xl py-10">

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-center"
        >
          ✈️ Create Your Dream Trip
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm sm:text-base md:text-lg text-gray-200 mb-8 text-center max-w-xl"
        >
          Enter your details and see your trip preview instantly 👇
        </motion.p>

        {/* 💎 Layout Grid */}
        <div className="grid md:grid-cols-2 gap-6 w-full">

          {/* 📝 FORM */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-2xl p-6 rounded-2xl shadow-2xl border border-white/20"
          >
            {/* Pass setter to TripForm */}
            <TripForm setTrip={setTrip} />
          </motion.div>

          {/* 👀 LIVE PREVIEW */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-2xl p-6 rounded-2xl shadow-2xl border border-white/20"
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="text-yellow-300" />
              Live Preview
            </h3>

            {trip.destination ? (
              <div className="space-y-4 text-sm">

                <div className="flex items-center gap-2">
                  <MapPin className="text-red-400" />
                  {trip.destination}
                </div>

                <div className="flex items-center gap-2">
                  <CalendarDays className="text-blue-400" />
                  {trip.days || "0"} Days
                </div>

                <div className="flex items-center gap-2">
                  <Wallet className="text-green-400" />
                  ₹{trip.budget || "0"}
                </div>

                {/* 💡 Smart Suggestion */}
                <div className="mt-4 text-yellow-200 text-xs">
                  💡 Tip: {trip.days >= 5
                    ? "Perfect for a relaxed trip!"
                    : "Short trip — focus on top places!"}
                </div>

              </div>
            ) : (
              <p className="text-gray-300 text-sm">
                Start typing to preview your trip...
              </p>
            )}
          </motion.div>
        </div>

        {/* 📊 Progress Indicator */}
        <motion.div
          initial={{ width: 0 }}
          animate={{
            width: `${
              (trip.destination ? 33 : 0) +
              (trip.days ? 33 : 0) +
              (trip.budget ? 34 : 0)
            }%`,
          }}
          className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 mt-6 rounded-full"
        />

        {/* Extra Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center text-gray-200 text-sm max-w-2xl"
        >
          🌍 AI will generate your itinerary instantly  
          💡 Smart suggestions + budget optimization included  
        </motion.div>

      </div>
    </div>
  );
}