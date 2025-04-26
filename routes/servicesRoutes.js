const express = require("express");
const router = express.Router();
const servicesController = require("../controllers/servicesController");

// GET all services
router.get("/", servicesController.getAllServices);

// POST a new service
router.post("/", servicesController.createService);

module.exports = router;
