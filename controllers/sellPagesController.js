// controllers/sellPagesController.js
const SellPages = require("../models/SellPageData");

exports.createSellPage = async (req, res) => {
  try {
    const { sellPageName, sellPageData } = req.body;
    await SellPages.create(sellPageName, JSON.stringify(sellPageData));
    res.status(201).json({ success: true, message: "Sell page created successfully" });
  } catch (error) {
    console.error("Error creating sell page:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getAllSellPages = async (req, res) => {
  try {
    const pages = await SellPages.getAll();
    const parsedPages = pages.map(page => ({
      ...page,
      sellPageData: JSON.parse(page.sellPageData)
    }));
    res.status(200).json({ success: true, data: parsedPages });
  } catch (error) {
    console.error("Error fetching sell pages:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getSellPageById = async (req, res) => {
  try {
    const { id } = req.params;
    const page = await SellPages.getById(id);
    if (!page) {
      return res.status(404).json({ success: false, message: "Sell page not found" });
    }
    res.status(200).json({ success: true, data: { ...page, sellPageData: JSON.parse(page.sellPageData) } });
  } catch (error) {
    console.error("Error fetching sell page:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
