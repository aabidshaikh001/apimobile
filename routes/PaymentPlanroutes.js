import express from "express";
import { 
    insertPaymentPlan, 
    getPaymentPlansByPropertyId, 
    deletePaymentPlanById, 
    deletePaymentPlansByPropertyId 
} from "../controllers/paymentPlanController.js";

const router = express.Router();

router.post("/", insertPaymentPlan);
router.get("/:propertyId", getPaymentPlansByPropertyId);
router.delete("/single/:id", deletePaymentPlanById);
router.delete("/property/:propertyId", deletePaymentPlansByPropertyId);

export default router;
