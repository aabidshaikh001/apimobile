import express from "express";
import { 
    createBankInfo, 
    getBankInfoByPropertyId, 
    deleteBankInfoByPropertyId 
} from "../controllers/bankinfocontroller.js";

const router = express.Router();

router.post("/", createBankInfo);
router.get("/:propertyId", getBankInfoByPropertyId);
router.delete("/:propertyId", deleteBankInfoByPropertyId);

export default router;
