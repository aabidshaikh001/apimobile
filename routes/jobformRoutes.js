const express = require("express")
const  multer = require("multer");
const  { applyForJob,getJobApplications  } = require("../controllers/jobformController.js");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/apply", upload.single("resume"), applyForJob);
router.get("/applications", getJobApplications);

module.exports = router;
