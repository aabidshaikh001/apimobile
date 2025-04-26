const HomePage = require("../models/homepagedata"); // Assuming HomePage is in models

// Create a new entry
const createHomePage = async (req, res) => {
  try {
    const { homeComponentName, homeComponenData } = req.body;
    await HomePage.create({ homeComponentName, homeComponenData });
    res.status(201).json({ message: "HomePage data created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getAllHomePages = async (req, res) => {
    try {
      const data = await HomePage.getAll();
      const parsedData = data.map(item => ({
        ...item,
        homeComponenData: JSON.parse(item.homeComponenData)
      }));
      
      res.status(200).json(parsedData);
    } catch (error) {
      console.error("Error fetching homepage data:", error);
      res.status(500).json({ error: error.message });
    }
  };
  
// Get homepage data by ID
const getHomePageById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await HomePage.getById(id);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: "HomePage not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Update homepage data
const updateHomePage = async (req, res) => {
  try {
    const { id } = req.params;
    const { homeComponentName, homeComponenData } = req.body;
    await HomePage.update(id, { homeComponentName, homeComponenData });
    res.status(200).json({ message: "HomePage updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Delete homepage data by ID
const deleteHomePage = async (req, res) => {
  try {
    const { id } = req.params;
    await HomePage.delete(id);
    res.status(200).json({ message: "HomePage deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createHomePage,
  getAllHomePages,
  getHomePageById,
  updateHomePage,
  deleteHomePage
};
