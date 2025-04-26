const  {createHomeLoan, getAllHomeLoans} = require("../controllers/HomeLoanController.js");
const express = require("express")
const router = express.Router();
router.post("/", createHomeLoan);
router.get("/", getAllHomeLoans);
module.exports = router;