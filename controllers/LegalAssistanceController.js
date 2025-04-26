const LegalAssistanceModel = require("../models/LegalAssistanceModel.js");

exports.createLegalAssistance = async (req, res) => {
    try {
        const newLegalAssistanceId = await LegalAssistanceModel.create(req.body);
        res.status(201).json({ message: "Legal Assistance created successfully", id: newLegalAssistanceId });
    } catch (error) {
        res.status(500).json({ message: "Error creating Legal Assistance", error: error.message });
    }
}
exports.getAllLegalAssistance = async (req, res) => {
    try {
        const legalAssistance = await LegalAssistanceModel.getAll();
        res.json(legalAssistance);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving Legal Assistance", error: error.message });
    }
}
