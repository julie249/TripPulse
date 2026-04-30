import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Map, Wallet, Star } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();
  const rainDrops = useMemo(
    () =>
      Array.from({ length: 25 }, () => ({
        duration: 1 + Math.random(),
        delay: Math.random(),
        left: `${Math.random() * 100}%`,
        top: `-${Math.random() * 100}px`,
      })),
    []
  );

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden flex flex-col items-center justify-center text-center px-4 text-white">

      {/* 🌄 Background */}
      <motion.div
        animate={{ scale: [1.05, 1.1, 1.05] }}
        transition={{ duration: 25, repeat: Infinity }}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')",
        }}
      />

      {/* 🌈 Overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-indigo-900/80 via-purple-900/70 to-pink-900/80"></div>

      {/* ☁️ Clouds (shifted upward) */}
      {[5, 10, 15, 20].map((top, i) => (
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

      {/* 🌧️ Rain Effect */}
      {rainDrops.map((drop, i) => (
        <motion.div
          key={i}
          initial={{ y: "-10%" }}
          animate={{ y: "110%" }}
          transition={{
            duration: drop.duration,
            repeat: Infinity,
            delay: drop.delay,
            ease: "linear",
          }}
          className="absolute w-[2px] h-6 bg-white/30"
          style={{
            left: drop.left,
            top: drop.top,
          }}
        />
      ))}

      {/* ✈️ Plane */}
      <motion.div
        animate={{ x: ["-20%", "120%"], y: [0, -30, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute top-20 text-3xl md:text-4xl"
      >
        ✈️
      </motion.div>

      {/* 🚗 Car */}
      <motion.div
        animate={{ x: ["-30%", "120%"] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        className="hidden md:block absolute bottom-6 text-3xl"
      >
        🚗
      </motion.div>

      {/* 🚌 Bus */}
      <motion.div
        animate={{ x: ["120%", "-30%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="hidden md:block absolute bottom-14 text-3xl"
      >
        🚌
      </motion.div>

      {/* 🌳 Trees */}
      {[5, 25, 50, 75].map((left, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4 + i, repeat: Infinity }}
          className="hidden md:block absolute bottom-0 text-4xl opacity-70"
          style={{ left: `${left}%` }}
        >
          🌳
        </motion.div>
      ))}

      {/* 👩‍💼 Cartoon */}
      <motion.div className="hidden lg:block absolute bottom-5 right-5">
        <motion.img
          src="https://cdn-icons-png.flaticon.com/512/2922/2922510.png"
          alt="guide"
          className="w-28 lg:w-36"
          animate={{ y: [0, -10, 0], rotate: [0, 2, -2, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        />
        <motion.div
          animate={{ rotate: [0, 25, -25, 25, 0] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="absolute top-2 right-2 text-xl"
        >
          👋
        </motion.div>
      </motion.div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 max-w-5xl w-full py-10">

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-6"
        >
          <span className="bg-linear-to-r from-yellow-300 via-white to-pink-300 text-transparent bg-clip-text">
            AI Travel Planner
          </span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm sm:text-base md:text-xl mb-8 text-gray-200"
        >
          👋 Welcome traveler!  
          <br />
          Plan smarter, explore faster, and enjoy unforgettable journeys with AI.
        </motion.p>

        {/* CTA */}
        <motion.button
          onClick={() => navigate("/plan")}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-white text-indigo-600 px-6 sm:px-8 py-3 rounded-full font-bold text-sm sm:text-lg shadow-xl"
        >
          Start Your Journey 🚀
        </motion.button>

        {/* Stats */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs sm:text-sm">
          <span className="flex items-center gap-2">
            <Star className="text-yellow-300 w-4 h-4" /> 10K+ Trips
          </span>
          <span className="flex items-center gap-2">
            <Star className="text-yellow-300 w-4 h-4" /> 4.9 Rating
          </span>
          <span className="flex items-center gap-2">
            <Star className="text-yellow-300 w-4 h-4" /> AI Powered
          </span>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[{
            icon: <Sparkles className="text-yellow-300" />,
            title: "AI Smart Planning",
            desc: "Personalized itineraries instantly."
          },
          {
            icon: <Map className="text-green-300" />,
            title: "Explore More",
            desc: "Discover hidden gems worldwide."
          },
          {
            icon: <Wallet className="text-pink-300" />,
            title: "Save Money",
            desc: "Smart budget optimization."
          }].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-xl p-4 rounded-xl shadow-lg border border-white/20"
            >
              <div className="mb-2 flex justify-center">{item.icon}</div>
              <h3 className="font-semibold text-base">{item.title}</h3>
              <p className="text-xs text-gray-200">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* 🆕 EXTRA INFO SECTION */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 max-w-2xl mx-auto text-gray-200 text-sm leading-relaxed"
        >
          🌍 Whether you're planning a solo trip, family vacation, or adventure tour,  
          our AI helps you create the perfect itinerary in seconds.  
          <br /><br />
          💡 Just enter your destination, budget, and duration — and let AI handle everything  
          from places to visit, daily plans, and cost optimization.
        </motion.div>

      </div>
    </div>
  );
}