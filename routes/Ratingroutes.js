import express from "express";
import { 
    insertRating, 
    getRatingsByPropertyId, 
    deleteRatingById, 
    deleteRatingsByPropertyId 
} from "../controllers/ratingscontroller.js";

const router = express.Router();

router.post("/", insertRating);
router.get("/:propertyId", getRatingsByPropertyId);
router.delete("/single/:id", deleteRatingById);
router.delete("/property/:propertyId", deleteRatingsByPropertyId);

export default router;
