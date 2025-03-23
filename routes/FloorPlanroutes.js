import express from "express";
import { 
    upsertFloorPlan, 
    getFloorPlanByPropertyId, 
    deleteFloorPlanByPropertyId 
} from "../controllers/floorplancontoller.js";

const router = express.Router();

router.post("/", upsertFloorPlan);
router.get("/:propertyId", getFloorPlanByPropertyId);
router.delete("/:propertyId", deleteFloorPlanByPropertyId);

export default router;
