const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");

// Create booking
router.post("/", authMiddleware, bookingController.createBooking);

// Get my bookings
router.get("/my", authMiddleware, bookingController.getMyBookings);

// Get bookings for provider
router.get("/provider", authMiddleware, bookingController.getProviderBookings);

// Update booking status
router.put("/:bookingId", authMiddleware, bookingController.updateBookingStatus);

module.exports = router;
