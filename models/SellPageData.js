// models/SellPages.js
const connectToDB = require("../config/db");

const SellPages = {
  createTable: async () => {
    const db = await connectToDB();
    const sql = `
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='sellPages' AND xtype='U')
      BEGIN
        CREATE TABLE sellPages (
          id INT PRIMARY KEY IDENTITY(1,1),
          sellPageName NVARCHAR(255) NOT NULL,
          sellPageData NVARCHAR(MAX) NOT NULL
        )
      END
    `;
    await db.request().query(sql);
  },

  create: async (sellPageName, sellPageData) => {
    const db = await connectToDB();
    const sql = `
      INSERT INTO sellPages (sellPageName, sellPageData)
      VALUES (@sellPageName, @sellPageData)
    `;
    await db.request()
      .input("sellPageName", sellPageName)
      .input("sellPageData", sellPageData)
      .query(sql);
  },

  getAll: async () => {
    const db = await connectToDB();
    const sql = `SELECT * FROM sellPages`;
    const result = await db.request().query(sql);
    return result.recordset;
  },

  getById: async (id) => {
    const db = await connectToDB();
    const sql = `SELECT * FROM sellPages WHERE id = @id`;
    const result = await db.request().input("id", id).query(sql);
    return result.recordset[0];
  },
};

module.exports = SellPages;
