import express from "express"
import * as profileController from "../controllers/profileController.js"
import { authenticate } from "../middlewares/authMiddleware.js"

const router = express.Router()

// Get current user profile
router.get("/", authenticate, profileController.getProfile)

// Update current user profile
router.put("/", authenticate, profileController.updateProfile)

// Get profile by ID (admin only)
router.get("/:id", authenticate, profileController.getProfileById)

export default router

