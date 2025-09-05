const express = require("express");
const router = express.Router();
const providerController = require("../controllers/providerController");
const authMiddleware = require("../middleware/authMiddleware");
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createProvider);
router.get('/', listProviders);

// Create provider profile
router.post("/", authMiddleware, providerController.createProvider);

// Get all providers (with filters)
router.get("/", providerController.getProviders);

// Get single provider
router.get("/:id", providerController.getProviderById);

// Update provider profile (only logged-in provider)
router.put("/", authMiddleware, providerController.updateProvider);

// Delete provider profile
router.delete("/", authMiddleware, providerController.deleteProvider);

module.exports = router;
