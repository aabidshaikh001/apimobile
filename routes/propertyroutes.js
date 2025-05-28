const express = require("express");

const { getAllProperties,
    getPropertyById,
    insertProperty,
    updateProperty,
    deleteProperty,
    getFeaturedProperties,
    getSavedProperties } = require("../controllers/propertyController");

const router = express.Router();

// Get all properties
router.get("/", getAllProperties);
// Get property by ID
router.get('/:PropertyId', getPropertyById);
// Insert a new property
router.post("/", insertProperty);
// Update a property
router.put("/:id", updateProperty);
// Delete a property
router.delete("/:id", deleteProperty);
// Get featured properties
router.get("/featured", getFeaturedProperties);
// Get saved properties
router.get("/saved/:userId", getSavedProperties);
// Export the router
module.exports = router; // CommonJS export