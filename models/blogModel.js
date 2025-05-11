const connectToDB = require("../config/db");
const sql = require("mssql");

const executeQuery = async (query, params = []) => {
  try {
    const pool = await connectToDB();
    const request = pool.request();
    params.forEach(param => request.input(param.name, param.type, param.value));
    const result = await request.query(query);
    return result.recordset;
  } catch (err) {
    console.error("❌ Query Error:", err.message);
    throw err;
  }
};

const BlogModel = {
  // Create Blogs Table
  createTable: async () => {
    const query = `
      IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'REMTranUserBlogs')
      BEGIN
        CREATE TABLE REMTranUserBlogs (
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
    `;
    await executeQuery(query);
    console.log("📂 Table check complete.");
  },

  // Get All REMTranUserBlogs
  getAll: async () => {
    const query = "SELECT * FROM REMTranUserBlogs";
    return await executeQuery(query);
  },

  // Get Blog by ID
  getById: async (id) => {
    const query = "SELECT * FROM REMTranUserBlogs WHERE id = @id";
    const params = [{ name: "id", type: sql.Int, value: id }];
    const result = await executeQuery(query, params);
    return result[0];
  },

  // Create Blog
  create: async (blogData) => {
    const { title, category, date, author, thumbnail, image, excerpt, content, featured } = blogData;
    const query = `
      INSERT INTO REMTranUserBlogs (title, category, date, authorName, authorRole, authorAvatar, authorBio, thumbnail, image, excerpt, content, featured)
      VALUES (@title, @category, @date, @authorName, @authorRole, @authorAvatar, @authorBio, @thumbnail, @image, @excerpt, @content, @featured);
      SELECT SCOPE_IDENTITY() AS id;
    `;
    const params = [
      { name: "title", type: sql.NVarChar, value: title },
      { name: "category", type: sql.NVarChar, value: category },
      { name: "date", type: sql.NVarChar, value: date },
      { name: "authorName", type: sql.NVarChar, value: author.name  },
      { name: "authorRole", type: sql.NVarChar, value: author.role },
      { name: "authorAvatar", type: sql.NVarChar, value: author.avatar },
      { name: "authorBio", type: sql.NVarChar, value: author.bio },
      { name: "thumbnail", type: sql.NVarChar, value: thumbnail || null },
      { name: "image", type: sql.NVarChar, value: image || null },
      { name: "excerpt", type: sql.NVarChar, value: excerpt },
      { name: "content", type: sql.NVarChar, value: content },
      { name: "featured", type: sql.Bit, value: featured || 0 }
    ];
    const result = await executeQuery(query, params);
    return result[0].id;
  },

  // Delete Blog
  delete: async (id) => {
    const query = "DELETE FROM REMTranUserBlogs WHERE id = @id";
    const params = [{ name: "id", type: sql.Int, value: id }];
    await executeQuery(query, params);
  },

  // Update Blog
  update: async (id, blogData) => {
    const { title, category, date, author, thumbnail, image, excerpt, content, featured } = blogData;
    const query = `
      UPDATE REMTranUserBlogs
      SET title = @title,
          category = @category,
          date = @date,
          authorName = @authorName,
          authorRole = @authorRole,
          authorAvatar = @authorAvatar,
          authorBio = @authorBio,
          thumbnail = @thumbnail,
          image = @image,
          excerpt = @excerpt,
          content = @content,
          featured = @featured
      WHERE id = @id;
    `;
    const params = [
      { name: "id", type: sql.Int, value: id },
      { name: "title", type: sql.NVarChar, value: title },
      { name: "category", type: sql.NVarChar, value: category },
      { name: "date", type: sql.NVarChar, value: date },
      { name: "authorName", type: sql.NVarChar, value: author?.name || null },
      { name: "authorRole", type: sql.NVarChar, value: author?.role || null },
      { name: "authorAvatar", type: sql.NVarChar, value: author?.avatar || null },
      { name: "authorBio", type: sql.NVarChar, value: author?.bio || null },
      { name: "thumbnail", type: sql.NVarChar, value: thumbnail || null },
      { name: "image", type: sql.NVarChar, value: image || null },
      { name: "excerpt", type: sql.NVarChar, value: excerpt },
      { name: "content", type: sql.NVarChar, value: content },
      { name: "featured", type: sql.Bit, value: featured || 0 }
    ];
    await executeQuery(query, params);
  }
};

module.exports = BlogModel;
