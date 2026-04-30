import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Plane,
  User,
  Sparkles,
  Compass,
} from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-indigo-100 shadow-sm px-5 md:px-8 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ rotate: 12, scale: 1.1 }}
            className="relative bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 p-2.5 rounded-2xl shadow-lg"
          >
            <Plane className="w-6 h-6 text-white" />
            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300" />
          </motion.div>

          <div>
            <h1 className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              TripPulse 
            </h1>
            <p className="text-xs text-gray-500 -mt-1">
              Smart Travel Planner
            </p>
          </div>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-7 font-medium">
          <NavItem to="/" label="Home" current={location.pathname} />
          <NavItem to="/plan" label="Plan Trip" current={location.pathname} />
          <NavItem to="/saved" label="Saved" current={location.pathname} />
          <NavItem to="/about" label="About" current={location.pathname} />
          <NavItem to="/contact" label="Contact" current={location.pathname} />
          <NavItem to="/chat" label="AI Chat" current={location.pathname} />

          <Link to="/profile">
            <motion.div
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              className="bg-indigo-50 border border-indigo-100 p-2.5 rounded-full shadow-sm"
            >
              <User className="text-indigo-600 w-5 h-5" />
            </motion.div>
          </Link>

          <Link
            to="/plan"
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-full shadow-lg hover:shadow-indigo-300/60 hover:scale-105 transition"
          >
            <Compass size={18} />
            Start
          </Link>
        </div>

        {/* MOBILE BUTTON */}
        <button
          className="md:hidden bg-indigo-50 p-2 rounded-xl text-indigo-700"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="absolute top-full left-4 right-4 mt-3 bg-white/95 backdrop-blur-2xl shadow-2xl rounded-3xl border border-indigo-100 flex flex-col items-center gap-5 py-7 md:hidden"
            >
              <MobileItem to="/" label="Home" setOpen={setOpen} />
              <MobileItem to="/plan" label="Plan Trip" setOpen={setOpen} />
              <MobileItem to="/saved" label="Saved ❤️" setOpen={setOpen} />
              <MobileItem to="/about" label="About" setOpen={setOpen} />
              <MobileItem to="/contact" label="Contact" setOpen={setOpen} />
              <MobileItem to="/chat" label="AI Chat 🧠" setOpen={setOpen} />
              <MobileItem to="/profile" label="Profile 👤" setOpen={setOpen} />

              <Link
                to="/plan"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-7 py-2.5 rounded-full shadow-lg"
              >
                <Compass size={18} />
                Start Planning
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

function NavItem({ to, label, current }) {
  const isActive = current === to;

  return (
    <motion.div whileHover={{ y: -2 }} className="relative group">
      <Link
        to={to}
        className={`transition text-sm lg:text-base ${
          isActive
            ? "text-indigo-600 font-bold"
            : "text-gray-700 hover:text-indigo-600"
        }`}
      >
        {label}
      </Link>

      <span
        className={`absolute left-0 -bottom-2 h-[3px] rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300 ${
          isActive ? "w-full" : "w-0 group-hover:w-full"
        }`}
      />
    </motion.div>
  );
}

function MobileItem({ to, label, setOpen }) {
  return (
    <motion.div whileHover={{ scale: 1.08 }}>
      <Link
        to={to}
        onClick={() => setOpen(false)}
        className="text-gray-700 text-lg font-medium hover:text-indigo-600"
      >
        {label}
      </Link>
    </motion.div>
  );
}