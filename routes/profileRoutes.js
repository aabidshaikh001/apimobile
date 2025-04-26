const express = require("express");
const profileController = require("../controllers/profileController");
const { authenticate } = require("../middlewares/authMiddleware");


const router = express.Router()

// Get current user profile
router.get("/", authenticate, profileController.getProfile)

// Update current user profile
router.put("/", authenticate, profileController.updateProfile)

// Get profile by ID (admin only)
router.get("/:id", authenticate, profileController.getProfileById)
module.exports = router; // CommonJS export