const express = require("express");
const {
    createQuries,
    getQuriesById,
    getAllQuries,
    updateQuries,
    deleteQuries
} = require("../controllers/queriescontrollers");

const router = express.Router();

router.post("/", createQuries);
router.get("/", getAllQuries);
router.get("/:id", getQuriesById);
router.put("/:id", updateQuries);
router.delete("/:id", deleteQuries);

module.exports = router; // CommonJS export