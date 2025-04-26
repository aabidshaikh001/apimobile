const express = require("express");
const router = express.Router();
const floorPlanController = require("../controllers/floorplancontoller");

// POST /api/floorplans/:id → Add floor plan by propertyId
router.post("/:id", floorPlanController.addFloorPlanByPropertyId);

// GET /api/floorplans/:id → Get all floor plans for propertyId
router.get("/:id", floorPlanController.getFloorPlansByPropertyId);

// DELETE /api/floorplans/:id → Delete all floor plans for propertyId
router.delete("/:id", floorPlanController.deleteFloorPlansByPropertyId);

module.exports = router;
