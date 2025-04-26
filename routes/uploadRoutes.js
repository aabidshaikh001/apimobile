const express = require("express");
const multer = require("multer");
const uploadController = require("../controllers/uploadController");
const { authenticate } = require("../middlewares/authMiddleware");
const router = express.Router()

// Configure multer for memory storage
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
})

// Upload profile image
router.post("/profile-image", authenticate, upload.single("image"), uploadController.uploadProfileImage)

// Upload document
router.post("/document", authenticate, upload.single("document"), uploadController.uploadDocument)


module.exports = router; // CommonJS export
