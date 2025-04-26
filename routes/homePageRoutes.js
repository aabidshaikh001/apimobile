const express = require("express");
const router = express.Router();
const homePageController = require("../controllers/homePageController");

// Create a new homepage entry
router.post("/", homePageController.createHomePage);

// Get all homepage entries
router.get("/", homePageController.getAllHomePages);

// Get homepage entry by ID
router.get("/:id", homePageController.getHomePageById);

// Update homepage entry by ID
router.put("/:id", homePageController.updateHomePage);

// Delete homepage entry by ID
router.delete("/:id", homePageController.deleteHomePage);

module.exports = router;
