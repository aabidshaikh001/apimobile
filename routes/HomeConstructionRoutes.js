const  { createHomeConstruction,getAllHomeConstruction } = require("../controllers/HomeConstructionController.js");
const express = require("express")
const router = express.Router();
router.post("/", createHomeConstruction);
router.get("/", getAllHomeConstruction);
module.exports = router;