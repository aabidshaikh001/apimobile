const ContactModel = require("../models/contactModel.js")

exports.createContact = async (req, res) => {
    try {
        const newContactId = await ContactModel.create(req.body);
        res.status(201).json({ message: "Contact created successfully", id: newContactId });
    } catch (error) {
        res.status(500).json({ message: "Error creating contact", error: error.message });
    }
    };
    exports.getAllContacts = async (req, res) => {
    try {
        const contacts = await ContactModel.getAll();
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving contacts", error: error.message });
    }
    }