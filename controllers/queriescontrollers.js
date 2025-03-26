import Quries from "../models/Quries.js";

export const createQuries = async (req, res) => {
    const { subject, details, phone, email, category } = req.body;
    try {
        await Quries.insertQuries(subject, details, phone, email, category);
        res.status(201).json({ message: "Query created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error creating query", error });
    }
};

export const getQuriesById = async (req, res) => {
    const { id } = req.params;
    try {
        const query = await Quries.getQuriesById(id);
        if (!query) return res.status(404).json({ message: "Query not found" });
        res.status(200).json(query);
    } catch (error) {
        res.status(500).json({ message: "Error fetching query", error });
    }
};

export const getAllQuries = async (req, res) => {
    try {
        const queries = await Quries.getAllQuries();
        res.status(200).json(queries);
    } catch (error) {
        res.status(500).json({ message: "Error fetching queries", error });
    }
};

export const updateQuries = async (req, res) => {
    const { id } = req.params;
    const { subject, details, phone, email, category } = req.body;
    try {
        await Quries.updateQuries(id, subject, details, phone, email, category);
        res.status(200).json({ message: "Query updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating query", error });
    }
};

export const deleteQuries = async (req, res) => {
    const { id } = req.params;
    try {
        await Quries.deleteQuries(id);
        res.status(200).json({ message: "Query deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting query", error });
    }
};
