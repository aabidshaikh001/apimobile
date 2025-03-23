import express from "express";
import {
    createAboutProperty,
    getAboutPropertyByPropertyId,
    updateAboutProperty,
    deleteAboutProperty
} from "../controllers/aboutpropertycontoller.js";

const router = express.Router();

router.post("/", createAboutProperty);  // Create AboutProperty
router.get("/:propertyId", getAboutPropertyByPropertyId);  // Get by Property ID
router.put("/:propertyId", updateAboutProperty);  // Update AboutProperty
router.delete("/:propertyId", deleteAboutProperty);  // Delete AboutProperty

export default router;
