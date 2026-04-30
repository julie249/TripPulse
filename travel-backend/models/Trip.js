import mongoose from "mongoose";

const TripSchema = new mongoose.Schema({
  destination: String,
  days: Number,
  budget: Number,
  trip: Object, // full AI response
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Trip", TripSchema);