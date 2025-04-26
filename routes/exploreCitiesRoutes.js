const express = require("express");
const router = express.Router();
const exploreCitiesController = require("../controllers/exploreCitiesController");

// POST a new explore city
router.post("/", exploreCitiesController.createExploreCity);

// GET all explore cities
router.get("/", exploreCitiesController.getAllExploreCities);

module.exports = router;
