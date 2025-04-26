const connectToDB = require("../config/db");
const sql = require("mssql");

const Rating = {
    createTable: async () => {
        try {
            const pool = await connectToDB();
            const query = `
                IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'MBRating')
                BEGIN
                    CREATE TABLE MBRating (
                        id INT IDENTITY(1,1) PRIMARY KEY,
                        propertyId VARCHAR(50) NOT NULL,
                        name NVARCHAR(255),
                        avatar NVARCHAR(255),
                        rating INT CHECK (rating BETWEEN 1 AND 5),
                        review NVARCHAR(MAX),
                        FOREIGN KEY (propertyId) REFERENCES MBProperties(id) ON DELETE CASCADE
                    );
                END;
            `;
            await pool.request().query(query);
            console.log("Rating table created or already exists.");
        } catch (error) {
            console.error("Error creating Rating table:", error);
        }
    },

    insertRating: async (ratingData) => {
        try {
            const pool = await connectToDB();
            const query = `
                INSERT INTO MBRating (propertyId, name, avatar, rating, review)
                VALUES (@propertyId, @name, @avatar, @rating, @review);
            `;
            await pool.request()
                .input("propertyId", sql.VarChar(50), ratingData.propertyId)
                .input("name", sql.NVarChar(255), ratingData.name)
                .input("avatar", sql.NVarChar(255), ratingData.avatar)
                .input("rating", sql.Int, ratingData.rating)
                .input("review", sql.NVarChar(sql.MAX), ratingData.review)
                .query(query);
        } catch (error) {
            throw error;
        }
    },

    getRatingsByPropertyId: async (propertyId) => {
        try {
            const pool = await connectToDB();
            const query = "SELECT * FROM MBRating WHERE propertyId = @propertyId";
            const result = await pool.request()
                .input("propertyId", sql.VarChar(50), propertyId)
                .query(query);
            return result.recordset;
        } catch (error) {
            throw error;
        }
    },

    deleteRatingById: async (id) => {
        try {
            const pool = await connectToDB();
            const query = "DELETE FROM MBRating WHERE id = @id";
            await pool.request()
                .input("id", sql.Int, id)
                .query(query);
        } catch (error) {
            throw error;
        }
    },

    deleteRatingsByPropertyId: async (propertyId) => {
        try {
            const pool = await connectToDB();
            const query = "DELETE FROM MBRating WHERE propertyId = @propertyId";
            await pool.request()
                .input("propertyId", sql.VarChar(50), propertyId)
                .query(query);
        } catch (error) {
            throw error;
        }
    }
};

module.exports = Rating;
