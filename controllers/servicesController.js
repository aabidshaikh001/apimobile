const Services = require("../models/services");

const servicesController = {
  // GET all services
  getAllServices: async (req, res) => {
    try {
      const services = await Services.getAll();
      res.status(200).json({ success: true, data: services });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch services", error });
    }
  },

  // POST new service
  createService: async (req, res) => {
    const { serviceName, serviceData } = req.body;
    if (!serviceName || !serviceData) {
      return res.status(400).json({ success: false, message: "Missing serviceName or serviceData" });
    }

    try {
      await Services.create(serviceName, serviceData);
      res.status(201).json({ success: true, message: "Service created successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to create service", error });
    }
  },
};

module.exports = servicesController;
