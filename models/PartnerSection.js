const sql = require("mssql");
const connectToDB = require("../config/db");

const PartnerSection = {
  /**
   * Create the PartnerSection and PartnerSectionCards tables if not exist
   */
  createTable: async () => {
    try {
      const pool = await connectToDB();

      await pool.request().query(`
        IF NOT EXISTS (
          SELECT * FROM sysobjects WHERE name='REMWEBPageBA' AND xtype='U'
        )
        CREATE TABLE REMWEBPageBA (
          id INT PRIMARY KEY IDENTITY(1,1),
          title NVARCHAR(200),
          description NVARCHAR(1000),
          isActive BIT DEFAULT 1,
          createdAt DATETIME DEFAULT GETDATE(),
          updatedAt DATETIME DEFAULT GETDATE()
        );
      `);

      await pool.request().query(`
        IF NOT EXISTS (
          SELECT * FROM sysobjects WHERE name='REMWEBPageBACards' AND xtype='U'
        )
        CREATE TABLE REMWEBPageBACards (
          id INT PRIMARY KEY IDENTITY(1,1),
          partnerSectionId INT FOREIGN KEY REFERENCES REMWEBPageBA(id) ON DELETE CASCADE,
          title NVARCHAR(200),
          description NVARCHAR(500),
          iconType NVARCHAR(50),
          displayOrder INT,
          createdAt DATETIME DEFAULT GETDATE(),
          updatedAt DATETIME DEFAULT GETDATE()
        );
      `);

      console.log("✅ REMWEBPageBA and REMWEBPageBACards tables are ready.");
    } catch (error) {
      console.error("❌ Error creating tables:", error);
      throw new Error("Failed to create tables");
    }
  },

  getPartnerSection: async () => {
    try {
      const pool = await connectToDB();
      const result = await pool.request().query(`
        SELECT 
          id,
          title,
          description
        FROM REMWEBPageBA
        WHERE isActive = 1
        ORDER BY updatedAt DESC
      `);

      const partnerSection = result.recordset[0] || null;

      if (partnerSection) {
        const cardsResult = await pool.request()
          .input("partnerSectionId", sql.Int, partnerSection.id)
          .query(`
            SELECT 
              id,
              title,
              description,
              iconType
            FROM REMWEBPageBACards
            WHERE partnerSectionId = @partnerSectionId
            ORDER BY displayOrder
          `);

        partnerSection.cards = cardsResult.recordset;
      }

      return partnerSection;
    } catch (error) {
      console.error("❌ Database error (get):", error);
      throw new Error("Failed to retrieve partner section data");
    }
  },

  createPartnerSection: async (partnerSection) => {
    try {
      const pool = await connectToDB();
      const transaction = new sql.Transaction(pool);
      await transaction.begin();

      try {
        await transaction.request().query(`
          UPDATE REMWEBPageBA
          SET isActive = 0
          WHERE isActive = 1
        `);

        const result = await transaction.request()
          .input("title", sql.NVarChar(200), partnerSection.title)
          .input("description", sql.NVarChar(1000), partnerSection.description)
          .query(`
            INSERT INTO REMWEBPageBA (title, description, isActive, createdAt, updatedAt)
            OUTPUT INSERTED.id, INSERTED.title, INSERTED.description
            VALUES (@title, @description, 1, GETDATE(), GETDATE())
          `);

        const newPartnerSection = result.recordset[0];

        if (partnerSection.cards && partnerSection.cards.length > 0) {
          for (let i = 0; i < partnerSection.cards.length; i++) {
            const card = partnerSection.cards[i];
            await transaction.request()
              .input("partnerSectionId", sql.Int, newPartnerSection.id)
              .input("title", sql.NVarChar(200), card.title)
              .input("description", sql.NVarChar(500), card.description)
              .input("iconType", sql.NVarChar(50), card.iconType || "FaHandshake")
              .input("displayOrder", sql.Int, i + 1)
              .query(`
                INSERT INTO REMWEBPageBACards 
                (partnerSectionId, title, description, iconType, displayOrder, createdAt, updatedAt)
                VALUES (@partnerSectionId, @title, @description, @iconType, @displayOrder, GETDATE(), GETDATE())
              `);
          }
        }

        await transaction.commit();
        return await PartnerSection.getPartnerSection();
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      console.error("❌ Database error (create):", error);
      throw new Error("Failed to create partner section");
    }
  },

  updatePartnerSection: async (id, partnerSection) => {
    try {
      const pool = await connectToDB();
      const transaction = new sql.Transaction(pool);
      await transaction.begin();

      try {
        await transaction.request()
          .input("id", sql.Int, id)
          .input("title", sql.NVarChar(200), partnerSection.title)
          .input("description", sql.NVarChar(1000), partnerSection.description)
          .query(`
            UPDATE REMWEBPageBA
            SET title = @title, description = @description, updatedAt = GETDATE()
            WHERE id = @id
          `);

        await transaction.request()
          .input("partnerSectionId", sql.Int, id)
          .query(`
            DELETE FROM REMWEBPageBACards
            WHERE partnerSectionId = @partnerSectionId
          `);

        if (partnerSection.cards && partnerSection.cards.length > 0) {
          for (let i = 0; i < partnerSection.cards.length; i++) {
            const card = partnerSection.cards[i];
            await transaction.request()
              .input("partnerSectionId", sql.Int, id)
              .input("title", sql.NVarChar(200), card.title)
              .input("description", sql.NVarChar(500), card.description)
              .input("iconType", sql.NVarChar(50), card.iconType || "FaHandshake")
              .input("displayOrder", sql.Int, i + 1)
              .query(`
                INSERT INTO REMWEBPageBACards 
                (partnerSectionId, title, description, iconType, displayOrder, createdAt, updatedAt)
                VALUES (@partnerSectionId, @title, @description, @iconType, @displayOrder, GETDATE(), GETDATE())
              `);
          }
        }

        await transaction.commit();
        return await PartnerSection.getPartnerSection();
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      console.error("❌ Database error (update):", error);
      throw new Error("Failed to update partner section");
    }
  },

  deletePartnerSection: async (id) => {
    try {
      const pool = await connectToDB();
      const transaction = new sql.Transaction(pool);
      await transaction.begin();

      try {
        await transaction.request()
          .input("partnerSectionId", sql.Int, id)
          .query(`
            DELETE FROM REMWEBPageBACards
            WHERE partnerSectionId = @partnerSectionId
          `);

        await transaction.request()
          .input("id", sql.Int, id)
          .query(`
            DELETE FROM REMWEBPageBA
            WHERE id = @id
          `);

        await transaction.commit();
        return true;
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      console.error("❌ Database error (delete):", error);
      throw new Error("Failed to delete partner section");
    }
  }
};

module.exports = PartnerSection;
