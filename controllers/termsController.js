const TermsOfService = require("../models/TermsOfService");

const getAllTerms = async (req, res) => {
  try {
    const terms = await TermsOfService.getAllTermsOfService();
    res.status(200).json({ success: true, data: terms });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching terms.", error });
  }
};

const getTermById = async (req, res) => {
  try {
    const term = await TermsOfService.getTermsOfServiceById(req.params.id);
    if (!term) {
      return res.status(404).json({ success: false, message: "Term not found." });
    }
    res.status(200).json({ success: true, data: term });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching term.", error });
  }
};

const createTerm = async (req, res) => {
  try {
    await TermsOfService.createTermsOfService(req.body);
    res.status(201).json({ success: true, message: "Term created successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating term.", error });
  }
};

const updateTerm = async (req, res) => {
  try {
    await TermsOfService.updateTermsOfService(req.params.id, req.body);
    res.status(200).json({ success: true, message: "Term updated successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating term.", error });
  }
};

const deleteTerm = async (req, res) => {
  try {
    await TermsOfService.deleteTermsOfService(req.params.id);
    res.status(200).json({ success: true, message: "Term deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting term.", error });
  }
};

module.exports = {
  getAllTerms,
  getTermById,
  createTerm,
  updateTerm,
  deleteTerm,
};
