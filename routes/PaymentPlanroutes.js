const express = require("express");
const { 
    insertPaymentPlan, 
    getPaymentPlansByPropertyId, 
    deletePaymentPlanById, 
    deletePaymentPlansByPropertyId 
} = require("../controllers/paymentplancontroller");

const router = express.Router();

router.post("/", insertPaymentPlan);
router.get("/:propertyId", getPaymentPlansByPropertyId);
router.delete("/single/:id", deletePaymentPlanById);
router.delete("/property/:propertyId", deletePaymentPlansByPropertyId);

module.exports = router; // CommonJS export
