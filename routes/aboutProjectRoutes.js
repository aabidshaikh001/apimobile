const express = require("express");
const router = express.Router();
const {
  createAboutProject,
  getAboutProject,
  updateAboutProject
} = require("../controllers/aboutProjectController");

// POST /api/aboutproject/:propertyId
router.post("/:propertyId", createAboutProject);

// GET /api/aboutproject/:propertyId
router.get("/:propertyId", getAboutProject);

// PUT /api/aboutproject/:propertyId
router.put("/:propertyId", updateAboutProject);

module.exports = router;
