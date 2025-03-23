import connectToDB from "../config/db.js";
import sql from "mssql";

const Brochures = {
    createTable: async () => {
        try {
            const pool = await connectToDB();
            const query = `
                IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'MBBrochures')
                BEGIN
                    CREATE TABLE MBBrochures (
                        id INT IDENTITY(1,1) PRIMARY KEY,
                        propertyId VARCHAR(50) NOT NULL UNIQUE,
                        title NVARCHAR(255),
                        logo NVARCHAR(255),
                        pdfLink NVARCHAR(255),
                        FOREIGN KEY (propertyId) REFERENCES MBProperties(id) ON DELETE CASCADE
                    );
                END;
            `;
            await pool.request().query(query);
            console.log("Brochures table created or already exists.");
        } catch (error) {
            console.error("Error creating Brochures table:", error);
        }
    },

    upsertBrochure: async (brochure) => {
        try {
            const pool = await connectToDB();
            const query = `
                MERGE INTO MBBrochures AS target
                USING (SELECT @propertyId AS propertyId) AS source
                ON target.propertyId = source.propertyId
                WHEN MATCHED THEN 
                    UPDATE SET title = @title, logo = @logo, pdfLink = @pdfLink
                WHEN NOT MATCHED THEN 
                    INSERT (propertyId, title, logo, pdfLink) 
                    VALUES (@propertyId, @title, @logo, @pdfLink);
            `;
            await pool.request()
                .input("propertyId", sql.VarChar(50), brochure.propertyId)
                .input("title", sql.NVarChar(255), brochure.title)
                .input("logo", sql.NVarChar(255), brochure.logo)
                .input("pdfLink", sql.NVarChar(255), brochure.pdfLink)
                .query(query);
            console.log("Brochure added or updated successfully.");
        } catch (error) {
            console.error("Error upserting brochure:", error);
        }
    },

    getBrochureByPropertyId: async (propertyId) => {
        try {
            const pool = await connectToDB();
            const query = "SELECT * FROM MBBrochures WHERE propertyId = @propertyId";
            const result = await pool.request()
                .input("propertyId", sql.VarChar(50), propertyId)
                .query(query);
            return result.recordset[0] || null;
        } catch (error) {
            console.error("Error fetching brochure:", error);
            return null;
        }
    },

    deleteBrochureByPropertyId: async (propertyId) => {
        try {
            const pool = await connectToDB();
            const query = "DELETE FROM MBBrochures WHERE propertyId = @propertyId";
            await pool.request()
                .input("propertyId", sql.VarChar(50), propertyId)
                .query(query);
            console.log("Brochure deleted successfully.");
        } catch (error) {
            console.error("Error deleting brochure:", error);
        }
    }
};

export default Brochures;
