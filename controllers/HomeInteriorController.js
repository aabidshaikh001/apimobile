const HomeInteriorModel = require("../models/HomeInteriormodel.js")

exports.createHomeInterior = async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Log incoming request
        const newHomeInterior = await HomeInteriorModel.create(req.body);
        res.status(201).json({ message: "Home interior created successfully", newHomeInterior });
    } catch (error) {
        console.error("Error creating home interior:", error); // Log error
        res.status(500).json({ error: "Failed to create home interior", details: error.message });
    }
};
exports.getAllHomeInterior = async (req, res) => {
    try {
        const homeInteriors = await HomeInteriorModel.getAll();
        res.status(200).json(homeInteriors);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch home interiors" });
    } };