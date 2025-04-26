const User = require("../models/User");
const OTP = require("../models/OTP");
const emailService = require("../utils/emailService");
const tokenService = require("../utils/tokenService");

// Send OTP for login
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if user exists
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User not found. Please register first." });
    }

    // Generate OTP
    const { otp } = await OTP.generateOTP(email, "login");

    // Send OTP via email
    await emailService.sendOTP(email, otp, "login");

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Verify OTP for login
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Verify OTP
    const verification = await OTP.verifyOTP(email, otp, "login");

    if (!verification.success) {
      return res.status(400).json({ message: verification.message });
    }

    // Get user
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate JWT token
    const token = tokenService.generateToken({ userId: user.id, email: user.email });

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
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Register new user
// Register new user
exports.register = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Registration request for:", email);

    if (!email) {
      return errorResponse(res, 400, "Email is required");
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return errorResponse(res, 400, "Invalid email format");
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return errorResponse(res, 400, "User with this email already exists");
    }

    const { otp, error: genError } = await OTP.generateOTP(email, "registration");
    if (genError) {
      return errorResponse(res, 500, "Failed to generate OTP", genError);
    }

    const emailResult = await emailService.sendOTP(email, otp, "registration");
    if (!emailResult.success) {
      return errorResponse(res, 500, "Failed to send registration OTP", emailResult.error);
    }

    res.status(200).json({ 
      success: true,
      message: "OTP sent to your email for registration" 
    });
  } catch (error) {
    errorResponse(res, 500, "Server error during registration", error);
  }
};
// Verify OTP for registration
exports.verifyRegistrationOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log("Registration OTP verification for:", email);

    if (!email || !otp) {
      return errorResponse(res, 400, "Email and OTP are required");
    }

    const verification = await OTP.verifyOTP(email, otp, "registration");
    if (!verification.success) {
      return errorResponse(res, 400, verification.message);
    }

    const result = await User.createUser({ email });
    if (!result.success) {
      return errorResponse(res, 400, result.message);
    }

    res.status(201).json({
      success: true,
      message: "Registration successful. You can now login.",
      userId: result.userId,
    });
  } catch (error) {
    errorResponse(res, 500, "Server error during registration verification", error);
  }
};
// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get fresh user data = require(database
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userData = req.body;

    console.log("Updating profile for user:", userId);
    console.log("Update data:", userData);

    // Validate required fields if necessary
    if (userData.email) {
      const existingUser = await User.findByEmail(userData.email);
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ message: "Email already in use by another account" });
      }
    }

    // Update user profile
    const result = await User.updateProfile(userId, userData);

    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }

    // Get updated user
    const updatedUser = await User.findById(userId);

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found after update" });
    }

    // Return the updated user data
    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Logout (for completeness)
exports.logout = (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
};
