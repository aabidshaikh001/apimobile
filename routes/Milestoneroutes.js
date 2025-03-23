import express from "express";
import { 
    insertMilestone, 
    getMilestonesByPropertyId, 
    deleteMilestoneById, 
    deleteMilestonesByPropertyId 
} from "../controllers/milestonecontroller.js";

const router = express.Router();

router.post("/", insertMilestone);
router.get("/:propertyId", getMilestonesByPropertyId);
router.delete("/single/:id", deleteMilestoneById);
router.delete("/property/:propertyId", deleteMilestonesByPropertyId);

export default router;
