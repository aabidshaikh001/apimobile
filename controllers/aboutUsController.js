const AboutUs = require("../models/AboutUs");

exports.getAboutUs = async (req, res) => {
    try {
        const data = await AboutUs.getAboutUsData();
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch About Us data." });
    }
};

exports.addAboutUs = async (req, res) => {
    try {
        const result = await AboutUs.addAboutUsData(req.body);
        res.status(201).json({ success: true, message: "About Us data added successfully.", result });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to add About Us data." });
    }
};

exports.updateAboutUs = async (req, res) => {
    try {
        const result = await AboutUs.updateAboutUsData(req.body);
        res.status(200).json({ success: true, message: "About Us data updated successfully.", result });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update About Us data." });
    }
};

exports.deleteAboutUs = async (req, res) => {
    try {
        const result = await AboutUs.deleteAboutUsData();
        res.status(200).json({ success: true, message: "About Us data deleted successfully.", result });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete About Us data." });
    }
};
