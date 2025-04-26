const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/ratingscontroller");

// POST - Add new rating
router.post("/", ratingController.insertRating);

// GET - Get all ratings by propertyId
router.get("/:propertyId", ratingController.getRatingsByPropertyId);

// DELETE - Delete a rating by ID
router.delete("/:id", ratingController.deleteRatingById);

// DELETE - Delete all ratings for a property
router.delete("/:propertyId", ratingController.deleteRatingsByPropertyId);

module.exports = router;
