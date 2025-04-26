const rentCategory = require("../models/rentcatogry");

exports.getAllrentCategory = async (req, res) => {
  try {
    const data = await rentCategory.getAll();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createrentCategory = async (req, res) => {
  const { heading, items } = req.body;
  if (!heading || !items) {
    return res.status(400).json({ success: false, message: "Missing heading or items" });
  }

  try {
    await rentCategory.create(heading, items);
    res.status(201).json({ success: true, message: "Rent category created successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
