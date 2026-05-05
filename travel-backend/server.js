import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { connectDB } from "./db.js";
import Trip from "./models/Trip.js";
import User from "./models/User.js";
import { protect } from "./middleware/auth.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

/*
// GEMINI SETUP - enable later when quota is available

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
*/

// 🧠 TRIP GENERATOR - MOCK VERSION
app.post("/generate-trip", async (req, res) => {
  const { destination, days, budget } = req.body;

  if (!destination || !days || !budget) {
    return res.status(400).json({
      error: "Destination, days and budget are required",
    });
  }

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

/*
// 🧠 TRIP GENERATOR - GEMINI VERSION
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

// 🔐 REGISTER
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        error: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// 🔐 LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        error: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        error: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// 💾 SAVE TRIP - USER SPECIFIC
app.post("/save-trip", protect, async (req, res) => {
  try {
    const { destination, days, budget, trip } = req.body;

    if (!destination || !days || !budget || !trip) {
      return res.status(400).json({
        error: "Trip data is incomplete",
      });
    }

    const savedTrip = new Trip({
      destination,
      days,
      budget,
      trip,
      user: req.user.id,
    });

    await savedTrip.save();

    res.json({
      success: true,
      message: "Trip saved successfully",
      trip: savedTrip,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// 📥 GET SAVED TRIPS - LOGGED-IN USER ONLY
app.get("/get-trips", protect, async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(trips);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// 🗑️ DELETE TRIP - ONLY OWNER CAN DELETE
app.delete("/delete-trip/:id", protect, async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!trip) {
      return res.status(404).json({
        error: "Trip not found",
      });
    }

    await trip.deleteOne();

    res.json({
      message: "Trip deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// 🌦️ WEATHER
app.get("/weather", async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({
      error: "City is required",
    });
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );

    const data = await response.json();

    if (!data || data.cod !== 200) {
      return res.status(404).json({
        error: "City not found",
      });
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
    res.status(500).json({
      error: "Weather API failed",
    });
  }
});

// 🧠 CHAT - MOCK VERSION
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  res.json({
    reply: `Demo travel assistant: For "${message}", I suggest checking weather, budget, local food, and nearby attractions before finalizing your plan.`,
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