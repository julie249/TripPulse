import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MapView from "../components/MapView";
import {
  ArrowLeft,
  CalendarDays,
  Wallet,
  Download,
  Heart,
  Star,
  Wind,
  Droplets,
  Backpack,
  ShieldCheck,
  Clock,
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Result() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const pdfRef = useRef();

  const [trip, setTrip] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [error, setError] = useState("");

  const days = state?.days || 3;
  const budget = state?.budget || 10000;
  const destination = state?.destination || "";

  useEffect(() => {
    if (!state || !destination) {
      setError("Trip details missing. Please fill the trip form again.");
      setLoading(false);
      return;
    }

    const generateTrip = async () => {
      try {
        const res = await fetch("https://trippulse-11nu.onrender.com/generate-trip", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ destination, days, budget }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to generate trip.");
          return;
        }

        if (!data?.days) {
          setError("Invalid trip data received from backend.");
          return;
        }

        setTrip(data);
      } catch (err) {
        console.log(err);
        setError("Backend is not responding. Please check server.");
      } finally {
        setLoading(false);
      }
    };

    generateTrip();
  }, [state, destination, days, budget]);

  useEffect(() => {
    if (!destination) return;

    const fetchWeather = async () => {
      try {
        setWeatherLoading(true);

        const res = await fetch(
          `https://trippulse-11nu.onrender.com/weather?city=${encodeURIComponent(destination)}`
        );

        const data = await res.json();

        if (res.ok) {
          setWeather(data);
        } else {
          setWeather(null);
        }
      } catch (err) {
        console.log(err);
        setWeather(null);
      } finally {
        setWeatherLoading(false);
      }
    };

    fetchWeather();
  }, [destination]);

  const mapPlaces =
    trip?.days?.flatMap((day) =>
      day.places?.map((p) => ({
        name: p.name,
        lat: Number(p.lat),
        lng: Number(p.lng),
      }))
    ) || [];

  const downloadPDF = async () => {
    if (!pdfRef.current) return;

    const canvas = await html2canvas(pdfRef.current);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save("trip-plan.pdf");
  };

  const saveTrip = async () => {
    if (!trip) return alert("No trip to save");

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first to save your trip");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("https://trippulse-11nu.onrender.com/save-trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          destination: trip.destination,
          days,
          budget,
          trip,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to save trip");
        return;
      }

      alert("Trip saved successfully ❤️");
    } catch (err) {
      console.log(err);
      alert("Could not connect to backend");
    }
  };

  if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-900 text-white px-6">
      <div className="max-w-xl w-full text-center">

        <div className="text-7xl mb-8 animate-bounce">
          ✈️
        </div>

        <h1 className="text-4xl font-extrabold mb-4">
          TripPulse AI
        </h1>

        <p className="text-gray-300 mb-8">
          Creating your personalized AI travel experience...
        </p>

        <div className="space-y-4 text-left">

          <div className="bg-white/10 backdrop-blur p-4 rounded-2xl animate-pulse">
            🌍 Analyzing destination and travel preferences...
          </div>

          <div className="bg-white/10 backdrop-blur p-4 rounded-2xl animate-pulse delay-100">
            📍 Planning day-wise itinerary...
          </div>

          <div className="bg-white/10 backdrop-blur p-4 rounded-2xl animate-pulse delay-200">
            🍜 Finding food and hotel recommendations...
          </div>

          <div className="bg-white/10 backdrop-blur p-4 rounded-2xl animate-pulse delay-300">
            💰 Estimating smart budget breakdown...
          </div>

          <div className="bg-white/10 backdrop-blur p-4 rounded-2xl animate-pulse delay-500">
            🤖 Preparing your AI travel plan...
          </div>

        </div>

      </div>
    </div>
  );
}

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 text-white px-4 text-center">
        <h1 className="text-3xl font-bold mb-3">⚠️ Something went wrong</h1>
        <p className="text-gray-200 max-w-xl">{error}</p>

        <button
          onClick={() => navigate("/plan")}
          className="mt-6 bg-white text-black px-5 py-2 rounded-full"
        >
          Go Back to Plan Trip
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 text-white p-4">
      <div className="flex justify-between mb-6 flex-wrap gap-3">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full hover:scale-105 transition"
        >
          <ArrowLeft /> Back
        </button>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={saveTrip}
            className="bg-pink-500 px-4 py-2 rounded-full flex items-center gap-2 hover:scale-105 transition"
          >
            <Heart size={16} /> Save
          </button>

          <button
            onClick={downloadPDF}
            className="bg-green-500 px-4 py-2 rounded-full flex items-center gap-2 hover:scale-105 transition"
          >
            <Download size={16} /> PDF
          </button>
        </div>
      </div>

      <div ref={pdfRef} className="bg-white/10 p-5 rounded-2xl backdrop-blur">
        <div className="bg-white/20 p-6 rounded-xl mb-6">
          <h1 className="text-3xl font-bold">🌍 {trip?.destination}</h1>

          <div className="flex flex-wrap gap-4 mt-3 text-sm">
            <span className="flex items-center gap-2">
              <CalendarDays /> {days} Days
            </span>

            <span className="flex items-center gap-2">
              <Wallet /> ₹{budget}
            </span>

            <span className="flex items-center gap-2">
              <Star /> Generated Trip
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-xl font-bold mb-3">🗺️ Itinerary Map</h2>
            <MapView places={mapPlaces} />
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">🌦️ Live Weather</h2>

            <div className="bg-white/10 rounded-xl p-5 min-h-72 flex items-center justify-center">
              {weatherLoading ? (
                <p className="text-gray-200">Loading weather...</p>
              ) : weather ? (
                <div className="w-full">
                  <div className="flex items-center gap-4 mb-5">
                    {weather.icon && (
                      <img
                        src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                        alt="weather"
                        className="w-20 h-20"
                      />
                    )}

                    <div>
                      <h3 className="text-4xl font-bold">
                        {Math.round(weather.temperature)}°C
                      </h3>
                      <p className="capitalize text-gray-200">
                        {weather.condition}
                      </p>
                      <p className="text-sm text-gray-300">
                        Feels like {Math.round(weather.feels_like)}°C
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/10 rounded-lg p-3 flex items-center gap-2">
                      <Droplets size={18} />
                      <span>Humidity: {weather.humidity}%</span>
                    </div>

                    <div className="bg-white/10 rounded-lg p-3 flex items-center gap-2">
                      <Wind size={18} />
                      <span>Wind: {weather.wind_speed} m/s</span>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-green-200">
                    💡 Travel tip: Start sightseeing early for a smoother trip.
                  </p>
                </div>
              ) : (
                <p className="text-gray-300">
                  Weather data not available for this destination.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 🎒 AI PACKING CHECKLIST */}
{trip?.packing && trip.packing.length > 0 && (
  <div className="bg-white/10 p-5 rounded-2xl backdrop-blur mb-6">
    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
      <Backpack /> AI Packing Checklist
    </h2>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {trip.packing.map((item, index) => (
        <div
          key={index}
          className="bg-white/10 p-4 rounded-xl border border-white/10 hover:bg-white/20 transition"
        >
          <p className="flex items-center gap-2 text-sm">
            🎒 {item}
          </p>
        </div>
      ))}
    </div>
  </div>
)}
{/* 🛡️ AI SAFETY TIPS */}
{trip?.safety_tips && trip.safety_tips.length > 0 && (
  <div className="bg-white/10 p-5 rounded-2xl backdrop-blur mb-6">
    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
      <ShieldCheck /> AI Safety Tips
    </h2>

    <div className="grid md:grid-cols-2 gap-4">
      {trip.safety_tips.map((tip, index) => (
        <div
          key={index}
          className="bg-white/10 p-4 rounded-xl border border-white/10 hover:bg-white/20 transition"
        >
          🛡️ {tip}
        </div>
      ))}
    </div>
  </div>
)}

{/* ⏰ BEST TIME TO VISIT */}
{trip?.best_time_to_visit && (
  <div className="bg-gradient-to-r from-pink-500/20 to-orange-500/20 p-5 rounded-2xl backdrop-blur mb-6 border border-white/10">
    <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
      <Clock /> Best Time to Visit
    </h2>

    <p className="text-gray-200 leading-relaxed">
      {trip.best_time_to_visit}
    </p>
  </div>
)}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {trip.days.map((item, i) => (
            <div
              key={i}
              className="bg-white/10 p-4 rounded-xl backdrop-blur hover:bg-white/20 transition"
            >
              <h2 className="text-xl font-bold mb-2">Day {item.day}</h2>

              <p className="text-sm mb-2">
                📍 {item.places?.map((p) => p.name).join(", ")}
              </p>

              <div className="mt-4 space-y-3">
  <div className="bg-white/10 p-3 rounded-xl">
    <h3 className="font-semibold mb-2">🍜 AI Food Suggestions</h3>
    <div className="flex flex-wrap gap-2">
      {item.food?.map((food, index) => (
        <span
          key={index}
          className="bg-orange-400/20 px-3 py-1 rounded-full text-xs"
        >
          {food}
        </span>
      ))}
    </div>
  </div>

  <div className="bg-white/10 p-3 rounded-xl">
    <h3 className="font-semibold mb-1">🏨 AI Hotel Suggestion</h3>
    <p className="text-sm text-gray-200">{item.hotel}</p>
  </div>

  <div className="bg-white/10 p-3 rounded-xl">
    <h3 className="font-semibold mb-1">💡 Smart Travel Tip</h3>
    <p className="text-sm text-gray-200">{item.tips}</p>
  </div>
</div>

              {item.places?.[0] && (
                <a
                  href={`https://www.google.com/maps?q=${item.places[0].lat},${item.places[0].lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-blue-200 hover:text-white text-sm underline"
                >
                  Open Day {item.day} on Maps →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}