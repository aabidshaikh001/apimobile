const buyCategory = require("../models/buyCategory.model");

exports.getAllBuyCategories = async (req, res) => {
  try {
    const data = await buyCategory.getAll();
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("❌ Error getting buy categories:", error);
    res.status(500).json({ success: false, message: "Failed to get buy categories" });
  }
};

exports.createBuyCategory = async (req, res) => {
  const { heading, items } = req.body;
  if (!heading || !items) {
    return res.status(400).json({ success: false, message: "Missing heading or items" });
  }

  try {
    await buyCategory.create(heading, items);
    res.status(201).json({ success: true, message: "Buy category created successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
