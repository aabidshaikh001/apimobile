const connectToDB = require("../config/db");
const sql = require("mssql");


const Bookings = {
    createTable: async () => {
        try {
            const pool = await connectToDB();
            const query = `
                IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'LDMTranVisit')
                BEGIN
                    CREATE TABLE LDMTranVisit (
                        id INT IDENTITY(1,1) PRIMARY KEY,
                        bookingId AS 'BK-' + CAST(id AS VARCHAR(10)) PERSISTED,
                        propertyId VARCHAR(50) NULL,
                        propertyName NVARCHAR(255) NULL,
                        clientName NVARCHAR(100) NOT NULL,
                        phoneNumber VARCHAR(50) NOT NULL,
                        email VARCHAR(100) NOT NULL,
                        requirement NVARCHAR(500) NOT NULL,
                        priceRange NVARCHAR(100) NOT NULL,
                        bookingDate DATE NOT NULL,
                        timeSlot VARCHAR(50) NOT NULL,
                        country NVARCHAR(100),
                        bookingStatus VARCHAR(20) DEFAULT 'Pending',
                        createdAt DATETIME DEFAULT GETDATE(),
                        updatedAt DATETIME DEFAULT GETDATE()
                    );
                    CREATE INDEX idx_bookings_email ON LDMTranVisit(email);
                    CREATE INDEX idx_bookings_date ON LDMTranVisit(bookingDate);
                END;
            `;
            await pool.request().query(query);
            console.log("Bookings table created or already exists.");
        } catch (error) {
            console.error("Error creating Bookings table:", error);
        }
    },

    createBooking: async (bookingData) => {
        try {
            const pool = await connectToDB();
            const query = `
                INSERT INTO LDMTranVisit (
                    propertyId, propertyName, clientName, phoneNumber, email,
                    requirement, priceRange, bookingDate, timeSlot, country
                )
                VALUES (
                    @propertyId, @propertyName, @clientName, @phoneNumber, @email,
                    @requirement, @priceRange, @bookingDate, @timeSlot, @country
                );
                SELECT bookingId FROM LDMTranVisit WHERE id = SCOPE_IDENTITY();
            `;

            const result = await pool.request()
                .input("propertyId", sql.VarChar(50), bookingData.propertyId || null)
                .input("propertyName", sql.NVarChar(255), bookingData.propertyName || null)
                .input("clientName", sql.NVarChar(100), bookingData.clientName)
                .input("phoneNumber", sql.VarChar(50), bookingData.phoneNumber)
                .input("email", sql.VarChar(100), bookingData.email)
                .input("requirement", sql.NVarChar(500), bookingData.requirement)
                .input("priceRange", sql.NVarChar(100), bookingData.priceRange)
                .input("bookingDate", sql.Date, bookingData.bookingDate)
                .input("timeSlot", sql.VarChar(50), bookingData.timeSlot)
                .input("country", sql.NVarChar(100), bookingData.country || null)
                .query(query);

            return {
                success: true,
                bookingId: result.recordset[0].bookingId
            };
        } catch (error) {
            console.error("Error creating booking:", error);
            throw error;
        }
    },

    getBookingById: async (bookingId) => {
        try {
            const pool = await connectToDB();
            const query = `SELECT * FROM LDMTranVisit WHERE bookingId = @bookingId`;
            const result = await pool.request()
                .input("bookingId", sql.VarChar(50), bookingId)
                .query(query);
            
            return result.recordset[0] || null;
        } catch (error) {
            console.error("Error fetching booking:", error);
            return null;
        }
    },

    getBookingsByPropertyId: async (propertyId) => {
        try {
            const pool = await connectToDB();
            const query = propertyId
                ? `SELECT * FROM LDMTranVisit WHERE propertyId = @propertyId ORDER BY bookingDate DESC`
                : `SELECT * FROM LDMTranVisit ORDER BY bookingDate DESC`;
            
            const request = pool.request();
            if (propertyId) {
                request.input("propertyId", sql.VarChar(50), propertyId);
            }
            
            const result = await request.query(query);
            return result.recordset;
        } catch (error) {
            console.error("Error fetching bookings:", error);
            return [];
        }
    },

    updateBookingStatus: async (bookingId, status) => {
        try {
            const pool = await connectToDB();
            const query = `
                UPDATE LDMTranVisit
                SET bookingStatus = @status,
                    updatedAt = GETDATE()
                WHERE bookingId = @bookingId
            `;
            await pool.request()
                .input("bookingId", sql.VarChar(50), bookingId)
                .input("status", sql.VarChar(20), status)
                .query(query);
            
            console.log("Booking status updated successfully.");
            return true;
        } catch (error) {
            console.error("Error updating booking status:", error);
            return false;
        }
    },

    deleteBooking: async (bookingId) => {
        try {
            const pool = await connectToDB();
            const query = `DELETE FROM LDMTranVisit WHERE bookingId = @bookingId`;
            await pool.request()
                .input("bookingId", sql.VarChar(50), bookingId)
                .query(query);
            
            console.log("Booking deleted successfully.");
            return true;
        } catch (error) {
            console.error("Error deleting booking:", error);
            return false;
        }
    },
    getAllbookings: async () => {
        console.log("📌 getAllbookings function called!");
    
        try {
            console.log("🔍 Querying database for all bookings...");
    
            const query = `SELECT * FROM LDMTranVisit`;
            const result = await pool.request().query(query);
    
            console.log("📌 Query result:", result.recordset);
    
            return result.recordset;
        } catch (error) {
            console.error("❌ Error executing getAllbookings:", error);
            throw error;  // Ensure the error propagates to the controller
        }
    }
    
};

module.exports = Bookings;
