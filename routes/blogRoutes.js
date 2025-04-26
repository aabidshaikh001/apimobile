const express = require("express")
const { getAllBlogs, getBlogById, createBlog, deleteBlog } = require("../controllers/blogController.js");

const router = express.Router();

router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.post("/", createBlog);
router.delete("/:id", deleteBlog);

module.exports = router;
