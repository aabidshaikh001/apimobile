const connectToDB = require("../config/db");
const sql = require("mssql");

const PropertyLeads = {
  createTable: async () => {
    try {
      const pool = await connectToDB();
      const query = `
        IF NOT EXISTS (
          SELECT * FROM INFORMATION_SCHEMA.TABLES 
          WHERE TABLE_NAME = 'PropertyLeads'
        )
        CREATE TABLE PropertyLeads (
          id INT PRIMARY KEY IDENTITY(1,1),
          propertyId VARCHAR(50) NOT NULL,
          name NVARCHAR(255),
          email NVARCHAR(255),
          phone NVARCHAR(50),
          message NVARCHAR(MAX),
          submittedAt DATETIME DEFAULT GETDATE()
        )
      `;
      await pool.request().query(query);
      console.log("✅ PropertyLeads table created or already exists.");
    } catch (error) {
      console.error("❌ Error creating PropertyLeads table:", error);
    }
  },

  insertLead: async (data) => {
    const { propertyId, name, email, phone, message } = data;
    try {
      const pool = await connectToDB();
      await pool.request()
        .input("propertyId", sql.VarChar(50), propertyId)
        .input("name", sql.NVarChar(255), name)
        .input("email", sql.NVarChar(255), email)
        .input("phone", sql.NVarChar(50), phone)
        .input("message", sql.NVarChar(sql.MAX), message)
        .query(`
          INSERT INTO PropertyLeads (propertyId, name, email, phone, message)
          VALUES (@propertyId, @name, @email, @phone, @message)
        `);
      return { success: true };
    } catch (error) {
      console.error("❌ Insert Lead Error:", error);
      return { success: false, error };
    }
  },

  getLeadsByProperty: async (propertyId) => {
    try {
      const pool = await connectToDB();
      const result = await pool.request()
        .input("propertyId", sql.VarChar(50), propertyId)
        .query("SELECT * FROM PropertyLeads WHERE propertyId = @propertyId ORDER BY submittedAt DESC");
      return result.recordset;
    } catch (error) {
      console.error("❌ Get Leads Error:", error);
      return [];
    }
  },

  deleteLead: async (id) => {
    try {
      const pool = await connectToDB();
      await pool.request()
        .input("id", sql.Int, id)
        .query("DELETE FROM PropertyLeads WHERE id = @id");
      return { success: true };
    } catch (error) {
      console.error("❌ Delete Lead Error:", error);
      return { success: false, error };
    }
  }
};

module.exports = PropertyLeads;
