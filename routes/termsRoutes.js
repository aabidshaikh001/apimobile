const express = require("express");
const router = express.Router();
const termsController = require("../controllers/termsController");

// GET all terms
router.get("/", termsController.getAllTerms);

// GET single term by ID
router.get("/:id", termsController.getTermById);

// POST new term
router.post("/", termsController.createTerm);

// PUT update term by ID
router.put("/:id", termsController.updateTerm);

// DELETE term by ID
router.delete("/:id", termsController.deleteTerm);

module.exports = router;
