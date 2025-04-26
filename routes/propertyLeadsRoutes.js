const express = require("express");
const router = express.Router();
const propertyLeadsController = require("../controllers/propertyLeadsController");

// POST: Submit a lead
router.post("/", propertyLeadsController.createLead);

// GET: Get leads by property ID
router.get("/:propertyId", propertyLeadsController.getLeads);

// DELETE: Delete a lead by ID
router.delete("/:id", propertyLeadsController.deleteLead);

module.exports = router;
