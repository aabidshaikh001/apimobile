import connectToDB from "../config/db.js";
import sql from "mssql";

const FloorPlan = {
    createTable: async () => {
        try {
            const pool = await connectToDB();
            const query = `
                IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'MBFloorPlan')
                BEGIN
                    CREATE TABLE MBFloorPlan (
                        id INT IDENTITY(1,1) PRIMARY KEY,
                        propertyId VARCHAR(50) NOT NULL UNIQUE,
                        bhk NVARCHAR(50),
                        area NVARCHAR(50),
                        price NVARCHAR(50),
                        pricePerSqft NVARCHAR(50),
                        FOREIGN KEY (propertyId) REFERENCES MBProperties(id) ON DELETE CASCADE
                    );
                END;
            `;
            await pool.request().query(query);
            console.log("FloorPlan table created or already exists.");
        } catch (error) {
            console.error("Error creating FloorPlan table:", error);
        }
    },

    upsertFloorPlan: async (floorPlan) => {
        try {
            const pool = await connectToDB();
            const query = `
                MERGE INTO MBFloorPlan AS target
                USING (SELECT @propertyId AS propertyId) AS source
                ON target.propertyId = source.propertyId
                WHEN MATCHED THEN 
                    UPDATE SET 
                        bhk = @bhk, 
                        area = @area, 
                        price = @price, 
                        pricePerSqft = @pricePerSqft
                WHEN NOT MATCHED THEN 
                    INSERT (propertyId, bhk, area, price, pricePerSqft) 
                    VALUES (@propertyId, @bhk, @area, @price, @pricePerSqft);
            `;
            await pool.request()
                .input("propertyId", sql.VarChar(50), floorPlan.propertyId)
                .input("bhk", sql.NVarChar(50), floorPlan.bhk)
                .input("area", sql.NVarChar(50), floorPlan.area)
                .input("price", sql.NVarChar(50), floorPlan.price)
                .input("pricePerSqft", sql.NVarChar(50), floorPlan.pricePerSqft)
                .query(query);
            console.log("Floor plan added or updated successfully.");
        } catch (error) {
            console.error("Error upserting floor plan:", error);
        }
    },

    getFloorPlanByPropertyId: async (propertyId) => {
        try {
            const pool = await connectToDB();
            const query = "SELECT * FROM MBFloorPlan WHERE propertyId = @propertyId";
            const result = await pool.request()
                .input("propertyId", sql.VarChar(50), propertyId)
                .query(query);
            return result.recordset[0] || null;
        } catch (error) {
            console.error("Error fetching floor plan:", error);
            return null;
        }
    },

    deleteFloorPlanByPropertyId: async (propertyId) => {
        try {
            const pool = await connectToDB();
            const query = "DELETE FROM MBFloorPlan WHERE propertyId = @propertyId";
            await pool.request()
                .input("propertyId", sql.VarChar(50), propertyId)
                .query(query);
            console.log("Floor plan deleted successfully.");
        } catch (error) {
            console.error("Error deleting floor plan:", error);
        }
    }
};

export default FloorPlan;
