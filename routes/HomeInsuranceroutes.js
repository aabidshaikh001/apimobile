const  {createHomeInsurance, getAllHomeInsurances} = require("../controllers/HomeInsurancecontroller.js");
const express = require("express")
const router = express.Router();
router.post("/", createHomeInsurance);
router.get("/", getAllHomeInsurances);
module.exports = router;
