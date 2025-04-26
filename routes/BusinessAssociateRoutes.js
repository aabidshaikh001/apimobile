const BusinessAssociateModelController = require("../controllers/BusinessAssociateModelController.js");
const express = require("express")
const router = express.Router();

router.post("/", BusinessAssociateModelController.createProfile);
router.delete("/:id", BusinessAssociateModelController.deleteProfile);
router.get("/", BusinessAssociateModelController.getAllProfiles);
router.get("/:id", BusinessAssociateModelController.getProfileById);

module.exports = router;