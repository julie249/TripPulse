import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Hotel,
  ExternalLink,
  CalendarDays,
  Wallet,
} from "lucide-react";

export default function TripDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const trip = state?.trip || state;

  // 🌦️ WEATHER STATE
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        No Trip Data Found
      </div>
    );
  }

  // 🌦️ FETCH WEATHER
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/weather?city=${trip.destination}`
        );

        const data = await res.json();
        setWeather(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingWeather(false);
      }
    };

    fetchWeather();
  }, [trip.destination]);

  const images = [
    "https://source.unsplash.com/800x400/?travel",
    "https://source.unsplash.com/800x400/?city",
    "https://source.unsplash.com/800x400/?tourism",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 text-white p-6">

      {/* 🔙 BACK */}
      <motion.button
        onClick={() => navigate("/saved")}
        whileHover={{ scale: 1.1 }}
        className="flex items-center gap-2 mb-6 bg-white text-gray-800 px-4 py-2 rounded-full shadow"
      >
        <ArrowLeft /> Back
      </motion.button>

      {/* 🌍 HEADER */}
      <motion.div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-bold mb-2">
          🌍 {trip.destination}
        </h1>

        <div className="flex gap-4 text-sm text-gray-300">
          <span className="flex items-center gap-2">
            <CalendarDays /> {trip.days} Days
          </span>

          <span className="flex items-center gap-2">
            <Wallet /> ₹{trip.budget}
          </span>
        </div>
      </motion.div>

      {/* 🌦️ WEATHER CARD (NEW FEATURE) */}
      <div className="bg-white/10 p-5 rounded-xl mb-10 backdrop-blur">
        <h2 className="text-xl font-bold mb-3">🌦️ Live Weather</h2>

        {loadingWeather ? (
          <p className="text-gray-300">Loading weather...</p>
        ) : weather ? (
          <div className="flex items-center gap-4">

            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt="weather"
            />

            <div>
              <p className="text-2xl font-bold">
                {weather.temperature}°C
              </p>

              <p className="text-gray-300 capitalize">
                {weather.condition}
              </p>

              <p className="text-sm text-gray-400">
                Feels like {weather.feels_like}°C
              </p>

              <p className="text-xs text-gray-500">
                Humidity: {weather.humidity}% | Wind: {weather.wind_speed} m/s
              </p>
            </div>

          </div>
        ) : (
          <p className="text-red-400">Weather not available</p>
        )}
      </div>

      {/* 🖼️ IMAGES */}
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {images.map((img, i) => (
          <motion.img
            key={i}
            src={img}
            whileHover={{ scale: 1.05 }}
            className="rounded-xl h-48 w-full object-cover shadow-lg"
          />
        ))}
      </div>

      {/* 🧭 DAY WISE PLAN */}
      <motion.div className="mb-10">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          📍 Day-wise Itinerary
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {trip.trip?.days?.map((day, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className="bg-white/10 p-5 rounded-xl backdrop-blur"
            >
              <h3 className="font-bold mb-2">Day {day.day}</h3>

              <p className="text-sm text-gray-200 mb-2">
                📍 Places: {day.places?.map(p => p.name).join(", ")}
              </p>

              <p className="text-sm text-gray-200 mb-2">
                🍜 Food: {day.food?.join(", ")}
              </p>

              <p className="text-sm text-gray-200 mb-2">
                🏨 Hotel: {day.hotel}
              </p>

              <p className="text-sm text-gray-200">
                💡 {day.tips}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 🗺️ MAP */}
      <motion.div className="mb-10">
        <h2 className="text-xl font-semibold mb-3">📍 Location Map</h2>

        <iframe
          title="map"
          className="w-full h-64 rounded-xl"
          src={`https://www.google.com/maps?q=${trip.destination}&output=embed`}
        />
      </motion.div>

      {/* 🏨 HOTELS */}
      <motion.div className="bg-white/10 p-6 rounded-2xl backdrop-blur">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Hotel /> Suggested Hotels
        </h2>

        <div className="grid md:grid-cols-3 gap-4">

          {[
            { name: "Luxury Stay Hotel", link: "https://www.booking.com" },
            { name: "Budget Inn", link: "https://www.agoda.com" },
            { name: "Comfort Suites", link: "https://www.airbnb.com" },
          ].map((hotel, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white/20 p-4 rounded-xl"
            >
              <h3 className="font-semibold mb-2">{hotel.name}</h3>

              <a
                href={hotel.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-300 hover:text-blue-100"
              >
                Book Now <ExternalLink size={16} />
              </a>
            </motion.div>
          ))}

        </div>
      </motion.div>

    </div>
  );
}