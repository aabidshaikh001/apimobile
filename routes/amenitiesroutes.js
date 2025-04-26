const express = require("express");
const router = express.Router();
const amenitiesController = require("../controllers/amenitiescontrollers");

// POST - Add multiple amenities
router.post("/:propertyId", amenitiesController.create);

// GET - Get amenities by property ID
router.get("/:propertyId", amenitiesController.getByPropertyId);

// DELETE - Delete amenities by property ID
router.delete("/:propertyId", amenitiesController.deleteByPropertyId);

module.exports = router;
