import express from "express"
import * as authController from "../controllers/authController.js"
import { authenticate } from "../middlewares/authMiddleware.js"

const router = express.Router()

// Public routes
router.post("/sendotp", authController.sendOTP)
router.post("/verifyotp", authController.verifyOTP)
router.post("/register", authController.register)
router.post("/verifyregistrationotp", authController.verifyRegistrationOTP)
router.post("/logout", authController.logout)

// Protected routes
router.get("/user", authenticate, authController.getCurrentUser)
router.put("/user/profile", authenticate, authController.updateProfile)

// Add a test route to check if the API is working
router.get("/test", (req, res) => {
  res.status(200).json({ message: "Auth API is working" })
})

// Add a more detailed profile route
router.get("/user/profile", authenticate, authController.getCurrentUser)

export default router

