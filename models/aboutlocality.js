const connectToDB = require("../config/db");
const sql = require("mssql");

const AboutLocality = {
  createTable: async () => {
    try {
      const pool = await connectToDB();
      await pool.request().query(`
        IF NOT EXISTS (
          SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Locality'
        )
        CREATE TABLE Locality (
          propertyId VARCHAR(50) PRIMARY KEY,
          localityDescription NVARCHAR(MAX),
          localityFeatureName NVARCHAR(MAX),
          localityFeatureDistance NVARCHAR(MAX),
            FOREIGN KEY (propertyId) REFERENCES REMMstProperties(id) ON DELETE CASCADE
        )
      `);
      console.log("✅ Locality table ensured.");
    } catch (error) {
      console.error("❌ Error creating Locality table:", error);
    }
  },

  getLocalityByPropertyId: async (propertyId) => {
    const pool = await connectToDB();
    const result = await pool
      .request()
      .input("propertyId", sql.VarChar(50), propertyId)
      .query("SELECT * FROM Locality WHERE propertyId = @propertyId");
    return result.recordset[0];
  },

  createOrUpdateLocality: async ({ propertyId, localityDescription, localityFeatureName, localityFeatureDistance }) => {
    const pool = await connectToDB();
    await pool.request()
      .input("propertyId", sql.VarChar(50), propertyId)
      .input("localityDescription", sql.NVarChar(sql.MAX), localityDescription)
      .input("localityFeatureName", sql.NVarChar(sql.MAX), localityFeatureName)
      .input("localityFeatureDistance", sql.NVarChar(sql.MAX), localityFeatureDistance)
      .query(`
        MERGE INTO Locality AS target
        USING (SELECT @propertyId AS propertyId) AS source
        ON target.propertyId = source.propertyId
        WHEN MATCHED THEN
          UPDATE SET
            localityDescription = @localityDescription,
            localityFeatureName = @localityFeatureName,
            localityFeatureDistance = @localityFeatureDistance
        WHEN NOT MATCHED THEN
          INSERT (propertyId, localityDescription, localityFeatureName, localityFeatureDistance)
          VALUES (@propertyId, @localityDescription, @localityFeatureName, @localityFeatureDistance);
      `);
  },

  deleteLocality: async (propertyId) => {
    const pool = await connectToDB();
    await pool
      .request()
      .input("propertyId", sql.VarChar(50), propertyId)
      .query("DELETE FROM Locality WHERE propertyId = @propertyId");
  }
};

module.exports = AboutLocality;
