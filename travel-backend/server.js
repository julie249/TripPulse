import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Groq from "groq-sdk";
import { GoogleGenAI } from "@google/genai";

import { connectDB } from "./db.js";
import Trip from "./models/Trip.js";
import User from "./models/User.js";
import { protect } from "./middleware/auth.js";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const app = express();

app.use(cors());
app.use(express.json());

// AI TRIP GENERATOR - GROQ
app.post("/generate-trip", async (req, res) => {
  try {
    const { destination, days, budget, travelers } = req.body;

    if (!destination || !days || !budget) {
      return res.status(400).json({
        error: "Destination, days and budget are required",
      });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        error: "Groq API key is missing",
      });
    }

    const prompt = `
You are an advanced AI travel planner.

Create a realistic, detailed, and unique ${days}-day itinerary for ${destination} within ₹${budget} budget for ${travelers || 1} travelers.

IMPORTANT RULES:
- Every day must contain DIFFERENT places.
- Mention REAL famous tourist places of the destination.
- Suggest REAL local food.
- Suggest REAL hotel types.
- Give realistic travel tips.
- Include latitude and longitude for places.
- Make itinerary practical and non-repetitive.
- Keep food, hotel, and tips different every day.

Return ONLY valid JSON. No markdown. No explanation.

JSON FORMAT:
{
  "destination": "${destination}",
  "days": [
    {
      "day": 1,
      "places": [
        {
          "name": "Real Place Name",
          "lat": 0.0,
          "lng": 0.0
        }
      ],
      "food": ["real food1", "real food2"],
      "hotel": "real hotel suggestion",
      "tips": "real travel tips"
    }
  ],
  "budget_breakdown": {
    "stay": "",
    "food": "",
    "travel": ""
  },
  "packing": ["item1", "item2"],
  "best_time_to_visit": "",
  "safety_tips": ["tip1", "tip2"]
}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
    });

    let raw = completion.choices[0]?.message?.content || "";
    raw = raw.replace(/```json/g, "").replace(/```/g, "").trim();

    const tripPlan = JSON.parse(raw);

    res.json(tripPlan);
  } catch (err) {
    console.log("Groq AI Error:", err.message);

    res.status(500).json({
      error: "AI trip generation failed",
    });
  }
});

// REGISTER
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

// LOGIN
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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

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

// SAVE TRIP
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

// GET SAVED TRIPS
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

// DELETE TRIP
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

// WEATHER
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

// AI CHAT - GEMINI WITH FALLBACK
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      error: "Message is required",
    });
  }

  const lowerMessage = message.toLowerCase();

  const fallbackReply = () => {
    if (lowerMessage.includes("goa")) {
      return "Best time to visit Goa is November to February. The weather is pleasant, beaches are active, and water sports are available. Avoid Christmas/New Year if you want a lower budget.";
    }

    if (lowerMessage.includes("budget") || lowerMessage.includes("cheap")) {
      return "To reduce travel budget: book tickets early, travel off-season, use public transport, choose hostels/budget hotels, and set a daily spending limit.";
    }

    if (lowerMessage.includes("pack") || lowerMessage.includes("packing")) {
      return "Pack ID proof, charger, power bank, medicines, comfortable shoes, weather-based clothes, sunscreen, water bottle, and basic toiletries.";
    }

    if (lowerMessage.includes("food")) {
      return "Try local food of your destination. For Goa, try fish curry, bebinca, poi bread, prawn balchao, and seafood. Check hygiene and reviews before eating.";
    }

    if (lowerMessage.includes("weather")) {
      return "Before travel, check temperature, rainfall, and local alerts. Carry sunscreen for hot places, umbrella for rainy areas, and warm clothes for hill stations.";
    }

    return `For "${message}", plan your trip by checking weather, budget, transport, hotel location, safety, food options, and nearby attractions.`;
  };

  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        reply: fallbackReply(),
      });
    }

    const prompt = `
You are TripPulse AI, a smart travel assistant.
Answer in 3 short bullet points only.

User question: ${message}
`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });

    return res.json({
      reply: response.text,
    });
  } catch (err) {
    console.log("Gemini Chat Error:", err.message);

    return res.json({
      reply: fallbackReply(),
    });
  }
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});