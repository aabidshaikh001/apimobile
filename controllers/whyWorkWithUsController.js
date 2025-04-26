const express = require('express');
const router = express.Router();
const WhyWorkwithus = require('../models/whyworkwithus'); // Adjust the path based on your file structure

// Route to create the table (run once)
router.post('/create-table', async (req, res) => {
    try {
        await WhyWorkwithus.createTable();
        res.status(200).send("✅ Table created or already exists.");
    } catch (error) {
        res.status(500).send(`❌ Error creating table: ${error.message}`);
    }
});

// Route to get all records
router.get('/', async (req, res) => {
    try {
        const records = await WhyWorkwithus.getAll();
        res.status(200).json(records);
    } catch (error) {
        res.status(500).send(`❌ Error fetching records: ${error.message}`);
    }
});

// Route to add or update a record
router.post('/', async (req, res) => {
    const { heading, description, cards } = req.body;

    if (!heading || !description || !cards) {
        return res.status(400).send("❌ All fields (heading, description, cards) are required.");
    }

    try {
        await WhyWorkwithus.addWhyWorkwithus(heading, description, cards);
        res.status(200).send("✅ Record added or updated successfully.");
    } catch (error) {
        res.status(500).send(`❌ Error adding/updating record: ${error.message}`);
    }
});

module.exports = router;
