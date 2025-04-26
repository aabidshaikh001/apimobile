// routes/buyCategory.routes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/rentCategoryController");

router.get("/", controller.getAllrentCategory);
router.post("/", controller.createrentCategory);

module.exports = router;
