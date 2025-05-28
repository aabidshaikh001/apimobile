
const sql = require("mssql");
const connectToDB = require("../config/db");

const Project = {
  // Create Table
  createTable: async () => {
    try {
      const pool = await connectToDB();
      await pool.request().query(`
        IF NOT EXISTS (
          SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'REMMstProject'
        )
        CREATE TABLE REMMstProject (
          projectId INT IDENTITY(1,1) PRIMARY KEY,
          builderId INT NOT NULL,
          projectName NVARCHAR(255),
          projectDescription NVARCHAR(MAX),
          projectDetails NVARCHAR(MAX),
          location NVARCHAR(MAX),
          launchDate DATE,
          completionDate DATE,
          reraNumber NVARCHAR(50),
          priceRange NVARCHAR(50),
          areaRange NVARCHAR(MAX),
          status NVARCHAR(50),
          amenities NVARCHAR(MAX),
          coverImage NVARCHAR(255),
          galleryImages NVARCHAR(MAX),
          createdAt DATETIME DEFAULT GETDATE(),
          updatedAt DATETIME DEFAULT GETDATE(),
          FOREIGN KEY (builderId) REFERENCES REMMstBuilder(builderId) ON DELETE CASCADE
        );
      `);
      console.log("✅ REMMstProject table created");
    } catch (error) {
      console.error("❌ Error creating REMMstProject table:", error.message);
      throw error;
    }
  },

  // Create Project
  create: async (data) => {
    try {
      const pool = await connectToDB();
      const result = await pool.request()
        .input("builderId", sql.Int, data.builderId)
        .input("projectName", sql.NVarChar(255), data.projectName)
        .input("projectDescription", sql.NVarChar(sql.MAX), data.projectDescription)
        .input("projectDetails", sql.NVarChar(sql.MAX), data.projectDetails)
        .input("location", sql.NVarChar(sql.MAX), data.location)
        .input("launchDate", sql.Date, data.launchDate)
        .input("completionDate", sql.Date, data.completionDate)
        .input("reraNumber", sql.NVarChar(50), data.reraNumber)
        .input("priceRange", sql.NVarChar(50), data.priceRange)
        .input("areaRange", sql.NVarChar(sql.MAX), data.areaRange)
        .input("status", sql.NVarChar(50), data.status)
        .input("amenities", sql.NVarChar(sql.MAX), data.amenities)
        .input("coverImage", sql.NVarChar(255), data.coverImage)
        .input("galleryImages", sql.NVarChar(sql.MAX), data.galleryImages)
        .query(`
          INSERT INTO REMMstProject (
            builderId, projectName, projectDescription, projectDetails,
            location, launchDate, completionDate, reraNumber, priceRange,
            areaRange, status, amenities, coverImage, galleryImages
          )
          OUTPUT INSERTED.projectId
          VALUES (
            @builderId, @projectName, @projectDescription, @projectDetails,
            @location, @launchDate, @completionDate, @reraNumber, @priceRange,
            @areaRange, @status, @amenities, @coverImage, @galleryImages
          )
        `);
      return result.recordset[0].projectId;
    } catch (error) {
      console.error("❌ Error creating project:", error.message);
      throw error;
    }
  },

  // Update Project
  update: async (projectId, data) => {
    try {
      const pool = await connectToDB();
      await pool.request()
        .input("projectId", sql.Int, projectId)
        .input("projectName", sql.NVarChar(255), data.projectName)
        .input("projectDescription", sql.NVarChar(sql.MAX), data.projectDescription)
        .input("projectDetails", sql.NVarChar(sql.MAX), data.projectDetails)
        .input("location", sql.NVarChar(sql.MAX), data.location)
        .input("launchDate", sql.Date, data.launchDate)
        .input("completionDate", sql.Date, data.completionDate)
        .input("reraNumber", sql.NVarChar(50), data.reraNumber)
        .input("priceRange", sql.NVarChar(50), data.priceRange)
        .input("areaRange", sql.NVarChar(sql.MAX), data.areaRange)
        .input("status", sql.NVarChar(50), data.status)
        .input("amenities", sql.NVarChar(sql.MAX), data.amenities)
        .input("coverImage", sql.NVarChar(255), data.coverImage)
        .input("galleryImages", sql.NVarChar(sql.MAX), data.galleryImages)
        .query(`
          UPDATE REMMstProject SET
            projectName = @projectName,
            projectDescription = @projectDescription,
            projectDetails = @projectDetails,
            location = @location,
            launchDate = @launchDate,
            completionDate = @completionDate,
            reraNumber = @reraNumber,
            priceRange = @priceRange,
            areaRange = @areaRange,
            status = @status,
            amenities = @amenities,
            coverImage = @coverImage,
            galleryImages = @galleryImages,
            updatedAt = GETDATE()
          WHERE projectId = @projectId
        `);
      return true;
    } catch (error) {
      console.error("❌ Error updating project:", error.message);
      throw error;
    }
  },

  // Delete project
  delete: async (projectId) => {
    try {
      const pool = await connectToDB();
      await pool.request()
        .input("projectId", sql.Int, projectId)
        .query(`
          DELETE FROM REMMstProject 
          WHERE projectId = @projectId
        `);
      return true;
    } catch (error) {
      console.error("❌ Error deleting project:", error.message);
      throw error;
    }
  },

  // Get all projects for a builder
  getByBuilderId: async (builderId) => {
    try {
      const pool = await connectToDB();
      const result = await pool.request()
        .input("builderId", sql.Int, builderId)
        .query(`
          SELECT p.*, b.name as builderName
          FROM REMMstProject p
          JOIN REMMstBuilder b ON p.builderId = b.builderId
          WHERE p.builderId = @builderId
          ORDER BY p.projectName
        `);
      return result.recordset;
    } catch (error) {
      console.error("❌ Error getting projects by builder:", error.message);
      throw error;
    }
  },

  // Get project with properties
  getWithProperties: async (projectId) => {
    try {
      const pool = await connectToDB();
      const result = await pool.request()
        .input("projectId", sql.Int, projectId)
        .query(`
          SELECT 
            p.*,
            b.name as builderName,
            prop.propertyId,
            prop.title,
            prop.location,
            prop.price,
            prop.propertyType,
            prop.status
          FROM REMMstProject p
          JOIN REMMstBuilder b ON p.builderId = b.builderId
          LEFT JOIN REMMstProperties prop ON p.projectId = prop.projectId
          WHERE p.projectId = @projectId
        `);
      
      if (result.recordset.length === 0) return null;
      
      const project = {
        ...result.recordset[0],
        properties: []
      };

      result.recordset.forEach(row => {
        if (row.propertyId) {
          project.properties.push({
            propertyId: row.propertyId,
            title: row.title,
            location: row.location,
            price: row.price,
            propertyType: row.propertyType,
            status: row.status
          });
        }
      });

      return project;
    } catch (error) {
      console.error("❌ Error getting project with properties:", error.message);
      throw error;
    }
  },
  // Get project by projectId
getById: async (projectId) => {
  try {
    const pool = await connectToDB();
    const result = await pool.request()
      .input("projectId", sql.Int, projectId)
      .query(`
        SELECT * FROM REMMstProject
        WHERE projectId = @projectId
      `);
    return result.recordset[0] || null;
  } catch (error) {
    console.error("❌ Error getting project by ID:", error.message);
    throw error;
  }
}

};

module.exports = Project;