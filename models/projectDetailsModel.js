const sql = require("mssql");
const dbConfig = require("../config/db");

const ProjectDetails = {
  createTable: async () => {
    try {
      const pool = await sql.connect(dbConfig);
      await pool.request().query(`
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ProjectDetails' AND xtype='U')
        CREATE TABLE ProjectDetails (
          propertyId VARCHAR(50) PRIMARY KEY,
          projectDetailLabel NVARCHAR(MAX),
          projectDetailValue NVARCHAR(MAX),
          FOREIGN KEY (propertyId) REFERENCES REMMstProperties(PropertyId) ON DELETE CASCADE
        )
      `);
      console.log("✅ ProjectDetails table checked/created successfully.");
    } catch (error) {
      console.error("❌ Error creating ProjectDetails table:", error);
    }
  },

  create: async ({ propertyId, projectDetailLabel, projectDetailValue }) => {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input("propertyId", sql.VarChar(50), propertyId)
      .input("projectDetailLabel", sql.NVarChar(sql.MAX), JSON.stringify(projectDetailLabel))
      .input("projectDetailValue", sql.NVarChar(sql.MAX), JSON.stringify(projectDetailValue))
      .query(`
        INSERT INTO ProjectDetails (propertyId, projectDetailLabel, projectDetailValue)
        VALUES (@propertyId, @projectDetailLabel, @projectDetailValue)
      `);
    return result;
  },

  getByPropertyId: async (propertyId) => {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input("propertyId", sql.VarChar(50), propertyId)
      .query("SELECT * FROM ProjectDetails WHERE propertyId = @propertyId");
    return result.recordset[0];
  },

  updateByPropertyId: async ({ propertyId, projectDetailLabel, projectDetailValue }) => {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input("propertyId", sql.VarChar(50), propertyId)
      .input("projectDetailLabel", sql.NVarChar(sql.MAX), JSON.stringify(projectDetailLabel))
      .input("projectDetailValue", sql.NVarChar(sql.MAX), JSON.stringify(projectDetailValue))
      .query(`
        UPDATE ProjectDetails
        SET projectDetailLabel = @projectDetailLabel,
            projectDetailValue = @projectDetailValue
        WHERE propertyId = @propertyId
      `);
    return result;
  },
};

module.exports = ProjectDetails;
