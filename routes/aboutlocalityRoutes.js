const express = require("express");
const router = express.Router();
const localityController = require("../controllers/aboutlocalityController");

// Create or update locality info
router.post("/:id", localityController.createOrUpdateLocality);

// Get locality by property ID
router.get("/:id", localityController.getLocalityByPropertyId);

// Delete locality by property ID
router.delete("/:id", localityController.deleteLocality);

module.exports = router;
