import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function Loading() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // ⏳ Simulate AI processing
  useEffect(() => {
    if (!state) {
      navigate("/plan");
      return;
    }

    const timer = setTimeout(() => {
      navigate("/result", { state });
    }, 2500); // 2.5 sec delay

    return () => clearTimeout(timer);
  }, [navigate, state]);

  return (
    <div className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">

      {/* 🌄 Background */}
      <div className="absolute inset-0 bg-linear-to-br from-indigo-600 via-purple-600 to-pink-600"></div>

      {/* ✨ Floating Sparkles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -30, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2 + i, repeat: Infinity }}
          className="absolute text-yellow-300 text-2xl"
          style={{
            top: `${20 + i * 10}%`,
            left: `${10 + i * 12}%`,
          }}
        >
          ✨
        </motion.div>
      ))}

      {/* MAIN CONTENT */}
      <div className="z-10 text-center">

        {/* 🤖 Animated Loader */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="text-6xl mb-6"
        >
          🌍
        </motion.div>

        {/* TEXT */}
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Generating Your Trip...
        </h2>

        <p className="text-gray-200 mb-6">
          Our AI is crafting the perfect itinerary for you ✨
        </p>

        {/* LOADING BAR */}
        <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden mx-auto">
          <motion.div
            className="h-full bg-white"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        </div>
      </div>
    </div>
  );
}