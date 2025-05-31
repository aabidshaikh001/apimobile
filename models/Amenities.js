const connectToDB = require("../config/db");
const sql = require("mssql");

const Amenities = {
    // Create Amenities Table
    createTable: async () => {
        try {
            const pool = await connectToDB();
            const query = `
                IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'REMMstPropAmenity')
                BEGIN
                    CREATE TABLE REMMstPropAmenity (
                        id INT IDENTITY(1,1) PRIMARY KEY,
                        propertyId VARCHAR(50),
                        REMAmenityCode VARCHAR(50),
                        status BIT,
                        FOREIGN KEY (propertyId) REFERENCES REMMstProperties(PropertyId) ON DELETE CASCADE
                    );
                END;
            `;
            await pool.request().query(query);
            console.log("Amenities table created or already exists.");
        } catch (error) {
            console.error("Error creating Amenities table:", error);
        }
    },

    // Insert Single Amenity
    insertAmenity: async (propertyId, amenity) => {
        try {
            const pool = await connectToDB();
            const query = `
                INSERT INTO REMMstPropAmenity (propertyId, REMAmenityCode, status)
                VALUES (@propertyId, @REMAmenityCode, @status)
            `;
            await pool.request()
                .input("propertyId", sql.VarChar(50), propertyId)
                .input("REMAmenityCode", sql.VarChar(50), amenity.REMAmenityCode)
                .input("status", sql.Bit, amenity.status)
                .query(query);
            console.log("Amenity inserted successfully.");
        } catch (error) {
            console.error("Error inserting amenity:", error);
        }
    },

    // Insert Multiple Amenities
    insertMultipleAmenities: async (propertyId, amenities) => {
        try {
            const pool = await connectToDB();
            const transaction = new sql.Transaction(pool);
            await transaction.begin();

            const request = new sql.Request(transaction);

            for (const amenity of amenities) {
                await request
                    .input("propertyId", sql.VarChar(50), propertyId)
                    .input("REMAmenityCode", sql.VarChar(50), amenity.REMAmenityCode)
                    .input("status", sql.Bit, amenity.status)
                    .query(`
                        INSERT INTO REMMstPropAmenity (propertyId, REMAmenityCode, status)
                        VALUES (@propertyId, @REMAmenityCode, @status)
                    `);
                request.parameters = {}; // Clear parameters before next iteration
            }

            await transaction.commit();
            console.log("Multiple amenities inserted successfully.");
        } catch (error) {
            console.error("Error inserting multiple amenities:", error);
        }
    },

    // Get Amenities by Property ID
    // Get Amenities by Property ID with details
getAmenitiesByPropertyId: async (propertyId) => {
    try {
        const pool = await connectToDB();
        const query = `
            SELECT 
                a.propertyId,
                a.REMAmenityCode,
                a.status,
                b.name,
                b.icon
            FROM 
                REMMstPropAmenity a
            JOIN 
                REMMstAmenity b 
            ON 
                a.REMAmenityCode = b.REMAmenityCode
            WHERE 
                a.propertyId = @propertyId
        `;
        const result = await pool.request()
            .input("propertyId", sql.VarChar(50), propertyId)
            .query(query);
        return result.recordset;
    } catch (error) {
        console.error("Error fetching amenities:", error);
        return [];
    }
},

    // Delete Amenities by Property ID
    deleteAmenitiesByPropertyId: async (propertyId) => {
        try {
            const pool = await connectToDB();
            const query = `
                DELETE FROM REMMstPropAmenity WHERE propertyId = @propertyId
            `;
            await pool.request()
                .input("propertyId", sql.VarChar(50), propertyId)
                .query(query);
            console.log("Amenities deleted successfully.");
        } catch (error) {
            console.error("Error deleting amenities:", error);
        }
    }
};

module.exports = Amenities;
