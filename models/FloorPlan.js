const connectToDB = require("../config/db");
const sql = require("mssql");

const FloorPlan = {
  createTable: async () => {
    try {
      const pool = await connectToDB();
      const query = `
        IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'REMMstPropFloorPlan')
        BEGIN
          CREATE TABLE REMMstPropFloorPlan (
            id INT IDENTITY(1,1) PRIMARY KEY,
            propertyId VARCHAR(50) NOT NULL,
            name NVARCHAR(255),
            image NVARCHAR(255),
            area NVARCHAR(50),
            bedrooms INT,
            bathrooms INT,
            FOREIGN KEY (propertyId) REFERENCES REMMstProperties(id) ON DELETE CASCADE
          );
        END;
      `;
      await pool.request().query(query);
      console.log("REMMstPropFloorPlan table created or already exists.");
    } catch (error) {
      console.error("Error creating REMMstPropFloorPlan table:", error);
    }
  },

  addFloorPlan: async (floorPlan) => {
    try {
      const pool = await connectToDB();
      const query = `
        INSERT INTO REMMstPropFloorPlan (propertyId, name, image, area, bedrooms, bathrooms)
        VALUES (@propertyId, @name, @image, @area, @bedrooms, @bathrooms);
      `;
      await pool.request()
        .input("propertyId", sql.VarChar(50), floorPlan.propertyId)
        .input("name", sql.NVarChar(255), floorPlan.name)
        .input("image", sql.NVarChar(255), floorPlan.image)
        .input("area", sql.NVarChar(50), floorPlan.area)
        .input("bedrooms", sql.Int, floorPlan.bedrooms)
        .input("bathrooms", sql.Int, floorPlan.bathrooms)
        .query(query);
    } catch (error) {
      console.error("Error adding floor plan:", error);
    }
  },

  getFloorPlansByPropertyId: async (propertyId) => {
    try {
      const pool = await connectToDB();
      const query = `SELECT * FROM REMMstPropFloorPlan WHERE propertyId = @propertyId`;
      const result = await pool.request()
        .input("propertyId", sql.VarChar(50), propertyId)
        .query(query);
      return result.recordset;
    } catch (error) {
      console.error("Error getting floor plans:", error);
      return [];
    }
  },

  deleteFloorPlansByPropertyId: async (propertyId) => {
    try {
      const pool = await connectToDB();
      const query = `DELETE FROM REMMstPropFloorPlan WHERE propertyId = @propertyId`;
      await pool.request()
        .input("propertyId", sql.VarChar(50), propertyId)
        .query(query);
    } catch (error) {
      console.error("Error deleting floor plans:", error);
    }
  }
};

module.exports = FloorPlan;
