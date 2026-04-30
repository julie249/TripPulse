import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Wallet,
  Download,
  Heart,
  Star,
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Result() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const pdfRef = useRef();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
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
        const res = await fetch("http://localhost:5000/generate-trip", {
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

    try {
      const res = await fetch("http://localhost:5000/save-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        ✈️ Generating your travel plan...
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
          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full"
        >
          <ArrowLeft /> Back
        </button>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={saveTrip}
            className="bg-pink-500 px-4 py-2 rounded-full flex items-center gap-2"
          >
            <Heart size={16} /> Save
          </button>

          <button
            onClick={downloadPDF}
            className="bg-green-500 px-4 py-2 rounded-full flex items-center gap-2"
          >
            <Download size={16} /> PDF
          </button>
        </div>
      </div>

      <div ref={pdfRef} className="bg-white/10 p-5 rounded-2xl backdrop-blur">
        <div className="bg-white/20 p-6 rounded-xl mb-6">
          <h1 className="text-3xl font-bold">
            🌍 {trip?.destination}
          </h1>

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

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">🗺️ Trip Map</h2>

          <iframe
            title="trip-map"
            className="w-full h-72 rounded-xl border-0"
            loading="lazy"
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              trip.destination
            )}&output=embed`}
          />
        </div>

        {trip?.budget_breakdown && (
          <div className="bg-white/10 p-4 rounded-xl mb-6">
            <h2 className="text-xl font-bold mb-2">💰 Budget Breakdown</h2>
            <p>Stay: {trip.budget_breakdown.stay}</p>
            <p>Food: {trip.budget_breakdown.food}</p>
            <p>Travel: {trip.budget_breakdown.travel}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {trip.days.map((item, i) => (
            <div key={i} className="bg-white/10 p-4 rounded-xl backdrop-blur">
              <h2 className="text-xl font-bold mb-2">Day {item.day}</h2>

              <p className="text-sm mb-2">
                📍 {item.places?.map((p) => p.name).join(", ")}
              </p>

              <p className="text-sm">🍜 {item.food?.join(", ")}</p>
              <p className="text-sm mt-2">🏨 {item.hotel}</p>
              <p className="text-sm mt-2">💡 {item.tips}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}