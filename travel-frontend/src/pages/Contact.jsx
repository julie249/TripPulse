import { motion } from "framer-motion";
import { Mail, User, MessageSquare, Send, Phone, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden flex items-center justify-center px-4 text-white">

      {/* 🌄 Background */}
      <motion.div
        animate={{ scale: [1.05, 1.1, 1.05] }}
        transition={{ duration: 25, repeat: Infinity }}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1493558103817-58b2924bce98')",
        }}
      />

      {/* 🌈 Overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-indigo-900/80 via-blue-900/70 to-purple-900/80"></div>

      {/* ☁️ Floating Clouds */}
      {[10, 25, 40].map((top, i) => (
        <motion.div
          key={i}
          animate={{ x: ["-20%", "120%"] }}
          transition={{
            duration: 25 + i * 5,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute text-3xl opacity-40"
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
      <div className="relative z-10 w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">

        {/* LEFT INFO SECTION */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
            📩 Get in Touch
          </h1>

          <p className="text-gray-200 mb-6">
            Have questions, suggestions, or need help planning your trip?  
            We're here to assist you anytime ✨
          </p>

          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <Mail className="text-yellow-300" />
              support@aitravel.com
            </div>

            <div className="flex items-center gap-3">
              <Phone className="text-green-300" />
              +91 98765 43210
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="text-red-300" />
              India 🌍
            </div>
          </div>
        </motion.div>

        {/* FORM */}
        <motion.form
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/10 backdrop-blur-2xl p-6 rounded-3xl shadow-2xl border border-white/20"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            Send Message 🚀
          </h2>

          {/* Name */}
          <div className="relative mb-4">
            <User className="absolute left-3 top-3 text-gray-300 w-5 h-5" />
            <input
              type="text"
              placeholder="Your Name"
              className="w-full pl-10 p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          {/* Email */}
          <div className="relative mb-4">
            <Mail className="absolute left-3 top-3 text-gray-300 w-5 h-5" />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full pl-10 p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          {/* Message */}
          <div className="relative mb-6">
            <MessageSquare className="absolute left-3 top-3 text-gray-300 w-5 h-5" />
            <textarea
              rows="4"
              placeholder="Your Message"
              className="w-full pl-10 p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: [
                "0 0 10px #fff",
                "0 0 30px #fff",
                "0 0 10px #fff",
              ],
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-full bg-white text-indigo-600 py-3 rounded-full font-bold flex items-center justify-center gap-2"
          >
            Send Message
            <Send className="w-4 h-4" />
          </motion.button>
        </motion.form>
      </div>

      {/* FOOTER TEXT */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="absolute bottom-4 text-center text-gray-300 text-xs"
      >
        ✨ We usually respond within 24 hours
      </motion.div>

    </div>
  );
}