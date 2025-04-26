const sql = require("mssql");
const connectToDB = require("../config/db");

const AboutProject = {
  createTable: async () => {
    try {
      const pool = await connectToDB();
      await pool.request().query(`
        IF NOT EXISTS (
          SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'AboutProject'
        )
        CREATE TABLE AboutProject (
          propertyId VARCHAR(50) PRIMARY KEY,
          projectName NVARCHAR(255),
          projectDescription NVARCHAR(MAX),
          projectDetails NVARCHAR(MAX),
          FOREIGN KEY (propertyId) REFERENCES MBProperties(id) ON DELETE CASCADE
        );
      `);
      console.log("✅ AboutProject table ensured.");
    } catch (error) {
      console.error("❌ Error creating AboutProject table:", error.message);
    }
  },

  async create({ propertyId, projectName, projectDescription, projectDetails }) {
    try {
      const pool = await connectToDB();
      const result = await pool.request()
        .input("propertyId", sql.VarChar(50), propertyId)
        .input("projectName", sql.NVarChar(255), projectName)
        .input("projectDescription", sql.NVarChar(sql.MAX), projectDescription)
        .input("projectDetails", sql.NVarChar(sql.MAX), projectDetails)
        .query(`
          INSERT INTO AboutProject (propertyId, projectName, projectDescription, projectDetails)
          VALUES (@propertyId, @projectName, @projectDescription, @projectDetails)
        `);
      return result;
    } catch (error) {
      console.error("❌ Error inserting project data:", error.message);
      throw error;
    }
  },

  async getByPropertyId(propertyId) {
    try {
      const pool = await connectToDB();
      const result = await pool.request()
        .input("propertyId", sql.VarChar(50), propertyId)
        .query(`SELECT * FROM AboutProject WHERE propertyId = @propertyId`);
      return result.recordset[0];
    } catch (error) {
      console.error("❌ Error fetching project data:", error.message);
      throw error;
    }
  },

  async update(propertyId, data) {
    try {
      const pool = await connectToDB();
      const result = await pool.request()
        .input("propertyId", sql.VarChar(50), propertyId)
        .input("projectName", sql.NVarChar(255), data.projectName)
        .input("projectDescription", sql.NVarChar(sql.MAX), data.projectDescription)
        .input("projectDetails", sql.NVarChar(sql.MAX), data.projectDetails)
        .query(`
          UPDATE AboutProject SET
            projectName = @projectName,
            projectDescription = @projectDescription,
            projectDetails = @projectDetails
          WHERE propertyId = @propertyId
        `);
      return result;
    } catch (error) {
      console.error("❌ Error updating project data:", error.message);
      throw error;
    }
  }
};

module.exports = AboutProject;
