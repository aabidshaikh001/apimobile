const express = require("express");
const router = express.Router();
const faqController = require("../controllers/faqController");

// Route to create FAQ entries in bulk
router.post("/", faqController.createFaqs);

// Route to get all FAQs
router.get("/", faqController.getFaqs);

// Route to delete an FAQ entry by ID
router.delete("/:id", faqController.deleteFaq);

module.exports = router;
