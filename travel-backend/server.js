import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { connectDB } from "./db.js";
import Trip from "./models/Trip.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/* 
// 🧠 AI TRIP GENERATOR - GEMINI VERSION
app.post("/generate-trip", async (req, res) => {
  const { destination, days, budget } = req.body;

  try {
    const prompt = `
You are a professional travel planner AI.

Return ONLY valid JSON. No markdown. No explanation.

Create a ${days}-day travel itinerary for ${destination} within ₹${budget} budget.

IMPORTANT:
- Include latitude and longitude for each place
- Output must be valid JSON only

FORMAT:
{
  "destination": "${destination}",
  "days": [
    {
      "day": 1,
      "places": [
        {
          "name": "Place Name",
          "lat": 0.0,
          "lng": 0.0
        }
      ],
      "food": ["food1", "food2"],
      "hotel": "hotel suggestion",
      "tips": "travel tips"
    }
  ],
  "budget_breakdown": {
    "stay": "",
    "food": "",
    "travel": ""
  }
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    let raw = response.text;
    raw = raw.replace(/```json/g, "").replace(/```/g, "").trim();

    const plan = JSON.parse(raw);

    res.json(plan);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Gemini trip generation failed" });
  }
});
*/

// 🧠 AI TRIP GENERATOR - MOCK VERSION
app.post("/generate-trip", async (req, res) => {
  const { destination, days, budget } = req.body;

  const mockPlan = {
    destination,
    days: Array.from({ length: Number(days) }, (_, i) => ({
      day: i + 1,
      places: [
        {
          name: `${destination} Place ${i + 1}`,
          lat: 28.61 + i * 0.01,
          lng: 77.2 + i * 0.01,
        },
      ],
      food: ["Local Food", "Street Food"],
      hotel: "3★ Hotel nearby",
      tips: "Start early and stay hydrated.",
    })),
    budget_breakdown: {
      stay: "40%",
      food: "30%",
      travel: "30%",
    },
  };

  res.json(mockPlan);
});

// 💾 SAVE TRIP
app.post("/save-trip", async (req, res) => {
  try {
    const trip = new Trip(req.body);
    await trip.save();

    res.json({
      success: true,
      message: "Trip saved successfully",
      trip,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📥 GET SAVED TRIPS
app.get("/get-trips", async (req, res) => {
  try {
    const trips = await Trip.find().sort({ createdAt: -1 });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🌦️ WEATHER
app.get("/weather", async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: "City is required" });
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );

    const data = await response.json();

    if (!data || data.cod !== 200) {
      return res.status(404).json({ error: "City not found" });
    }

    res.json({
      city: data.name,
      temperature: data.main.temp,
      feels_like: data.main.feels_like,
      condition: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      wind_speed: data.wind.speed,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Weather API failed" });
  }
});

// 🧠 CHAT - MOCK VERSION
app.post("/chat", async (req, res) => {
  res.json({
    reply: "Demo mode: AI chat is temporarily unavailable because API quota is exhausted.",
  });
});

/*
// 🧠 CHAT - GEMINI VERSION
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `
You are a travel assistant AI.
Give short, helpful travel advice.

User question: ${message}
`,
    });

    res.json({
      reply: response.text,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Gemini chat failed" });
  }
});
*/

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});