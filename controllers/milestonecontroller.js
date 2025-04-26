const Milestone = require("../models/Milestone.js");

exports.insertMilestone = async (req, res) => {
    try {
        const { propertyId, name, condition, brokerage } = req.body;
        await Milestone.insertMilestone({ propertyId, name, condition, brokerage });
        res.status(201).json({ message: "Milestone added successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error adding milestone", details: error.message });
    }
};

exports.getMilestonesByPropertyId = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const milestones = await Milestone.getMilestonesByPropertyId(propertyId);
        res.status(200).json(milestones);
    } catch (error) {
        res.status(500).json({ error: "Error fetching milestones", details: error.message });
    }
};

exports.deleteMilestoneById = async (req, res) => {
    try {
        const { id } = req.params;
        await Milestone.deleteMilestoneById(id);
        res.status(200).json({ message: "Milestone deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting milestone", details: error.message });
    }
};

exports.deleteMilestonesByPropertyId = async (req, res) => {
    try {
        const { propertyId } = req.params;
        await Milestone.deleteMilestonesByPropertyId(propertyId);
        res.status(200).json({ message: "All milestones for property deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting milestones", details: error.message });
    }
};
