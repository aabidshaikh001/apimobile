
const  { createHomeInterior,getAllHomeInterior } = require("../controllers/HomeInteriorController.js");
const express = require("express")
const router = express.Router();
router.post("/", createHomeInterior);
router.get("/", getAllHomeInterior);
module.exports = router;