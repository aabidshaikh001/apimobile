const express = require("express");
const router = express.Router();
const {
  createAboutDeveloper,
  getAboutDeveloper,
  updateAboutDeveloper
} = require("../controllers/aboutDeveloperController");

// POST /api/aboutdeveloper/:propertyId
router.post("/:propertyId", createAboutDeveloper);

// GET /api/aboutdeveloper/:propertyId
router.get("/:propertyId", getAboutDeveloper);

// PUT /api/aboutdeveloper/:propertyId
router.put("/:propertyId", updateAboutDeveloper);

module.exports = router;
