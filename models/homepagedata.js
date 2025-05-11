const connectToDB = require("../config/db");
const sql = require("mssql"); // ✅ Import sql from mssql

const HomePage = {
  async createTable() {
    const query = `
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='REMWEBPageHome' AND xtype='U')
      BEGIN
        CREATE TABLE REMWEBPageHome (
          id INT PRIMARY KEY IDENTITY(1,1),
          homeComponentName NVARCHAR(255) NOT NULL,
          homeComponenData NVARCHAR(MAX) NOT NULL
        )
      END
    `;
    const pool = await connectToDB();
    await pool.request().query(query);
    console.log("✅ Home table ensured.");
  },

  create: async ({ homeComponentName, homeComponenData }) => {
    if (!homeComponentName || !homeComponenData) {
      throw new Error("Invalid input data: homeComponentName or homeComponenData cannot be empty");
    }
  
    const db = await connectToDB();
    const query = `
      INSERT INTO REMWEBPageHome (homeComponentName, homeComponenData)
      VALUES (@homeComponentName, @homeComponenData)
    `;
  
    await db.request()
      .input("homeComponentName", sql.NVarChar(255), homeComponentName)
      .input("homeComponenData", sql.NVarChar(sql.MAX), JSON.stringify(homeComponenData))
      .query(query);
  },
  
  getAll: async () => {
    const db = await connectToDB();
    const sql = `SELECT * FROM REMWEBPageHome`;
    const result = await db.request().query(sql);
    return result.recordset;
  },

  getById: async (id) => {
    const db = await connectToDB();
    const sql = `SELECT * FROM REMWEBPageHome WHERE id = @id`;
    const result = await db.request()
      .input("id", id)
      .query(sql);
    return result.recordset[0];
  },

  update: async (id, { homeComponentName, homeComponenData }) => {
    const db = await connectToDB();
    const sql = `
      UPDATE REMWEBPageHome
      SET homeComponentName = @homeComponentName,
          homeComponenData = @homeComponenData
      WHERE id = @id
    `;
    await db.request()
      .input("id", id)
      .input("homeComponentName", homeComponentName)
      .input("homeComponenData", homeComponenData)
      .query(sql);
  },

  delete: async (id) => {
    const db = await connectToDB();
    const sql = `DELETE FROM REMWEBPageHome WHERE id = @id`;
    await db.request()
      .input("id", id)
      .query(sql);
  },
};

module.exports = HomePage;
