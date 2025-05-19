const connectToDB = require("../config/db");
const sql = require("mssql");

const PropertyLeads = {
  createTable: async () => {
    try {
      const pool = await connectToDB();
      const query = `
        IF NOT EXISTS (
          SELECT * FROM INFORMATION_SCHEMA.TABLES 
          WHERE TABLE_NAME = 'LDMMstLead'
        )
        CREATE TABLE LDMMstLead (
          LeadId INT PRIMARY KEY IDENTITY(1,1),
          OrgCode INT NOT NULL DEFAULT 1000,
          LeadCode VARCHAR(50),
          LeadDate DATETIME DEFAULT GETDATE(),
          Name VARCHAR(100),
          Address1 VARCHAR(150),
          Address2 VARCHAR(150),
          Country VARCHAR(50),
          State VARCHAR(50),
          City VARCHAR(50),
          PinNo INT,
          Phone VARCHAR(50),
          Mobile VARCHAR(50),
          Email VARCHAR(50),
          LeadSourceId INT DEFAULT 1,
          LeadTypeId INT DEFAULT 1,
          MinBudget VARCHAR(50),
          MaxBudget VARCHAR(50),
          REMPropStatusCode VARCHAR(50) DEFAULT 'PS-0001',
          CategoryCode VARCHAR(50) DEFAULT NULL,
          REMPropTagCode VARCHAR(150) DEFAULT NULL,
          ProjectCode VARCHAR(50) DEFAULT NULL,
          LeadDesc VARCHAR(500) DEFAULT NULL,
          StatusId INT DEFAULT 1,
          EmployeeId INT DEFAULT NULL,
          TransDate DATE NOT NULL DEFAULT GETDATE(),
          TransBy VARCHAR(50),
          TranDateUpdate DATE DEFAULT NULL,
          TranByUpdate VARCHAR(50) DEFAULT NULL,
          TranDateDel DATE DEFAULT NULL,
          TranByDel VARCHAR(50) DEFAULT NULL,
          IsDeleted BIT DEFAULT 0
        )
      `;
      await pool.request().query(query);
      console.log("✅ LDMMstLead table created or already exists.");
    } catch (error) {
      console.error("❌ Error creating LDMMstLead table:", error);
    }
  },

  getNextLeadCode: async () => {
    try {
      const pool = await connectToDB();
      const result = await pool.request()
        .query("SELECT COUNT(*) + 1 AS nextId FROM LDMMstLead WHERE OrgCode = 1000");
      
      const nextId = result.recordset[0].nextId;
      return `LEAD-${String(nextId).padStart(4, '0')}`;
    } catch (error) {
      console.error("❌ Error getting next lead code:", error);
      return `LEAD-${String(1).padStart(4, '0')}`;
    }
  },

  insertLead: async (data) => {
    try {
      const pool = await connectToDB();
      const leadCode = await PropertyLeads.getNextLeadCode();

      const result = await pool.request()
        .input("OrgCode", sql.Int, 1000)
        .input("LeadCode", sql.VarChar(50), leadCode)
        .input("Name", sql.VarChar(100), data.name || null)
        .input("Address1", sql.VarChar(150), data.address || null)
        .input("Phone", sql.VarChar(50), data.phone || null)
        .input("Email", sql.VarChar(50), data.email || null)
        .input("ProjectCode", sql.VarChar(50), data.propertyId || null)
        .input("LeadDesc", sql.VarChar(500), data.message || null)
        .input("TransBy", sql.VarChar(50), "Website")
        .input("LeadTypeId", sql.Int, 1)
        .input("REMPropStatusCode", sql.VarChar(50), 'PS-0001')
        .query(`
          INSERT INTO LDMMstLead (
            OrgCode, LeadCode, Name, Address1, Phone, Email, 
            ProjectCode, LeadDesc, TransBy, LeadTypeId, REMPropStatusCode
          )
          VALUES (
            @OrgCode, @LeadCode, @Name, @Address1, @Phone, @Email,
            @ProjectCode, @LeadDesc, @TransBy, @LeadTypeId, @REMPropStatusCode
          );
          SELECT SCOPE_IDENTITY() AS LeadId;
        `);

      return { success: true, leadId: result.recordset[0].LeadId };
    } catch (error) {
      console.error("❌ Insert Lead Error:", error);
      return { success: false, error };
    }
  },

  getLeadById: async (leadId) => {
    try {
      const pool = await connectToDB();
      const result = await pool.request()
        .input("LeadId", sql.Int, leadId)
        .query("SELECT * FROM LDMMstLead WHERE LeadId = @LeadId AND IsDeleted = 0");
      return result.recordset[0] || null;
    } catch (error) {
      console.error("❌ Get Lead Error:", error);
      return null;
    }
  },

  updateLead: async (leadId, data) => {
    try {
      const pool = await connectToDB();
      const request = pool.request();
      
      // Add all updatable parameters
      request.input("LeadId", sql.Int, leadId);
      request.input("LeadCode", sql.VarChar(50), data.LeadCode || null);
      request.input("Name", sql.VarChar(100), data.Name || null);
      request.input("Address1", sql.VarChar(150), data.Address1 || null);
      request.input("Address2", sql.VarChar(150), data.Address2 || null);
      request.input("Country", sql.VarChar(50), data.Country || null);
      request.input("State", sql.VarChar(50), data.State || null);
      request.input("City", sql.VarChar(50), data.City || null);
      request.input("PinNo", sql.Int, data.PinNo || null);
      request.input("Phone", sql.VarChar(50), data.Phone || null);
      request.input("Mobile", sql.VarChar(50), data.Mobile || null);
      request.input("Email", sql.VarChar(50), data.Email || null);
      request.input("LeadSourceId", sql.Int, data.LeadSourceId || null);
      request.input("LeadTypeId", sql.Int, data.LeadTypeId || null);
      request.input("MinBudget", sql.VarChar(50), data.MinBudget || null);
      request.input("MaxBudget", sql.VarChar(50), data.MaxBudget || null);
      request.input("REMPropStatusCode", sql.VarChar(50), data.REMPropStatusCode || null);
      request.input("CategoryCode", sql.VarChar(50), data.CategoryCode || null);
      request.input("REMPropTagCode", sql.VarChar(150), data.REMPropTagCode || null);
      request.input("ProjectCode", sql.VarChar(50), data.ProjectCode || null);
      request.input("LeadDesc", sql.VarChar(500), data.LeadDesc || null);
      request.input("StatusId", sql.Int, data.StatusId || null);
      request.input("EmployeeId", sql.Int, data.EmployeeId || null);
      request.input("TranByUpdate", sql.VarChar(50), data.TranByUpdate || null);
      
      await request.query(`
        UPDATE LDMMstLead SET
          LeadCode = @LeadCode,
          Name = @Name,
          Address1 = @Address1,
          Address2 = @Address2,
          Country = @Country,
          State = @State,
          City = @City,
          PinNo = @PinNo,
          Phone = @Phone,
          Mobile = @Mobile,
          Email = @Email,
          LeadSourceId = @LeadSourceId,
          LeadTypeId = @LeadTypeId,
          MinBudget = @MinBudget,
          MaxBudget = @MaxBudget,
          REMPropStatusCode = @REMPropStatusCode,
          CategoryCode = @CategoryCode,
          REMPropTagCode = @REMPropTagCode,
          ProjectCode = @ProjectCode,
          LeadDesc = @LeadDesc,
          StatusId = @StatusId,
          EmployeeId = @EmployeeId,
          TranDateUpdate = GETDATE(),
          TranByUpdate = @TranByUpdate
        WHERE LeadId = @LeadId
      `);
      
      return { success: true };
    } catch (error) {
      console.error("❌ Update Lead Error:", error);
      return { success: false, error };
    }
  },

  deleteLead: async (leadId, deletedBy) => {
    try {
      const pool = await connectToDB();
      await pool.request()
        .input("LeadId", sql.Int, leadId)
        .input("TranByDel", sql.VarChar(50), deletedBy)
        .query(`
          UPDATE LDMMstLead SET
            IsDeleted = 1,
            TranDateDel = GETDATE(),
            TranByDel = @TranByDel
          WHERE LeadId = @LeadId
        `);
      return { success: true };
    } catch (error) {
      console.error("❌ Delete Lead Error:", error);
      return { success: false, error };
    }
  },

  getAllLeads: async (orgCode, filters = {}) => {
    try {
      const pool = await connectToDB();
      let query = "SELECT * FROM LDMMstLead WHERE OrgCode = @OrgCode AND IsDeleted = 0";
      const request = pool.request().input("OrgCode", sql.Int, orgCode);
      
      // Add filters if provided
      if (filters.statusId) {
        query += " AND StatusId = @StatusId";
        request.input("StatusId", sql.Int, filters.statusId);
      }
      if (filters.employeeId) {
        query += " AND EmployeeId = @EmployeeId";
        request.input("EmployeeId", sql.Int, filters.employeeId);
      }
      if (filters.leadTypeId) {
        query += " AND LeadTypeId = @LeadTypeId";
        request.input("LeadTypeId", sql.Int, filters.leadTypeId);
      }
      if (filters.searchTerm) {
        query += " AND (Name LIKE @SearchTerm OR Email LIKE @SearchTerm OR Mobile LIKE @SearchTerm)";
        request.input("SearchTerm", sql.VarChar(100), `%${filters.searchTerm}%`);
      }
      
      query += " ORDER BY LeadDate DESC";
      
      const result = await request.query(query);
      return result.recordset;
    } catch (error) {
      console.error("❌ Get All Leads Error:", error);
      return [];
    }
  }
};

module.exports = PropertyLeads;