const express = require("express");
const { 
    upsertBuilderDetails, 
    getBuilderDetailsByPropertyId, 
    deleteBuilderDetailsByPropertyId,
    getAllBuilderDetails 
} = require("../controllers/builderdeatils");

const router = express.Router();

router.post("/", upsertBuilderDetails);
router.get("/:propertyId", getBuilderDetailsByPropertyId);
router.delete("/:propertyId", deleteBuilderDetailsByPropertyId);
router.get("/", getAllBuilderDetails);

module.exports = router; // CommonJS export