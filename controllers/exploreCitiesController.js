const ExploreCities = require("../models/ExploreCitites");

exports.createExploreCity = async (req, res) => {
  try {
    const { name, properties, image_url } = req.body;

    if (!name || !image_url) {
      return res.status(400).json({ success: false, message: "Name and image_url are required." });
    }

    await ExploreCities.createExploreCity({ name, properties, image_url });

    res.status(201).json({ success: true, message: "Explore city created successfully." });
  } catch (error) {
    console.error("Controller Error - createExploreCity:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

exports.getAllExploreCities = async (req, res) => {
  try {
    const cities = await ExploreCities.getAllExploreCities();
    res.status(200).json({ success: true, data: cities });
  } catch (error) {
    console.error("Controller Error - getAllExploreCities:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};
