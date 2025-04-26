const Faqmodel = require("../models/faqmodel");

// Controller to create bulk FAQ entries
const createFaqs = async (req, res) => {
    try {
        const faqData = req.body;  // Expecting { category: "Overview", items: [...] }

        // Validate the input data
        if (!faqData || !faqData.category || !Array.isArray(faqData.items)) {
            return res.status(400).json({ message: "Invalid data format" });
        }

        // Use the createBulk method from the faqmodel to insert data into the database
        await Faqmodel.createBulk([faqData]);  // Passing an array since createBulk expects an array of categories

        res.status(201).json({ message: "FAQ created successfully!" });
    } catch (error) {
        console.error("Error creating FAQ:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Controller to get all FAQ entries grouped by category
const getFaqs = async (req, res) => {
    try {
        const faqData = await Faqmodel.getAll();
        res.status(200).json({ faqData });
    } catch (error) {
        console.error("Error fetching FAQs:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Controller to delete an FAQ entry by id
const deleteFaq = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Ensure the ID is provided and valid
        if (!id || isNaN(id)) {
            return res.status(400).json({ message: "Invalid FAQ ID" });
        }
        
        // Delete the FAQ entry
        await Faqmodel.delete(id);
        res.status(200).json({ message: "FAQ deleted successfully" });
    } catch (error) {
        console.error("Error deleting FAQ:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    createFaqs,
    getFaqs,
    deleteFaq
};
