import express from "express";
import { 
    upsertBrochure, 
    getBrochureByPropertyId, 
    deleteBrochureByPropertyId 
} from "../controllers/brochurecontroller.js";

const router = express.Router();

router.post("/", upsertBrochure);
router.get("/:propertyId", getBrochureByPropertyId);
router.delete("/:propertyId", deleteBrochureByPropertyId);

export default router;
