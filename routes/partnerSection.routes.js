const express = require("express");
const router = express.Router();
const partnerSectionController = require("../controllers/partnerSection.controller");

// GET - Fetch active section with cards
router.get("/", partnerSectionController.getPartnerSection);

// POST - Create new partner section
router.post("/", partnerSectionController.createPartnerSection);

// PUT - Update partner section by ID
router.put("/:id", partnerSectionController.updatePartnerSection);

// DELETE - Delete partner section by ID
router.delete("/:id", partnerSectionController.deletePartnerSection);

module.exports = router;
