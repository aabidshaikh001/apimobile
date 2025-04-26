const Privacypolicy = require('../models/privacypolicy');

// Create a new privacy policy
const createPrivacypolicy = async (req, res) => {
    try {
        const { title, content } = req.body;
        await Privacypolicy.createPrivacypolicy({ title, content });
        res.status(201).json({ success: true, message: "Privacy policy created successfully." });
    } catch (error) {
        console.error("Controller Error - createPrivacypolicy:", error);
        res.status(500).json({ success: false, message: "Failed to create privacy policy." });
    }
};

// Get all privacy policies
const getAllPrivacypolicy = async (req, res) => {
    try {
        const policies = await Privacypolicy.getAllPrivacypolicy();
        res.status(200).json({ success: true, data: policies });
    } catch (error) {
        console.error("Controller Error - getAllPrivacypolicy:", error);
        res.status(500).json({ success: false, message: "Failed to fetch privacy policies." });
    }
};

module.exports = {
    createPrivacypolicy,
    getAllPrivacypolicy
};
