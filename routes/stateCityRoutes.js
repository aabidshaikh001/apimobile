const express = require("express");
const router = express.Router();
const {
  createStateWithCities,
  getAllStateCities,
} = require("../controllers/stateCityController");

router.post("/", createStateWithCities); // body: { state: "Rajasthan", cities: ["Jaipur", "Bikaner"] }
router.get("/", getAllStateCities);

module.exports = router;
