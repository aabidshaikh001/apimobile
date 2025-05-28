const Project = require("../models/AboutProject");

const projectController = {
  createProject: async (req, res) => {
    try {
      const projectId = await Project.create(req.body);
      res.status(201).json({ success: true, projectId });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getProjectById: async (req, res) => {
    try {
      const project = await Project.getById(parseInt(req.params.id));
      if (!project) {
        return res.status(404).json({ success: false, message: "Project not found" });
      }
      res.json({ success: true, data: project });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  updateProject: async (req, res) => {
    try {
      const success = await Project.update(parseInt(req.params.id), req.body);
      res.json({ success });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  deleteProject: async (req, res) => {
    try {
      const success = await Project.delete(parseInt(req.params.id));
      res.json({ success });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getProjectsByBuilder: async (req, res) => {
    try {
      const projects = await Project.getByBuilderId(parseInt(req.params.builderId));
      res.json({ success: true, data: projects });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getProjectWithProperties: async (req, res) => {
    try {
      const project = await Project.getWithProperties(parseInt(req.params.id));
      if (!project) {
        return res.status(404).json({ success: false, message: "Project not found" });
      }
      res.json({ success: true, data: project });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = projectController;
