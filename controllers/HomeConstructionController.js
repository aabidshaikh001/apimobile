const HomeConstructionModel = require("../models/HomeConstructionmodel.js")

exports.createHomeConstruction = async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Log incoming request
        const newHomeConstruction = await HomeConstructionModel.create(req.body);
        res.status(201).json({ message: "Home construction created successfully", newHomeConstruction });
    } catch (error) {
        console.error("Error creating home construction:", error); // Log error
        res.status(500).json({ error: "Failed to create home construction", details: error.message });
    }
    };
    exports.getAllHomeConstruction = async (req, res) => {
        try {
            const homeConstructions = await HomeConstructionModel.getAll();
            res.status(200).json(homeConstructions);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch home constructions" });
        }
    }