const Booking = require("../models/Booking");

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const { provider, service, date } = req.body;

    if (!provider || !service || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const booking = new Booking({
      user: req.user.id, // from authMiddleware
      provider,
      service,
      date,
    });

    await booking.save();
    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get bookings for logged-in user
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate("provider", "name email");
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get bookings for a provider (e.g., if user is a service provider)
exports.getProviderBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ provider: req.user.id }).populate("user", "name email");
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update booking status (provider/admin only)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = status || booking.status;
    await booking.save();

    res.json({ message: "Booking status updated", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
