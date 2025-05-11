const connectToDB = require("../config/db");
const sql = require("mssql");


const Testimonials = {
    createTable: async () => {
        try {
            const pool = await connectToDB();
            const query = `
                IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'REMTranUserTestimonial')
                BEGIN
                    CREATE TABLE REMTranUserTestimonial (
                      id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(100) NOT NULL,
    role NVARCHAR(100) NOT NULL,
    content NVARCHAR(500) NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    image_url NVARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
                    );
                END;
            `;
            await pool.request().query(query);
            console.log("REMTranUserTestimonial table created or already exists.");
        } catch (error) {
            console.error("Error creating REMTranUserTestimonial table:", error);
        }
    },
    createTestimonial: async (testimonial) => {
        try {
            const pool = await connectToDB();
            const query = `
                INSERT INTO REMTranUserTestimonial (name, role, content, rating, image_url)
                VALUES (@name, @role, @content, @rating, @image_url);
            `;
            await pool.request()
                .input("name", sql.NVarChar(100), testimonial.name)
                .input("role", sql.NVarChar(100), testimonial.role)
                .input("content", sql.NVarChar(500), testimonial.content)
                .input("rating", sql.Int, testimonial.rating)
                .input("image_url", sql.NVarChar(255), testimonial.image_url)
                .query(query);
            console.log("Testimonial created successfully.");
        } catch (error) {
            console.error("Error creating testimonial:", error);
        }
    },
    getAllTestimonials: async () => {
        try {
            const pool = await connectToDB();
            const query = `SELECT * FROM REMTranUserTestimonial`;
            const result = await pool.request().query(query);
            return result.recordset;
        } catch (error) {
            console.error("Error fetching all REMTranUserTestimonial:", error);
        }
    }};
module.exports = Testimonials;