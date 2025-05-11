const ExploreCities = require("../models/ExploreCitites");

const createExploreCity = async (req, res) => {
    try {
        const { state, city, name, properties, image_url } = req.body;

        if (!state || !city || !name || !image_url) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        await ExploreCities.createExploreCity({
            state,
            city,
            name,
            properties: properties || 0,
            image_url,
        });

        return res.status(201).json({ message: "Explore city created successfully." });
    } catch (error) {
        console.error("Controller Error - createExploreCity:", error);
        return res.status(500).json({ error: "Internal Server Error." });
    }
};

const getAllExploreCities = async (req, res) => {
    try {
        const cities = await ExploreCities.getAllExploreCities();
        return res.status(200).json({ success: true, data: cities });
    } catch (error) {
        console.error("Controller Error - getAllExploreCities:", error);
        return res.status(500).json({ error: "Failed to fetch cities." });
    }
};

const getAllStatesWithCities = async (req, res) => {
    try {
        const groupedData = await ExploreCities.getAllStatesWithCities();
        return res.status(200).json({ success: true, data: groupedData });
    } catch (error) {
        console.error("Controller Error - getAllStatesWithCities:", error);
        return res.status(500).json({ error: "Failed to group states and cities." });
    }
};

module.exports = {
    createExploreCity,
    getAllExploreCities,
    getAllStatesWithCities,
};
