const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // links to User
    category: { type: String, required: true }, // e.g., Plumbing, Cleaning
    description: { type: String },
    priceRange: { type: String, enum: ["$", "$$", "$$$"], required: true },
    rating: { type: Number, default: 0 },
    availability: { type: String, default: "Available" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Provider", providerSchema);
