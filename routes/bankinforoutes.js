const express = require("express");
const router = express.Router();
const bankInfoController = require("../controllers/bankinfocontroller");

// Route to insert bank info
router.post("/", bankInfoController.insertBankInfo);

// Route to get bank info by propertyId
router.get("/:propertyId", bankInfoController.getBankInfo);

// Route to delete bank info by propertyId
router.delete("/:propertyId", bankInfoController.deleteBankInfo);

module.exports = router;
