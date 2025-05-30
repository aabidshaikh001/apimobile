const connectToDB = require("../config/db");
const sql = require("mssql");

const Yotubevideo = {
  // Create table if not exists
  createTable: async () => {
    try {
      const pool = await connectToDB();
      await pool.request().query(`
        IF NOT EXISTS (
          SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'REMMstPropVideo'
        )
        CREATE TABLE REMMstPropVideo (
          id INT PRIMARY KEY IDENTITY(1,1),
          propertyId VARCHAR(50) NOT NULL UNIQUE,
          video NVARCHAR(MAX),
          FOREIGN KEY (propertyId) REFERENCES REMMstProperties(PropertyId) ON DELETE CASCADE
        )
      `);
      console.log("✅ REMMstPropVideo table created or already exists.");
    } catch (error) {
      console.error("❌ Error creating REMMstPropVideo table:", error);
    }
  },

  // Get video by propertyId
  getByPropertyId: async (propertyId) => {
    const pool = await connectToDB();
    const result = await pool
      .request()
      .input("propertyId", sql.VarChar(50), propertyId)
      .query("SELECT video FROM REMMstPropVideo WHERE propertyId = @propertyId");
    return result.recordset[0];
  },

  // Insert or update video
  upsert: async (propertyId, video) => {
    const pool = await connectToDB();
    const check = await pool
      .request()
      .input("propertyId", sql.VarChar(50), propertyId)
      .query("SELECT COUNT(*) AS count FROM REMMstPropVideo WHERE propertyId = @propertyId");

    if (check.recordset[0].count > 0) {
      await pool
        .request()
        .input("propertyId", sql.VarChar(50), propertyId)
        .input("video", sql.NVarChar(sql.MAX), video)
        .query("UPDATE REMMstPropVideo SET video = @video WHERE propertyId = @propertyId");
    } else {
      await pool
        .request()
        .input("propertyId", sql.VarChar(50), propertyId)
        .input("video", sql.NVarChar(sql.MAX), video)
        .query("INSERT INTO REMMstPropVideo (propertyId, video) VALUES (@propertyId, @video)");
    }
  },

  // Delete video by propertyId
  deleteByPropertyId: async (propertyId) => {
    const pool = await connectToDB();
    await pool
      .request()
      .input("propertyId", sql.VarChar(50), propertyId)
      .query("DELETE FROM REMMstPropVideo WHERE propertyId = @propertyId");
  },
};

module.exports = Yotubevideo;
