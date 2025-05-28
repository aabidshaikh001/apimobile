const express = require("express");
const router = express.Router();
const builderController = require("../controllers/builderdeatils");

router.post("/", builderController.createBuilder);
router.get("/", builderController.getAllBuilders);
router.get("/:id", builderController.getBuilderById);
router.put("/:id", builderController.updateBuilder);
router.delete("/:id", builderController.deleteBuilder);
router.get("/:id/details", builderController.getBuilderWithDetails);

module.exports = router;
