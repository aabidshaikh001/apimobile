const express = require("express");
const { 
    upsertBrochure, 
    getBrochureByPropertyId, 
    deleteBrochureByPropertyId 
} = require("../controllers/brochurecontroller");

const router = express.Router();

router.post("/", upsertBrochure);
router.get("/:propertyId", getBrochureByPropertyId);
router.delete("/:propertyId", deleteBrochureByPropertyId);

module.exports = router; // CommonJS export
