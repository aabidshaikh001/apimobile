const express = require("express");
const router = express.Router();
const youtubeVideoController = require("../controllers/youtubeVideoController");

router.get("/:id", youtubeVideoController.getVideoByPropertyId);
router.post("/:id", youtubeVideoController.createOrUpdateVideo);
router.delete("/:id", youtubeVideoController.deleteVideo);

module.exports = router;
