
const connectToDB = require("../config/db");
const sql = require("mssql");


const BuilderDetails = {
    createTable: async () => {
        try {
            const pool = await connectToDB();
            const query = `
                IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'MBBuilderDetails')
                BEGIN
                    CREATE TABLE MBBuilderDetails (
                        id INT IDENTITY(1,1) PRIMARY KEY,
                        propertyId VARCHAR(50) NOT NULL UNIQUE,
                        name NVARCHAR(255),
                        established NVARCHAR(50),
                        logo NVARCHAR(255),
                        overview NVARCHAR(MAX),
                        experience NVARCHAR(MAX),
                        certifications NVARCHAR(MAX),
                        projects NVARCHAR(MAX), -- Storing JSON string
                        FOREIGN KEY (propertyId) REFERENCES MBProperties(id) ON DELETE CASCADE
                    );
                END;
            `;
            await pool.request().query(query);
            console.log("BuilderDetails table created or already exists.");
        } catch (error) {
            console.error("Error creating BuilderDetails table:", error);
        }
    },

    upsertBuilderDetails: async (builderDetails) => {
        try {
            const pool = await connectToDB();
            const query = `
                MERGE INTO MBBuilderDetails AS target
                USING (SELECT @propertyId AS propertyId) AS source
                ON target.propertyId = source.propertyId
                WHEN MATCHED THEN 
                    UPDATE SET 
                        name = @name, 
                        established = @established, 
                        logo = @logo, 
                        overview = @overview, 
                        experience = @experience, 
                        certifications = @certifications, 
                        projects = @projects
                WHEN NOT MATCHED THEN 
                    INSERT (propertyId, name, established, logo, overview, experience, certifications, projects) 
                    VALUES (@propertyId, @name, @established, @logo, @overview, @experience, @certifications, @projects);
            `;

            await pool.request()
                .input("propertyId", sql.VarChar(50), builderDetails.propertyId)
                .input("name", sql.NVarChar(255), builderDetails.name)
                .input("established", sql.NVarChar(50), builderDetails.established)
                .input("logo", sql.NVarChar(255), builderDetails.logo)
                .input("overview", sql.NVarChar(sql.MAX), builderDetails.overview)
                .input("experience", sql.NVarChar(sql.MAX), builderDetails.experience)
                .input("certifications", sql.NVarChar(sql.MAX), builderDetails.certifications)
                .input("projects", sql.NVarChar(sql.MAX), JSON.stringify(builderDetails.projects)) // Convert projects array to JSON string
                .query(query);

            console.log("Builder details added or updated successfully.");
        } catch (error) {
            console.error("Error upserting builder details:", error);
        }
    },

    getBuilderDetailsByPropertyId: async (propertyId) => {
        try {
            const pool = await connectToDB();
            const query = "SELECT * FROM MBBuilderDetails WHERE propertyId = @propertyId";
            const result = await pool.request()
                .input("propertyId", sql.VarChar(50), propertyId)
                .query(query);

            if (result.recordset.length > 0) {
                const builderDetails = result.recordset[0];
                builderDetails.projects = JSON.parse(builderDetails.projects || "[]"); // Convert JSON string to object
                return builderDetails;
            }

            return null;
        } catch (error) {
            console.error("Error fetching builder details:", error);
            return null;
        }
    },
    getAllBuilderDetails: async () => {
        try {
          const pool = await connectToDB();
          const query = "SELECT * FROM MBBuilderDetails";
          const result = await pool.request().query(query);
      
          return result.recordset.map(builder => ({
            ...builder,
            projects: JSON.parse(builder.projects || "[]"),
          }));
        } catch (error) {
          console.error("Error fetching all builder details:", error);
          return [];
        }
      },
      
    deleteBuilderDetailsByPropertyId: async (propertyId) => {
        try {
            const pool = await connectToDB();
            const query = "DELETE FROM MBBuilderDetails WHERE propertyId = @propertyId";
            await pool.request()
                .input("propertyId", sql.VarChar(50), propertyId)
                .query(query);
            console.log("Builder details deleted successfully.");
        } catch (error) {
            console.error("Error deleting builder details:", error);
        }
    },
   
};

module.exports = BuilderDetails;
