const Provider = require("../models/Provider");

// Create provider profile (user becomes a provider)
exports.createProvider = async (req, res) => {
  try {
    const { category, description, priceRange } = req.body;

    // Check if provider already exists for this user
    const existing = await Provider.findOne({ user: req.user.id });
    if (existing) {
      return res.status(400).json({ message: "Provider profile already exists" });
    }

    const provider = new Provider({
      user: req.user.id,
      category,
      description,
      priceRange,
    });

    await provider.save();
    res.status(201).json({ message: "Provider profile created", provider });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all providers (with optional filters)
exports.getProviders = async (req, res) => {
  try {
    const { category, priceRange, minRating } = req.query;
    let query = {};

    if (category) query.category = category;
    if (priceRange) query.priceRange = priceRange;
    if (minRating) query.rating = { $gte: Number(minRating) };

    const providers = await Provider.find(query).populate("user", "name email");
    res.json(providers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single provider
exports.getProviderById = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id).populate("user", "name email");
    if (!provider) return res.status(404).json({ message: "Provider not found" });

    res.json(provider);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update provider profile
exports.updateProvider = async (req, res) => {
  try {
    const provider = await Provider.findOne({ user: req.user.id });
    if (!provider) return res.status(404).json({ message: "Provider profile not found" });

    const { category, description, priceRange, availability } = req.body;
    provider.category = category || provider.category;
    provider.description = description || provider.description;
    provider.priceRange = priceRange || provider.priceRange;
    provider.availability = availability || provider.availability;

    await provider.save();
    res.json({ message: "Provider profile updated", provider });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete provider profile
exports.deleteProvider = async (req, res) => {
  try {
    const provider = await Provider.findOneAndDelete({ user: req.user.id });
    if (!provider) return res.status(404).json({ message: "Provider profile not found" });

    res.json({ message: "Provider profile deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
