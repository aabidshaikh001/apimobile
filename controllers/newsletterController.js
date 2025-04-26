const Newsletter = require("../models/newsletter");

// Subscribe a user to the newsletter
const subscribeNewsletter = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  try {
    await Newsletter.insertNewsletter(email);
    res.status(201).json({ success: true, message: "Subscribed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error subscribing", error: error.message });
  }
};

// Get all newsletter subscriptions
const getAllNewsletters = async (req, res) => {
  try {
    const emails = await Newsletter.getAllEmails();
    res.status(200).json({ success: true, data: emails });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching emails", error: error.message });
  }
};

module.exports = {
  subscribeNewsletter,
  getAllNewsletters,
};
