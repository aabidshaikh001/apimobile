const express = require("express");
const router = express.Router();
const helpPagesController = require("../controllers/helpPagesController");

// POST: Create help page
router.post("/", helpPagesController.createHelpPage);

// DELETE: Delete help page by ID
router.delete("/:id", helpPagesController.deleteHelpPage);

router.get("/", helpPagesController.getAllHelpPages)

module.exports = router;
