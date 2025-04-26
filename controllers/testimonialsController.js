const Testimonials = require("../models/Testimonials");

const createTestimonial = async (req, res) => {
  try {
    const { name, role, content, rating, image_url } = req.body;

    if (!name || !role || !content || !rating || !image_url) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    await Testimonials.createTestimonial({ name, role, content, rating, image_url });
    res.status(201).json({ success: true, message: "Testimonial created successfully." });
  } catch (error) {
    console.error("Error in createTestimonial:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonials.getAllTestimonials();
    res.status(200).json({ success: true, data: testimonials });
  } catch (error) {
    console.error("Error in getAllTestimonials:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  createTestimonial,
  getAllTestimonials
};
