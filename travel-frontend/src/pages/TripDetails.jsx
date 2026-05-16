import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Hotel,
  ExternalLink,
  CalendarDays,
  Wallet,
  Plane,
  Utensils,
  Lightbulb,
  CloudSun,
  Route,
  ShieldCheck,
  Download,
} from "lucide-react";

export default function TripDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const trip = state?.trip || state;

  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);

  useEffect(() => {
    if (!trip?.destination) return;

    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/weather?city=${trip.destination}`
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
        setLoadingWeather(false);
      }
    };

    fetchWeather();
  }, [trip?.destination]);

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-950 text-white">
        No Trip Data Found
      </div>
    );
  }

  const itineraryDays = trip.trip?.days || [];
  const budgetBreakdown = trip.trip?.budget_breakdown || {};

  const allFoods = itineraryDays.flatMap((day) => day.food || []);
  const allTips = itineraryDays.map((day) => day.tips).filter(Boolean);
  const allPlaces = itineraryDays.flatMap((day) => day.places || []);

  const images = [
    `https://source.unsplash.com/900x500/?${trip.destination},travel`,
    `https://source.unsplash.com/900x500/?${trip.destination},tourism`,
    `https://source.unsplash.com/900x500/?${trip.destination},hotel`,
  ];

  const handleDownload = async () => {
  const element = document.getElementById("trip-details-pdf");

  if (!element) {
    alert("PDF content not found");
    return;
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  }

  pdf.save(`TripPulse-${trip.destination}.pdf`);
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-900 text-white p-6">
     <div id="trip-details-pdf" className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <motion.button
            onClick={() => navigate("/saved")}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 bg-white text-gray-900 px-5 py-2 rounded-full shadow"
          >
            <ArrowLeft size={18} /> Back
          </motion.button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-full shadow"
          >
            <Download size={18} /> Download
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl mb-10 shadow-2xl"
        >
          <img
            src={images[0]}
            alt={trip.destination}
            className="w-full h-[360px] object-cover"
          />

          <div className="absolute inset-0 bg-black/55 flex flex-col justify-end p-8">
            <p className="text-blue-200 font-semibold mb-2 flex items-center gap-2">
              <Plane size={20} /> TripPulse Travel Plan
            </p>

            <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
              {trip.destination}
            </h1>

            <p className="max-w-2xl text-gray-200">
              A personalized travel itinerary with day-wise places, food,
              hotel suggestions, weather, budget insights and travel tips.
            </p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
            <CalendarDays className="text-blue-300 mb-3" />
            <p className="text-gray-300">Duration</p>
            <h2 className="text-2xl font-bold">{trip.days || "N/A"} Days</h2>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
            <Wallet className="text-green-300 mb-3" />
            <p className="text-gray-300">Budget</p>
            <h2 className="text-2xl font-bold">₹{trip.budget || "N/A"}</h2>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
            <MapPin className="text-pink-300 mb-3" />
            <p className="text-gray-300">Places Covered</p>
            <h2 className="text-2xl font-bold">{allPlaces.length}</h2>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
            <Utensils className="text-yellow-300 mb-3" />
            <p className="text-gray-300">Food Ideas</p>
            <h2 className="text-2xl font-bold">{allFoods.length}</h2>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">
              <CloudSun /> Live Weather
            </h2>

            {loadingWeather ? (
              <p className="text-gray-300">Loading weather...</p>
            ) : weather ? (
              <div className="flex items-center gap-5">
                <img
                  src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                  alt="weather"
                  className="bg-white/20 rounded-full"
                />

                <div>
                  <p className="text-4xl font-bold">
                    {weather.temperature}°C
                  </p>

                  <p className="text-gray-300 capitalize">
                    {weather.condition}
                  </p>

                  <p className="text-sm text-gray-400 mt-1">
                    Feels like {weather.feels_like}°C | Humidity:{" "}
                    {weather.humidity}% | Wind: {weather.wind_speed} m/s
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-red-300">Weather not available</p>
            )}
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <ShieldCheck /> Smart Safety Tips
            </h2>

            <ul className="space-y-3 text-gray-300 text-sm">
              <li>Keep digital and physical ID proof with you.</li>
              <li>Share live location with family during travel.</li>
              <li>Check weather and local alerts before visiting places.</li>
              <li>Keep emergency cash and a power bank.</li>
            </ul>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {images.map((img, i) => (
            <motion.img
              key={i}
              src={img}
              whileHover={{ scale: 1.04 }}
              className="rounded-2xl h-52 w-full object-cover shadow-xl"
              alt="travel"
            />
          ))}
        </div>

        <motion.div className="mb-10">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Route /> Day-wise Itinerary
          </h2>

          {itineraryDays.length === 0 ? (
            <p className="text-gray-300">No itinerary available.</p>
          ) : (
            <div className="space-y-6">
              {itineraryDays.map((day, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl"
                >
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-2xl font-bold">Day {day.day}</h3>
                    <span className="bg-blue-500/30 px-4 py-1 rounded-full text-sm">
                      {day.places?.length || 0} Stops
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <MapPin size={18} /> Places to Visit
                      </h4>

                      <div className="space-y-2">
                        {day.places?.map((place, index) => (
                          <p
                            key={index}
                            className="bg-white/10 rounded-xl px-4 py-2 text-gray-200"
                          >
                            {index + 1}. {place.name}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Utensils size={18} /> Food
                        </h4>
                        <p className="text-gray-300">
                          {day.food?.join(", ") || "Local food options"}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Hotel size={18} /> Hotel
                        </h4>
                        <p className="text-gray-300">
                          {day.hotel || "Nearby budget stay"}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Lightbulb size={18} /> Tip
                        </h4>
                        <p className="text-gray-300">
                          {day.tips || "Start early and keep essentials."}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          <motion.div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">
              <Wallet /> Budget Breakdown
            </h2>

            {Object.keys(budgetBreakdown).length === 0 ? (
              <p className="text-gray-300">Budget breakdown not available.</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(budgetBreakdown).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between mb-1">
                      <span className="capitalize text-gray-300">{key}</span>
                      <span className="font-semibold">{value}</span>
                    </div>

                    <div className="w-full bg-white/10 rounded-full h-3">
                      <div
                        className="bg-blue-400 h-3 rounded-full"
                        style={{
                          width: String(value).includes("%") ? value : "50%",
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">
              <Utensils /> Local Food Suggestions
            </h2>

            {allFoods.length === 0 ? (
              <p className="text-gray-300">Food suggestions not available.</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {[...new Set(allFoods)].map((food, index) => (
                  <span
                    key={index}
                    className="bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm"
                  >
                    {food}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        <motion.div className="mb-10 bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">
            <Lightbulb /> Travel Tips
          </h2>

          {allTips.length === 0 ? (
            <p className="text-gray-300">No tips available.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {allTips.map((tip, index) => (
                <div
                  key={index}
                  className="bg-white/10 rounded-2xl p-4 text-gray-300"
                >
                  💡 {tip}
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div className="mb-10">
          <h2 className="text-3xl font-bold mb-5 flex items-center gap-2">
            <MapPin /> Location Map
          </h2>

          <iframe
            title="map"
            className="w-full h-80 rounded-3xl shadow-xl"
            src={`https://www.google.com/maps?q=${trip.destination}&output=embed`}
          />
        </motion.div>

        <motion.div className="bg-white/10 p-6 rounded-3xl backdrop-blur-xl shadow-xl mb-10">
          <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">
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
                whileHover={{ scale: 1.04 }}
                className="bg-white/10 border border-white/20 p-5 rounded-2xl"
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
    </div>
  );
}