const connectToDB = require("../config/db");

const HelpPages = {
  createTable: async () => {
    const db = await connectToDB();
    const sql = `
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='REMWEBPageHelp' AND xtype='U')
      BEGIN
        CREATE TABLE REMWEBPageHelp (
          id INT PRIMARY KEY IDENTITY(1,1),
          helpPageName NVARCHAR(255) NOT NULL,
          helpPageData NVARCHAR(MAX) NOT NULL
        )
      END
    `;
    await db.request().query(sql);
  },

  create: async (helpPageName, helpPageData) => {
   const db = await connectToDB();
    const sql = `
      INSERT INTO REMWEBPageHelp (helpPageName, helpPageData)
      VALUES (@helpPageName, @helpPageData)
    `;
  
    await db
      .request()
      .input("helpPageName", helpPageName)
      .input("helpPageData", helpPageData)
      .query(sql);
  },
  
  delete: async (id) => {
    const db = await connectToDB();
    const sql = `DELETE FROM REMWEBPageHelp WHERE id = @id`;
    await db.request().input("id", id).query(sql);
  },

  getAll: async () => {
    const db = await connectToDB();
    const sql = `SELECT * FROM REMWEBPageHelp`;
    const result = await db.request().query(sql);
    return result.recordset;
  },
};

module.exports = HelpPages;
