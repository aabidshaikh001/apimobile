const BusinessAssociateModel = require("../models/BusinessAssociateModel.js")
const BusinessAssociateModelController = {
  async createProfile(req, res) {
    try {
      const profile = req.body;
      const result = await BusinessAssociateModel.createProfile(profile);
      res.json(result);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async deleteProfile(req, res) {
    try {
      const id = req.params.id;
      const result = await BusinessAssociateModel.deleteProfile(id);
      res.json(result);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async getAllProfiles(req, res) {
    try {
      const profiles = await BusinessAssociateModel.getAllProfiles();
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
    async getProfileById(req, res) {
        try {
        const id = req.params.id;
        const profile = await BusinessAssociateModel.getProfileById(id);
        res.json(profile);
        } catch (error) {
        res.status(500).send(error);
        }
    },
};
module.exports = BusinessAssociateModelController;