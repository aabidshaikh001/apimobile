const PropertyLeads = require("../models/PropertyLeads");

exports.createLead = async (req, res) => {
  const result = await PropertyLeads.insertLead(req.body);
  if (result.success) {
    res.status(201).json({ success: true, message: "Lead submitted successfully." });
  } else {
    res.status(500).json({ success: false, error: result.error });
  }
};

exports.getLeads = async (req, res) => {
  const { propertyId } = req.params;
  const leads = await PropertyLeads.getLeadsByProperty(propertyId);
  res.status(200).json({ success: true, data: leads });
};

exports.deleteLead = async (req, res) => {
  const { id } = req.params;
  const result = await PropertyLeads.deleteLead(id);
  if (result.success) {
    res.status(200).json({ success: true, message: "Lead deleted successfully." });
  } else {
    res.status(500).json({ success: false, error: result.error });
  }
};
