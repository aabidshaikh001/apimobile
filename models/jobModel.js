const sql = require("mssql");
const connectToDB = require("../config/db");

const JobModel = {
  // Ensure table exists
  async createTable() {
    const query = `
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='job_vacancies' AND xtype='U')
      CREATE TABLE job_vacancies (
        id INT IDENTITY(1,1) PRIMARY KEY,
        title NVARCHAR(255) NOT NULL,
        department NVARCHAR(255) NOT NULL,
        location NVARCHAR(255) NOT NULL,
        type NVARCHAR(100) NOT NULL,
        description NVARCHAR(MAX) NOT NULL,
        responsibilities NVARCHAR(MAX) NOT NULL,
        requirements NVARCHAR(MAX) NOT NULL,
        benefits NVARCHAR(MAX) NOT NULL
      );
    `;
    const pool = await connectToDB();
    await pool.request().query(query);
    console.log("✅ job_vacancies table ensured.");
  },

  // Create a new job
  async createJob(jobData) {
    const { title, department, location, type, description, responsibilities, requirements, benefits } = jobData;
    const query = `
      INSERT INTO job_vacancies (title, department, location, type, description, responsibilities, requirements, benefits)
      OUTPUT INSERTED.*
      VALUES (@title, @department, @location, @type, @description, @responsibilities, @requirements, @benefits)
    `;

    const pool = await connectToDB();
    const result = await pool.request()
      .input("title", sql.NVarChar, title)
      .input("department", sql.NVarChar, department)
      .input("location", sql.NVarChar, location)
      .input("type", sql.NVarChar, type)
      .input("description", sql.NVarChar, description)
      .input("responsibilities", sql.NVarChar, JSON.stringify(responsibilities))
      .input("requirements", sql.NVarChar, JSON.stringify(requirements))
      .input("benefits", sql.NVarChar, JSON.stringify(benefits))
      .query(query);

    return result.recordset[0];
  },

  // Get all jobs
  async getAllJobs() {
    const pool = await connectToDB();
    const result = await pool.request().query("SELECT * FROM job_vacancies");
    return result.recordset;
  },

  // Get a job by ID
  async getJobById(id) {
    const pool = await connectToDB();
    const result = await pool.request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM job_vacancies WHERE id = @id");

    return result.recordset[0];
  },

  // Delete a job by ID
  async deleteJob(id) {
    const pool = await connectToDB();
    await pool.request()
      .input("id", sql.Int, id)
      .query("DELETE FROM job_vacancies WHERE id = @id");

    return { message: "Job deleted successfully" };
  }
};

module.exports = JobModel;
