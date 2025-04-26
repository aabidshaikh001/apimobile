const cloudinaryService = require("../utils/cloudinaryService.js");
const User = require("../models/User.js");

// Upload profile image
exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload image to Cloudinary
    const result = await cloudinaryService.uploadImage(req.file.buffer);
    if (!result.success) {
      return res.status(500).json({ message: "Failed to upload image", error: result.error });
    }

    // Update user profile with image URL
    const updateResult = await User.updateProfile(req.user.id, { image: result.url });
    if (!updateResult.success) {
      return res.status(500).json({ message: "Failed to update profile" });
    }

    res.status(200).json({
      message: "Profile image uploaded successfully",
      imageUrl: result.url,
    });
  } catch (error) {
    console.error("Upload profile image error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Upload document
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload document to Cloudinary
    const result = await cloudinaryService.uploadDocument(req.file.buffer);
    if (!result.success) {
      return res.status(500).json({ message: "Failed to upload document", error: result.error });
    }

    // Add document directly to user_documents table instead of fetching user first
    const updateResult = await User.updateProfile(req.user.id, { document: [result.url] });
    if (!updateResult.success) {
      return res.status(500).json({ message: "Failed to update user documents" });
    }

    res.status(200).json({
      message: "Document uploaded successfully",
      documentUrl: result.url,
    });
  } catch (error) {
    console.error("Upload document error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
