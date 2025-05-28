const {
  getAllPropertyCategories,
  getAllPropertyTags,
} = require("../models/PropertyCategoryandtag");

// Fetch property categories
const fetchPropertyCategories = async (req, res) => {
  try {
    const categories = await getAllPropertyCategories();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.error("Controller Error (Categories):", error);
    res.status(500).json({ success: false, message: "Failed to fetch categories" });
  }
};

// Fetch property tags
const fetchPropertyTags = async (req, res) => {
  try {
    const tags = await getAllPropertyTags();
    res.status(200).json({ success: true, data: tags });
  } catch (error) {
    console.error("Controller Error (Tags):", error);
    res.status(500).json({ success: false, message: "Failed to fetch tags" });
  }
};

module.exports = {
  fetchPropertyCategories,
  fetchPropertyTags,
};
