const tokenService = require("../utils/tokenService")
const User = require("../models/User")
// Middleware to authenticate requests
const authenticate = async (req, res, next) => {
  try {
    // Extract token = require(request
    const token = tokenService.extractToken(req)

    if (!token) {
      return res.status(401).json({ message: "Authentication required" })
    }

    // Verify token
    const { success, data, message } = tokenService.verifyToken(token)

    if (!success) {
      return res.status(401).json({ message: "Invalid or expired token" })
    }

    // Get user = require(database
    const user = await User.findById(data.userId)

    if (!user) {
      return res.status(401).json({ message: "User not found" })
    }

    // Attach user to request object
    req.user = user

    next()
  } catch (error) {
    console.error("Authentication error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Middleware to handle file uploads
const handleFileUpload = (req, res, next) => {
  // This middleware will be implemented when we set up multer for file uploads
  next()
}

module.exports = {
  authenticate,
  handleFileUpload,
}