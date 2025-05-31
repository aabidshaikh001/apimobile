const express = require("express");
const router = express.Router();
const AmenitiesController = require("../controllers/amenitiescontrollers");

router.post("/create-table", AmenitiesController.createTable);
router.post("/", AmenitiesController.insertAmenity);
router.post("/bulk", AmenitiesController.insertMultipleAmenities);
router.get("/:propertyId", AmenitiesController.getAmenitiesByPropertyId);
router.delete("/:propertyId", AmenitiesController.deleteAmenitiesByPropertyId);

module.exports = router;
