const connectToDB = require("../config/db");
const sql = require("mssql");
const forbuilderModel = {
  initializeTable: async () => {
    try {
      const pool = await connectToDB();
      await pool.request().query(`
        IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'forbuilder')
        BEGIN
          CREATE TABLE forbuilder (
            id INT IDENTITY(1,1) PRIMARY KEY,
            companyName NVARCHAR(255) NOT NULL,
            contactPerson NVARCHAR(255) NOT NULL,
            email NVARCHAR(255) NOT NULL UNIQUE,
            phone NVARCHAR(255) NOT NULL,
            projectType NVARCHAR(255) NOT NULL,
            projectLocation NVARCHAR(255) NOT NULL,
            numberOfUnits INT NOT NULL,
            priceRange NVARCHAR(255) NOT NULL,
            message NVARCHAR(MAX) NOT NULL
          )
           
        END
      `);
      console.log("✅ forbuilder table initialized.");
    } catch (error) {
      console.error("❌ Error initializing table:", error);
    }
  },
  getAllProfiles: async () => {
    try {
      const pool = await connectToDB();
      const result = await pool.request().query("SELECT * FROM forbuilder");
      return result.recordset;
    } catch (error) {
      console.error("❌ Error fetching forbuilder:", error);
      throw error;
    }
  },
  getProfileById: async (id) => {
    try {
      const pool = await connectToDB();
      const result = await pool
        .request()
        .input("id", sql.Int, id)
        .query("SELECT * FROM forbuilder WHERE id = @id");
      return result.recordset[0];
    } catch (error) {
      console.error("❌ Error fetching profile:", error);
      throw error;
    }
  },
  createProfile: async (profile) => {
    try {
      const pool = await connectToDB();
      const result = await pool
        .request()
        .input("companyName", sql.NVarChar, profile.companyName)
        .input("contactPerson", sql.NVarChar, profile.contactPerson)
        .input("email", sql.NVarChar, profile.email)
        .input("phone", sql.NVarChar, profile.phone)
        .input("projectType", sql.NVarChar, profile.projectType)
        .input("projectLocation", sql.NVarChar, profile.projectLocation)
        .input("numberOfUnits", sql.Int, profile.numberOfUnits)
        .input("priceRange", sql.NVarChar, profile.priceRange)
        .input("message", sql.NVarChar, profile.message)
        .query(`
          INSERT INTO forbuilder (companyName, contactPerson, email, phone, projectType, projectLocation, numberOfUnits, priceRange, message)
          VALUES (@companyName, @contactPerson, @email, @phone, @projectType, @projectLocation, @numberOfUnits, @priceRange, @message);
          SELECT SCOPE_IDENTITY() AS id;
        `);
  
      return { id: result.recordset[0].id }; // Return the inserted ID
    } catch (error) {
      console.error("❌ Error creating profile:", error);
      throw error;
    }
  },
  };
module.exports = forbuilderModel;