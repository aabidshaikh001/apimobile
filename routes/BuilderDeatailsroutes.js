import express from "express";
import { 
    upsertBuilderDetails, 
    getBuilderDetailsByPropertyId, 
    deleteBuilderDetailsByPropertyId 
} from "../controllers/builderdeatils.js";

const router = express.Router();

router.post("/", upsertBuilderDetails);
router.get("/:propertyId", getBuilderDetailsByPropertyId);
router.delete("/:propertyId", deleteBuilderDetailsByPropertyId);

export default router;
