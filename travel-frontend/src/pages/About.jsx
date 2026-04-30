import { motion } from "framer-motion";
import { Sparkles, Wallet, Map, Brain } from "lucide-react";

export default function About() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden flex flex-col items-center px-4 py-10 text-white">

      {/* 🌄 Animated Background */}
      <motion.div
        animate={{ scale: [1.05, 1.1, 1.05] }}
        transition={{ duration: 25, repeat: Infinity }}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470')",
        }}
      />

      {/* 🌈 Overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-indigo-900/80 via-blue-900/70 to-purple-900/80"></div>

      {/* ☁️ Clouds */}
      {[10, 25, 40].map((top, i) => (
        <motion.div
          key={i}
          animate={{ x: ["-20%", "120%"] }}
          transition={{
            duration: 30 + i * 5,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute text-3xl md:text-5xl opacity-40"
          style={{ top: `${top}%` }}
        >
          ☁️
        </motion.div>
      ))}

      {/* ✨ Sparkles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -20, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3 + i, repeat: Infinity }}
          className="absolute text-yellow-300 text-lg"
          style={{
            top: `${20 + i * 10}%`,
            left: `${10 + i * 15}%`,
          }}
        >
          ✨
        </motion.div>
      ))}

      {/* MAIN CONTENT */}
      <div className="relative z-10 max-w-6xl w-full text-center">

        {/* 🔥 Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6"
        >
          <span className="bg-linear-to-r from-yellow-300 via-white to-pink-300 text-transparent bg-clip-text">
            About AI Travel Planner
          </span>
        </motion.h1>

        {/* ✨ Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-3xl mx-auto text-sm sm:text-base md:text-lg text-gray-200 mb-10"
        >
          Our AI Travel Planner helps you create personalized travel itineraries
          in seconds 🚀 Whether you're planning a short trip or a world tour,
          we combine intelligence and simplicity to give you the best experience.
        </motion.p>

        {/* 🚀 Features */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.2 } },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            {
              icon: <Brain className="text-blue-500" />,
              title: "AI Powered",
              desc: "Smart itinerary generation using AI",
            },
            {
              icon: <Wallet className="text-green-500" />,
              title: "Budget Friendly",
              desc: "Optimized plans within your budget",
            },
            {
              icon: <Map className="text-pink-500" />,
              title: "Smart Routing",
              desc: "Efficient travel route planning",
            },
            {
              icon: <Sparkles className="text-yellow-400" />,
              title: "Personalized",
              desc: "Plans tailored to your interests",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.08, rotate: 1 }}
              className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20"
            >
              <div className="mb-3 flex justify-center">{item.icon}</div>
              <h3 className="font-semibold text-lg mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-200">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* 💡 Extra Info Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 max-w-2xl mx-auto text-gray-200 text-sm"
        >
          ✨ Our mission is to make travel planning effortless and enjoyable.
          With cutting-edge AI, we ensure every journey is memorable,
          efficient, and perfectly suited to you.
        </motion.div>

      </div>
    </div>
  );
}