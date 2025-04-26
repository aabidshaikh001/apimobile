const BlogModel = require("../models/blogModel.js");

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await BlogModel.getAll();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving blogs", error: error.message });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await BlogModel.getById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving blog", error: error.message });
  }
};

exports.createBlog = async (req, res) => {
  try {
    const newBlogId = await BlogModel.create(req.body);
    res.status(201).json({ message: "Blog created successfully", id: newBlogId });
  } catch (error) {
    res.status(500).json({ message: "Error creating blog", error: error.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    await BlogModel.delete(req.params.id);
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting blog", error: error.message });
  }
};
