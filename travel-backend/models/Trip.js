import mongoose from "mongoose";

const TripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    destination: String,
    days: Number,
    budget: Number,
    trip: Object,
  },
  { timestamps: true }
);

export default mongoose.model("Trip", TripSchema);