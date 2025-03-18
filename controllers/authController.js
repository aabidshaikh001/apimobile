import User from "../models/User.js"
import OTP from "../models/OTP.js"
import emailService from "../utils/emailService.js"
import tokenService from "../utils/tokenService.js"

// Send OTP for login
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: "Email is required" })
    }

    // Check if user exists
    const user = await User.findByEmail(email)

    if (!user) {
      return res.status(404).json({ message: "User not found. Please register first." })
    }

    // Generate OTP
    const { otp } = await OTP.generateOTP(email, "login")

    // Send OTP via email
    await emailService.sendOTP(email, otp, "login")

    res.status(200).json({ message: "OTP sent to your email" })
  } catch (error) {
    console.error("Send OTP error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Verify OTP for login
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" })
    }

    // Verify OTP
    const verification = await OTP.verifyOTP(email, otp, "login")

    if (!verification.success) {
      return res.status(400).json({ message: verification.message })
    }

    // Get user
    const user = await User.findByEmail(email)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Generate JWT token
    const token = tokenService.generateToken({ userId: user.id, email: user.email })

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.address,
        pinNumber: user.pinNumber,
        image: user.image,
        reraNumber: user.reraNumber,
        document: user.document,
        bankName: user.bankName,
        accountNumber: user.accountNumber,
        ifscCode: user.ifscCode,
        recipientName: user.recipientName,
      },
    })
  } catch (error) {
    console.error("Verify OTP error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Register new user
export const register = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: "Email is required" })
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email)

    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" })
    }

    // Generate OTP for registration
    const { otp } = await OTP.generateOTP(email, "registration")

    // Send OTP via email
    await emailService.sendOTP(email, otp, "registration")

    res.status(200).json({ message: "OTP sent to your email for registration" })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Verify OTP for registration
export const verifyRegistrationOTP = async (req, res) => {
  try {
    const { email, otp } = req.body

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" })
    }

    // Verify OTP
    const verification = await OTP.verifyOTP(email, otp, "registration")

    if (!verification.success) {
      return res.status(400).json({ message: verification.message })
    }

    // Create new user
    const result = await User.createUser({ email })

    if (!result.success) {
      return res.status(400).json({ message: result.message })
    }

    res.status(201).json({
      message: "Registration successful. You can now login.",
      userId: result.userId,
    })
  } catch (error) {
    console.error("Verify registration OTP error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Improve the getCurrentUser controller
export const getCurrentUser = async (req, res) => {
  try {
    // User is attached to request by auth middleware
    if (!req.user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Get fresh user data from database
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.status(200).json(user)
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Enhance the updateProfile controller with better error handling
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id
    const userData = req.body

    console.log("Updating profile for user:", userId)
    console.log("Update data:", userData)

    // Validate required fields if necessary
    if (userData.email) {
      const existingUser = await User.findByEmail(userData.email)
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ message: "Email already in use by another account" })
      }
    }

    // Update user profile
    const result = await User.updateProfile(userId, userData)

    if (!result.success) {
      return res.status(400).json({ message: result.message })
    }

    // Get updated user
    const updatedUser = await User.findById(userId)

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found after update" })
    }

    // Return the updated user data
    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    })
  } catch (error) {
    console.error("Update profile error:", error)
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    })
  }
}

// Logout (optional - for server-side session management)
export const logout = async (req, res) => {
  // Since we're using JWT, there's no server-side session to invalidate
  // This endpoint is just for completeness
  res.status(200).json({ message: "Logged out successfully" })
}

