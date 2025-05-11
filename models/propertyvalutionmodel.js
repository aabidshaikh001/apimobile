const connectToDB = require("../config/db");
const sql = require("mssql");
const PropertyValuationModel = {
    createtable: async () => {
        try {
            const pool = await connectToDB();
            await pool.request().query(`
                IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'RESVALTranLeads')
                BEGIN
                    CREATE TABLE RESVALTranLeads (
                        id INT IDENTITY(1,1) PRIMARY KEY,
                        name NVARCHAR(255) NOT NULL,
                        email NVARCHAR(255) NOT NULL,
                        phone NVARCHAR(20) NOT NULL,
                        whatsapp NVARCHAR(20) NOT NULL,
                        propertyType NVARCHAR(255) NOT NULL,
                       squareFootage NVARCHAR(255) NOT NULL,
                       bathrooms NVARCHAR(255) NOT NULL,
                          bedrooms NVARCHAR(255) NOT NULL,
                          location NVARCHAR(255) NOT NULL,
                        message NVARCHAR(MAX) NOT NULL,
                        createdAt DATETIME DEFAULT GETDATE()
                    );
                END
            `);
            console.log("📂 Table check complete.");
        } catch (err) {
            console.error("❌ Error creating table:", err.message);
        }
    },
    getAll: async () => {
        try {
            const pool = await connectToDB();
            const result = await pool.request().query("SELECT * FROM RESVALTranLeads");
            return result.recordset;
        } catch (err) {
            console.error("❌ Error fetching records:", err.message);
            return [];
        }
    },
    create: async (propertyValuationData) => {
        try {
            const { name, email, phone, whatsapp, propertyType, squareFootage, bathrooms, bedrooms, message, location } = propertyValuationData;
            if (!name || !email || !phone || !whatsapp || !propertyType || !squareFootage || !bathrooms || !bedrooms || !message) {
                throw new Error("Missing required fields: name, email, phone, whatsapp, propertyType, squareFootage, bathrooms, bedrooms, location message are required.");
            }
            const pool = await connectToDB();
            const result = await pool
                .request()
                .input("name", sql.NVarChar, name)
                .input("email", sql.NVarChar, email)
                .input("phone", sql.NVarChar, phone)
                .input("whatsapp", sql.NVarChar, whatsapp)
                .input("propertyType", sql.NVarChar, propertyType)
                .input("squareFootage", sql.NVarChar, squareFootage)
                .input("bathrooms", sql.NVarChar, bathrooms)
                .input("bedrooms", sql.NVarChar, bedrooms)
                .input("location", sql.NVarChar, location)
                .input("message", sql.NVarChar(sql.MAX), message)
                .query(`
                    INSERT INTO RESVALTranLeads (name, email, phone, whatsapp, propertyType, squareFootage, bathrooms, bedrooms, message, location)
                    VALUES (@name, @email, @phone, @whatsapp, @propertyType, @squareFootage, @bathrooms, @bedrooms, @message, @location);
                `);
            return result.rowsAffected;
        } catch (err) {
            console.error("❌ Error creating record:", err.message);
            return 0;
        }
    },
    delete: async (id) => {
        try {
            const pool = await connectToDB();
            const result = await pool
                .request()
                .input("id", sql.Int, id)
                .query("DELETE FROM RESVALTranLeads WHERE id = @id");
            return result.rowsAffected;
        } catch (err) {
            console.error("❌ Error deleting record:", err.message);
            return 0;
        }
    },
    update: async (id, propertyValuationData) => {
        try {
            const { name, email, phone, whatsapp, propertyType, squareFootage, bathrooms, bedrooms, message, location } = propertyValuationData;
            if (!name || !email || !phone || !whatsapp || !propertyType || !squareFootage || !bathrooms || !bedrooms || !message || !location) {
                throw new Error("Missing required fields: name, email, phone, whatsapp, propertyType, squareFootage, bathrooms, bedrooms, message are required.");
            }
            const pool = await connectToDB();
            const result = await pool
                .request()
                .input("id", sql.Int, id)
                .input("name", sql.NVarChar, name)
                .input("email", sql.NVarChar, email)
                .input("phone", sql.NVarChar, phone)
                .input("whatsapp", sql.NVarChar, whatsapp)
                .input("propertyType", sql.NVarChar, propertyType)
                .input("squareFootage", sql.NVarChar, squareFootage)
                .input("bathrooms", sql.NVarChar, bathrooms)
                .input("bedrooms", sql.NVarChar, bedrooms)
                .input("message", sql.NVarChar(sql.MAX), message)
                .input("location", sql.NVarChar, location)
                .query(`
                    UPDATE RESVALTranLeads
                    SET name = @name, email = @email, phone = @phone, whatsapp = @whatsapp, propertyType = @propertyType, squareFootage = @squareFootage, bathrooms = @bathrooms, bedrooms = @bedrooms, message = @message, location = @location
                    WHERE id = @id;
                `);
            
            return result.rowsAffected;
        } catch (err) {
            console.error("❌ Error updating record:", err.message);
            return 0;
        }
    },
    
};

module.exports = PropertyValuationModel;