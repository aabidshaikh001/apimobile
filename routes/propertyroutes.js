import {getPropertyById, getAllProperties,deleteProperty,insertProperty,updateProperty,  getFeaturedProperties, getSavedProperties } from "../controllers/propertyController.js";
import express from "express";

const router = express.Router();

// Get all properties
router.get("/", getAllProperties);
// Get property by ID
router.get("/:id", getPropertyById);
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
export default router;