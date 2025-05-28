const sql = require("mssql");
const connectToDB = require("../config/db");

const Builder = {
  // Create Table
  createTable: async () => {
    try {
      const pool = await connectToDB();
      await pool.request().query(`
        IF NOT EXISTS (
          SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'REMMstBuilder'
        )
        CREATE TABLE REMMstBuilder (
          builderId INT IDENTITY(1,1) PRIMARY KEY,
          name NVARCHAR(255) NOT NULL,
          established NVARCHAR(50),
          logo NVARCHAR(255),
          overview NVARCHAR(MAX),
          experience NVARCHAR(MAX),
          certifications NVARCHAR(MAX),
          headOffice NVARCHAR(MAX),
          contactEmail NVARCHAR(50),
          contactPhone NVARCHAR(MAX),
          website NVARCHAR(50),
          socialLinks NVARCHAR(MAX),
          status NVARCHAR(10),
          createdAt DATETIME2(7) DEFAULT SYSUTCDATETIME(),
          updatedAt DATETIME2(7) DEFAULT SYSUTCDATETIME()
        );
      `);
      console.log("✅ REMMstBuilder table created");
    } catch (error) {
      console.error("❌ Error creating REMMstBuilder table:", error.message);
      throw error;
    }
  },

  // Create builder
  create: async (builderData) => {
    try {
      const pool = await connectToDB();
      const result = await pool.request()
        .input("name", sql.NVarChar(255), builderData.name)
        .input("established", sql.NVarChar(50), builderData.established)
        .input("logo", sql.NVarChar(255), builderData.logo)
        .input("overview", sql.NVarChar(sql.MAX), builderData.overview)
        .input("experience", sql.NVarChar(sql.MAX), builderData.experience)
        .input("certifications", sql.NVarChar(sql.MAX), builderData.certifications)
        .input("headOffice", sql.NVarChar(sql.MAX), builderData.headOffice)
        .input("contactEmail", sql.NVarChar(50), builderData.contactEmail)
        .input("contactPhone", sql.NVarChar(sql.MAX), builderData.contactPhone)
        .input("website", sql.NVarChar(50), builderData.website)
        .input("socialLinks", sql.NVarChar(sql.MAX), builderData.socialLinks)
        .input("status", sql.NVarChar(10), builderData.status)
        .query(`
          INSERT INTO REMMstBuilder (
            name, established, logo, overview, experience, certifications,
            headOffice, contactEmail, contactPhone, website, socialLinks, status
          )
          OUTPUT INSERTED.builderId
          VALUES (
            @name, @established, @logo, @overview, @experience, @certifications,
            @headOffice, @contactEmail, @contactPhone, @website, @socialLinks, @status
          )
        `);
      return result.recordset[0].builderId;
    } catch (error) {
      console.error("❌ Error creating builder:", error.message);
      throw error;
    }
  },

  // Get builder by ID
  getById: async (builderId) => {
    try {
      const pool = await connectToDB();
      const result = await pool.request()
        .input("builderId", sql.Int, builderId)
        .query(`SELECT * FROM REMMstBuilder WHERE builderId = @builderId`);
      return result.recordset[0];
    } catch (error) {
      console.error("❌ Error fetching builder by ID:", error.message);
      throw error;
    }
  },

  // Update builder
  update: async (builderId, builderData) => {
    try {
      const pool = await connectToDB();
      await pool.request()
        .input("builderId", sql.Int, builderId)
        .input("name", sql.NVarChar(255), builderData.name)
        .input("established", sql.NVarChar(50), builderData.established)
        .input("logo", sql.NVarChar(255), builderData.logo)
        .input("overview", sql.NVarChar(sql.MAX), builderData.overview)
        .input("experience", sql.NVarChar(sql.MAX), builderData.experience)
        .input("certifications", sql.NVarChar(sql.MAX), builderData.certifications)
        .input("headOffice", sql.NVarChar(sql.MAX), builderData.headOffice)
        .input("contactEmail", sql.NVarChar(50), builderData.contactEmail)
        .input("contactPhone", sql.NVarChar(sql.MAX), builderData.contactPhone)
        .input("website", sql.NVarChar(50), builderData.website)
        .input("socialLinks", sql.NVarChar(sql.MAX), builderData.socialLinks)
        .input("status", sql.NVarChar(10), builderData.status)
        .query(`
          UPDATE REMMstBuilder SET
            name = @name,
            established = @established,
            logo = @logo,
            overview = @overview,
            experience = @experience,
            certifications = @certifications,
            headOffice = @headOffice,
            contactEmail = @contactEmail,
            contactPhone = @contactPhone,
            website = @website,
            socialLinks = @socialLinks,
            status = @status,
            updatedAt = SYSUTCDATETIME()
          WHERE builderId = @builderId
        `);
      return true;
    } catch (error) {
      console.error("❌ Error updating builder:", error.message);
      throw error;
    }
  },

  // Delete builder
  delete: async (builderId) => {
    try {
      const pool = await connectToDB();
      await pool.request()
        .input("builderId", sql.Int, builderId)
        .query(`DELETE FROM REMMstBuilder WHERE builderId = @builderId`);
      return true;
    } catch (error) {
      console.error("❌ Error deleting builder:", error.message);
      throw error;
    }
  },

  // Get all builders
  getAll: async () => {
    try {
      const pool = await connectToDB();
      const result = await pool.request().query(`SELECT * FROM REMMstBuilder ORDER BY name`);
      return result.recordset;
    } catch (error) {
      console.error("❌ Error fetching all builders:", error.message);
      throw error;
    }
  }
};

module.exports = Builder;
