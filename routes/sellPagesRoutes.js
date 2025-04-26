// routes/sellPagesRoutes.js
const express = require("express");
const router = express.Router();
const sellPagesController = require("../controllers/sellPagesController");

// Routes
router.post("/", sellPagesController.createSellPage);
router.get("/", sellPagesController.getAllSellPages);
router.get("/:id", sellPagesController.getSellPageById);

module.exports = router;
