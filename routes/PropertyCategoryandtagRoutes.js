const express = require("express");
const router = express.Router();
const {
  fetchPropertyCategories,
  fetchPropertyTags,
} = require("../controllers/PropertyCategoryandtag");

// GET /api/master/categories
router.get("/categories", fetchPropertyCategories);

// GET /api/master/tags
router.get("/tags", fetchPropertyTags);

module.exports = router;
