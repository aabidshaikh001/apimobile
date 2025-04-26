// routes/buyCategory.routes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/buyCategory.controller");

router.get("/", controller.getAllBuyCategories);
router.post("/", controller.createBuyCategory);

module.exports = router;
