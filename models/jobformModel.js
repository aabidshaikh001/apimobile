const sql = require("mssql");
const connectToDB = require("../config/db");

const JobformModel = {
    async createTable() {
        const query = `
          IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='JobApplications' AND xtype='U')
          CREATE TABLE JobApplications (
            id INT IDENTITY(1,1) PRIMARY KEY,
            name NVARCHAR(255) NOT NULL,
            email NVARCHAR(255) NOT NULL UNIQUE,
            phone NVARCHAR(20) NOT NULL,
            resume NVARCHAR(MAX) NOT NULL,
            coverLetter NVARCHAR(MAX) NULL,
            jobTitle NVARCHAR(255) NULL, -- Add this line
            submittedAt DATETIME DEFAULT GETDATE()
          )
        `;
        const pool = await connectToDB();
        await pool.request().query(query);
        console.log("✅ JobApplications table ensured.");
      },
  async createJobApplication(data) {
    const { name, email, phone, resumeUrl, coverLetter, jobTitle } = data;
    try {
      const pool = await connectToDB();
      const request = pool.request();
      await request
        .input("name", sql.NVarChar, name)
        .input("email", sql.NVarChar, email)
        .input("phone", sql.NVarChar, phone)
        .input("resumeUrl", sql.NVarChar, resumeUrl)
        .input("coverLetter", sql.NVarChar, coverLetter)
        .input("jobTitle", sql.NVarChar, jobTitle)
        .query(
          "INSERT INTO JobApplications (name, email, phone, resume, coverLetter, jobTitle) VALUES (@name, @email, @phone, @resumeUrl, @coverLetter, @jobTitle)"
        );
      console.log("Application inserted successfully!");
      return { message: "Application submitted successfully" };
    } catch (error) {
      console.error("Database error:", error); // Log the actual error
      throw new Error("Error saving application");
    }
  },  async getAllJobApplications() {
        const pool = await connectToDB();
        const result = await pool.request().query("SELECT * FROM JobApplications");
        return result.recordset;
      }
};
module.exports = JobformModel;