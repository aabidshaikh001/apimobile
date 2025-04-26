const connectToDB = require("../config/db");
const sql = require("mssql");
const BlogModel = {
  // Create Blogs Table
  createTable: async () => {
    try {
      const pool = await connectToDB();
      await pool.request().query(`
        IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'blogs')
        BEGIN
          CREATE TABLE blogs (
            id INT IDENTITY(1,1) PRIMARY KEY,
            title NVARCHAR(255) NOT NULL,
            category NVARCHAR(100),
            date NVARCHAR(50) NOT NULL,
            authorName NVARCHAR(100) NULL,
            authorRole NVARCHAR(100) NULL,
            authorAvatar NVARCHAR(255) NULL,
            authorBio NVARCHAR(MAX) NULL,
            thumbnail NVARCHAR(255) NULL,
            image NVARCHAR(255) NULL,
            excerpt NVARCHAR(MAX) NOT NULL,
            content NVARCHAR(MAX) NOT NULL,
            featured BIT DEFAULT 0
          );
        END
      `);
      console.log("📂 Table check complete.");
    } catch (err) {
      console.error("❌ Error creating table:", err.message);
    }
  },

  // Get All Blogs
  getAll: async () => {
    const pool = await connectToDB();
    const result = await pool.request().query("SELECT * FROM blogs");
    return result.recordset;
  },

  // Get Blog by ID
  getById: async (id) => {
    const pool = await connectToDB();
    const result = await pool.request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM blogs WHERE id = @id");
    return result.recordset[0];
  },

  // Create Blog
  create: async (blogData) => {
    const { title, category, date, author, thumbnail, image, excerpt, content, featured } = blogData;
    const pool = await connectToDB();
    const result = await pool
      .request()
      .input("title", sql.NVarChar, title)
      .input("category", sql.NVarChar, category)
      .input("date", sql.NVarChar, date)
      .input("authorName", sql.NVarChar, author?.name || null)
      .input("authorRole", sql.NVarChar, author?.role || null)
      .input("authorAvatar", sql.NVarChar, author?.avatar || null)
      .input("authorBio", sql.NVarChar, author?.bio || null)
      .input("thumbnail", sql.NVarChar, thumbnail || null)
      .input("image", sql.NVarChar, image || null)
      .input("excerpt", sql.NVarChar, excerpt)
      .input("content", sql.NVarChar, content)
      .input("featured", sql.Bit, featured || 0)
      .query(`
        INSERT INTO blogs (title, category, date, authorName, authorRole, authorAvatar, authorBio, thumbnail, image, excerpt, content, featured)
        VALUES (@title, @category, @date, @authorName, @authorRole, @authorAvatar, @authorBio, @thumbnail, @image, @excerpt, @content, @featured);
        SELECT SCOPE_IDENTITY() AS id;
      `);
    return result.recordset[0].id;
  },

  // Delete Blog
  delete: async (id) => {
    const pool = await connectToDB();
    await pool.request().input("id", sql.Int, id).query("DELETE FROM blogs WHERE id = @id");
  },
  
};


module.exports = BlogModel;
