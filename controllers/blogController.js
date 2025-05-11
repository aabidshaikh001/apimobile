const BlogModel = require("../models/blogModel");

const blogController = {
  // Create Blog
  createBlog: async (req, res) => {
    try {
      const blogData = req.body;
      const newBlogId = await BlogModel.create(blogData);
      res.status(201).json({ message: "Blog created successfully", id: newBlogId });
    } catch (err) {
      console.error("❌ Error creating blog:", err.message);
      res.status(500).json({ error: "Failed to create blog" });
    }
  },

  // Get All Blogs
  getAllBlogs: async (req, res) => {
    try {
      const blogs = await BlogModel.getAll();
      res.status(200).json(blogs);
    } catch (err) {
      console.error("❌ Error fetching blogs:", err.message);
      res.status(500).json({ error: "Failed to fetch blogs" });
    }
  },

  // Get Blog by ID
  getBlogById: async (req, res) => {
    const { id } = req.params;
    try {
      const blog = await BlogModel.getById(id);
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
      res.status(200).json(blog);
    } catch (err) {
      console.error("❌ Error fetching blog:", err.message);
      res.status(500).json({ error: "Failed to fetch blog" });
    }
  },

  // Update Blog
  updateBlog: async (req, res) => {
    const { id } = req.params;
    const blogData = req.body;
    try {
      await BlogModel.update(id, blogData);
      res.status(200).json({ message: "Blog updated successfully" });
    } catch (err) {
      console.error("❌ Error updating blog:", err.message);
      res.status(500).json({ error: "Failed to update blog" });
    }
  },

  // Delete Blog
  deleteBlog: async (req, res) => {
    const { id } = req.params;
    try {
      await BlogModel.delete(id);
      res.status(200).json({ message: "Blog deleted successfully" });
    } catch (err) {
      console.error("❌ Error deleting blog:", err.message);
      res.status(500).json({ error: "Failed to delete blog" });
    }
  }
};

module.exports = blogController;
