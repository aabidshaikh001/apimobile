const sql = require("mssql");
const connectToDB = require("../config/db");

const AboutDeveloper = {
  createTable: async () => {
    try {
      const pool = await connectToDB();
      await pool.request().query(`
        IF NOT EXISTS (
          SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'AboutDeveloper'
        )
        CREATE TABLE AboutDeveloper (
          propertyId VARCHAR(50) PRIMARY KEY,
          developerName NVARCHAR(255),
          developerDescription NVARCHAR(MAX),
          developerAwards NVARCHAR(MAX),
          developerImage NVARCHAR(255),
          FOREIGN KEY (propertyId) REFERENCES REMMstProperties(PropertyId) ON DELETE CASCADE
        );
      `);
      console.log("✅ AboutDeveloper table ensured.");
    } catch (error) {
      console.error("❌ Error creating AboutDeveloper table:", error.message);
    }
  },

  async create({ propertyId, developerName, developerDescription, developerAwards, developerImage }) {
    try {
      const pool = await connectToDB();
      const result = await pool.request()
        .input("propertyId", sql.VarChar(50), propertyId)
        .input("developerName", sql.NVarChar(255), developerName)
        .input("developerDescription", sql.NVarChar(sql.MAX), developerDescription)
        .input("developerAwards", sql.NVarChar(sql.MAX), JSON.stringify(developerAwards || []))
        .input("developerImage", sql.NVarChar(255), developerImage)
        .query(`
          INSERT INTO AboutDeveloper (
            propertyId, developerName, developerDescription, developerAwards, developerImage
          ) VALUES (
            @propertyId, @developerName, @developerDescription, @developerAwards, @developerImage
          )
        `);
      return result;
    } catch (error) {
      console.error("❌ Error inserting developer data:", error.message);
      throw error;
    }
  },

  async getByPropertyId(propertyId) {
    try {
      const pool = await connectToDB();
      const result = await pool.request()
        .input("propertyId", sql.VarChar(50), propertyId)
        .query(`SELECT * FROM AboutDeveloper WHERE propertyId = @propertyId`);
      return result.recordset[0];
    } catch (error) {
      console.error("❌ Error fetching developer data:", error.message);
      throw error;
    }
  },

  async update(propertyId, data) {
    try {
      const pool = await connectToDB();
      const result = await pool.request()
        .input("propertyId", sql.VarChar(50), propertyId)
        .input("developerName", sql.NVarChar(255), data.developerName)
        .input("developerDescription", sql.NVarChar(sql.MAX), data.developerDescription)
        .input("developerAwards", sql.NVarChar(sql.MAX), JSON.stringify(data.developerAwards || []))
        .input("developerImage", sql.NVarChar(255), data.developerImage)
        .query(`
          UPDATE AboutDeveloper SET
            developerName = @developerName,
            developerDescription = @developerDescription,
            developerAwards = @developerAwards,
            developerImage = @developerImage
          WHERE propertyId = @propertyId
        `);
      return result;
    } catch (error) {
      console.error("❌ Error updating developer data:", error.message);
      throw error;
    }
  }
};

module.exports = AboutDeveloper;
