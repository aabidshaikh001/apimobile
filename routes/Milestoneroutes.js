const express = require("express");
const { 
    insertMilestone, 
    getMilestonesByPropertyId, 
    deleteMilestoneById, 
    deleteMilestonesByPropertyId 
} = require("../controllers/milestonecontroller");
const router = express.Router();

router.post("/", insertMilestone);
router.get("/:propertyId", getMilestonesByPropertyId);
router.delete("/single/:id", deleteMilestoneById);
router.delete("/property/:propertyId", deleteMilestonesByPropertyId);

module.exports = router; // CommonJS export
