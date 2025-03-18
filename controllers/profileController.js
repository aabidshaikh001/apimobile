import User from "../models/User.js"

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id

    // Get user from database
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.status(200).json(user)
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Update user profile with better error handling
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id
    const userData = req.body

    console.log("Updating profile for user:", userId)
    console.log("Update data:", userData)

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

// Get profile by ID (admin only)
export const getProfileById = async (req, res) => {
  try {
    const { id } = req.params

    // Get user from database
    const user = await User.findById(id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.status(200).json(user)
  } catch (error) {
    console.error("Get profile by ID error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

