const express = require("express");
const router = express.Router();
const {
  createTestimonial,
  getAllTestimonials
} = require("../controllers/testimonialsController");

router.post("/", createTestimonial);
router.get("/", getAllTestimonials);

module.exports = router;
