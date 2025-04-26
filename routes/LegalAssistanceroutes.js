const  {createLegalAssistance, getAllLegalAssistance} = require("../controllers/LegalAssistanceController.js");
const express = require("express")
const router = express.Router();
router.post("/", createLegalAssistance);
router.get("/", getAllLegalAssistance);
module.exports = router;