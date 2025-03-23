import express from "express";
import {
    createAmenity,
    getAmenitiesByPropertyId,
    deleteAmenitiesByPropertyId
} from "../controllers/amenitiescontrollers.js";

const router = express.Router();

router.post("/", createAmenity);  // Create Amenity
router.get("/:propertyId", getAmenitiesByPropertyId);  // Get by Property ID
router.delete("/:propertyId", deleteAmenitiesByPropertyId);  // Delete by Property ID

export default router;
