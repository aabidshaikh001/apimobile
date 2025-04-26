const express = require("express");
const router = express.Router();
const {
  subscribeNewsletter,
  getAllNewsletters,
} = require("../controllers/newsletterController");

// POST - Subscribe email to newsletter
router.post("/subscribe", subscribeNewsletter);

// GET - Fetch all newsletter subscriptions
router.get("/all", getAllNewsletters);

module.exports = router;
