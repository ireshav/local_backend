require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const providerRoutes = require("./routes/providerRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/providers", providerRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.send("Local Service Provider Backend Running...");
});

// Connect to MongoDB

// Exported start function to allow external server wrapper
const startServer = (port) => {
  const PORT = port || process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};

module.exports = { app, startServer };

// If this file is run directly, connect to DB and start
if (require.main === module) {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("✅ MongoDB Connected");
      startServer();
    })
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err.message);
      process.exit(1);
    });
}
