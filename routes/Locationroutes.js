import express from "express";
import { 
    insertLocation, 
    getLocationsByPropertyId, 
    deleteLocationsByPropertyId 
} from "../controllers/locationcontroller.js";

const router = express.Router();

router.post("/", insertLocation);
router.get("/:propertyId", getLocationsByPropertyId);
router.delete("/:propertyId", deleteLocationsByPropertyId);

export default router;
