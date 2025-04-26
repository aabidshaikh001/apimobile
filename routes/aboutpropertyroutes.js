const express = require("express");
const {
    createAboutProperty,
    getAboutPropertyByPropertyId,
    updateAboutProperty,
    deleteAboutProperty
} = require("../controllers/aboutpropertycontoller");

const router = express.Router();

router.post("/", createAboutProperty);  // Create AboutProperty
router.get("/:propertyId", getAboutPropertyByPropertyId);  // Get by Property ID
router.put("/:propertyId", updateAboutProperty);  // Update AboutProperty
router.delete("/:propertyId", deleteAboutProperty);  // Delete AboutProperty

module.exports = router;  // CommonJS export
