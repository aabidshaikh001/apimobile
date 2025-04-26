const forbuilderModel = require("../models/for-builderModel.js")
exports.getAllProfiles = async (req, res) => {
    try {
        const profiles = await forbuilderModel.getAllProfiles();
        res.status(200).json(profiles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    }
exports.getProfileById = async (req, res) => {
    try {
        const { id } = req.params;
        const profile = await forbuilderModel.getProfileById(id);
        if (!profile) {
            return res.status(404).json({ message: `Profile with id ${id} not found` });
        }
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    }

exports.createProfile = async (req, res) => {
    try {
        const profile = req.body;
        const result = await forbuilderModel.createProfile(profile);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    }
