const express = require("express");
const router = express.Router();
const aboutUsController = require("../controllers/aboutUsController");

// GET About Us
router.get("/", aboutUsController.getAboutUs);

// POST new About Us
router.post("/", aboutUsController.addAboutUs);

// PUT (update) About Us
router.put("/", aboutUsController.updateAboutUs);

// DELETE About Us
router.delete("/", aboutUsController.deleteAboutUs);

module.exports = router;
