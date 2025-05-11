const express = require("express");
const blogController = require("../controllers/blogController");

const router = express.Router();

// Routes for Blog
router.post("/", blogController.createBlog);  // Create Blog
router.get("/", blogController.getAllBlogs);   // Get All Blogs
router.get("/:id", blogController.getBlogById); // Get Blog by ID
router.put("/:id", blogController.updateBlog); // Update Blog
router.delete("/:id", blogController.deleteBlog); // Delete Blog

module.exports = router;
