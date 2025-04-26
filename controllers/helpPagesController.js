const HelpPages = require("../models/Helppagedata");

exports.createHelpPage = async (req, res) => {
  try {
    const { helpPageName, helpPageData } = req.body;

    if (!helpPageName || !helpPageData) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Store as stringified JSON
    await HelpPages.create(helpPageName, JSON.stringify(helpPageData));

    res.status(201).json({ message: "Help page created successfully." });
  } catch (error) {
    console.error("Create Help Page Error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.deleteHelpPage = async (req, res) => {
  try {
    const { id } = req.params;

    await HelpPages.delete(id);
    res.status(200).json({ message: "Help page deleted successfully." });
  } catch (error) {
    console.error("Delete Help Page Error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.getAllHelpPages = async (req, res) => {
  try {
    const helpPages = await HelpPages.getAll();

    const parsedPages = helpPages.map(page => ({
      ...page,
      helpPageData: JSON.parse(page.helpPageData),
    }));

    res.status(200).json({ success: true, data: parsedPages });
  } catch (error) {
    console.error("Get All Help Pages Error:", error);
    res.status(500).json({ message: "Server error." });
  }
};
