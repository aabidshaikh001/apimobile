const PropertyLeads = require("../models/PropertyLeads");

exports.createLead = async (req, res) => {
  try {
    const leadData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      message: req.body.message,
      address: req.body.address,
      propertyId: req.body.propertyId,
      minBudget: req.body.minBudget,
      maxBudget: req.body.maxBudget,
      LeadSourceId: req.body.LeadSourceId || 1, // Default to 1 if not provided
      LeadTypeId: req.body.LeadTypeId || 1, // Default to 1 if not provided
       REMCategoryCode: req.body.REMCategoryCode || null, // Changed from CategoryCode
      REMPropTagCode: req.body.REMPropTagCode || null
    };
console.log("Received REMCategoryCode:", req.body.REMCategoryCode);
console.log("Received REMPropTagCode:", req.body.REMPropTagCode);
    const result = await PropertyLeads.insertLead(leadData);
    if (result.success) {
      const newLead = await PropertyLeads.getLeadById(result.leadId);
      return res.status(201).json(newLead);
    }
    throw new Error("Failed to create lead");
  } catch (error) {
    console.error("Error creating lead:", error);
    res.status(500).json({ 
      error: "Failed to create lead",
      details: error.message 
    });
  }
};
exports.getLead = async (req, res) => {
  try {
    const lead = await PropertyLeads.getLeadById(req.params.id);
    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }
    res.json(lead);
  } catch (error) {
    console.error("Error getting lead:", error);
    res.status(500).json({ 
      error: "Failed to get lead",
      details: error.message 
    });
  }
};

exports.updateLead = async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Add update transaction info
    const updateData = {
      ...req.body,
      TranByUpdate: req.user.userId // Assuming user ID comes from auth middleware
    };

    const result = await PropertyLeads.updateLead(req.params.id, updateData);
    if (result.success) {
      const updatedLead = await PropertyLeads.getLeadById(req.params.id);
      return res.json(updatedLead);
    }
    throw new Error("Failed to update lead");
  } catch (error) {
    console.error("Error updating lead:", error);
    res.status(500).json({ 
      error: "Failed to update lead",
      details: error.message 
    });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    const result = await PropertyLeads.deleteLead(
      req.params.id,
      req.user.userId // Assuming user ID comes from auth middleware
    );
    if (result.success) {
      return res.json({ message: "Lead deleted successfully" });
    }
    throw new Error("Failed to delete lead");
  } catch (error) {
    console.error("Error deleting lead:", error);
    res.status(500).json({ 
      error: "Failed to delete lead",
      details: error.message 
    });
  }
};

exports.listLeads = async (req, res) => {
  try {
    const filters = {
      statusId: req.query.statusId,
      employeeId: req.query.employeeId,
      leadTypeId: req.query.leadTypeId,
      searchTerm: req.query.search
    };

    const leads = await PropertyLeads.getAllLeads(
      req.user.orgCode, // Assuming orgCode comes from authenticated user
      filters
    );
    res.json(leads);
  } catch (error) {
    console.error("Error listing leads:", error);
    res.status(500).json({ 
      error: "Failed to list leads",
      details: error.message 
    });
  }
};