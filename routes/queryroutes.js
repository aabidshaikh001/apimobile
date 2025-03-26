import express from "express";
import {
    createQuries,
    getQuriesById,
    getAllQuries,
    updateQuries,
    deleteQuries
} from "../controllers/queriescontrollers.js";

const router = express.Router();

router.post("/", createQuries);
router.get("/", getAllQuries);
router.get("/:id", getQuriesById);
router.put("/:id", updateQuries);
router.delete("/:id", deleteQuries);

export default router;
