const  {getAllPropertyValuations, createPropertyValuation, deletePropertyValuation, updatePropertyValuation} = require("../controllers/propertyvalutioncontroller.js");
const express = require("express")
const router = express.Router();
router.get("/", getAllPropertyValuations);
router.post("/", createPropertyValuation);
router.delete("/:id", deletePropertyValuation);
router.put("/:id", updatePropertyValuation);
module.exports = router;