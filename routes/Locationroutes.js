const express = require("express");
const router = express.Router();
const controller = require("../controllers/locationcontroller");

// Add a location by property ID
router.post("/:id", controller.addLocationByPropertyId);

// Get all locations for a property
router.get("/:id", controller.getLocationsByPropertyId);

// Delete all locations for a property
router.delete("/:id", controller.deleteLocationsByPropertyId);

module.exports = router;
