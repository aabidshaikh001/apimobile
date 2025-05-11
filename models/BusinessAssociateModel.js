const connectToDB = require("../config/db");
const sql = require("mssql");
 const BusinessAssociateModel = {
    async initializeTable() {
        try {
            const pool = await connectToDB();
            await pool.request().query(`
              IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'CSMTranBA')
              BEGIN
                CREATE TABLE CSMTranBA (
                  id INT IDENTITY(1,1) PRIMARY KEY,
                  name NVARCHAR(255) NOT NULL,
                  role NVARCHAR(255) NOT NULL,
                  company NVARCHAR(255) NOT NULL,
                  image NVARCHAR(MAX) NULL,
                  description NVARCHAR(MAX) NULL,
                  expertise NVARCHAR(MAX) NULL,
                  rating FLOAT NULL,
                  projects NVARCHAR(MAX) NULL,
                  email NVARCHAR(255) NOT NULL UNIQUE,
                  linkedin NVARCHAR(255) NULL,
                  twitter NVARCHAR(255) NULL,
                  education NVARCHAR(MAX) NULL,
                  languages NVARCHAR(MAX) NULL,
                  awards NVARCHAR(MAX) NULL,
                  testimonials NVARCHAR(MAX) NULL,
                  publications NVARCHAR(MAX) NULL
                )
              END
            `);
            console.log("✅ CSMTranBA table initialized.");
          } catch (error) {
            console.error("❌ Error initializing table:", error);
          }
        },
        async getAllProfiles() {
            try {
                const pool = await connectToDB();
                const result = await pool.request().query("SELECT * FROM CSMTranBA");
                return result.recordset;
              } catch (error) {
                console.error("❌ Error fetching CSMTranBA:", error);
                throw error;
              }
        },
        async getProfileById(id) {
            try {
                const pool = await connectToDB();
                const result = await pool
                  .request()
                  .input("id", sql.Int, id)
                  .query("SELECT * FROM CSMTranBA WHERE id = @id");
                return result.recordset[0];
              } catch (error) {
                console.error("❌ Error fetching profile:", error);
                throw error;
              }
        },
        async createProfile(profile) {
            try {
                if (!profile.name) {
                    throw new Error("❌ Profile name is required but missing.");
                }
        
                const pool = await connectToDB();
                const result = await pool
                  .request()
                  .input("name", sql.NVarChar, profile.name)
                  .input("role", sql.NVarChar, profile.role || null)
                  .input("company", sql.NVarChar, profile.company || null)
                  .input("image", sql.NVarChar, profile.image || null)
                  .input("description", sql.NVarChar, profile.description || null)
                  .input("expertise", sql.NVarChar, JSON.stringify(profile.expertise || []))
                  .input("rating", sql.Float, profile.rating || 0)
                  .input("projects", sql.NVarChar, JSON.stringify(profile.projects || []))
                  .input("email", sql.NVarChar, profile.email || null)
                  .input("linkedin", sql.NVarChar, profile.linkedin || null)
                  .input("twitter", sql.NVarChar, profile.twitter || null)
                  .input("education", sql.NVarChar, JSON.stringify(profile.education || []))
                  .input("languages", sql.NVarChar, JSON.stringify(profile.languages || []))
                  .input("awards", sql.NVarChar, JSON.stringify(profile.awards || []))
                  .input("testimonials", sql.NVarChar, JSON.stringify(profile.testimonials || []))
                  .input("publications", sql.NVarChar, JSON.stringify(profile.publications || []))
                  .query(`
                    INSERT INTO CSMTranBA (
                      name,
                      role,
                      company,
                      image,
                      description,
                      expertise,
                      rating,
                      projects,
                      email,
                      linkedin,
                      twitter,
                      education,
                      languages,
                      awards,
                      testimonials,
                      publications
                    ) VALUES (
                      @name,
                      @role,
                      @company,
                      @image,
                      @description,
                      @expertise,
                      @rating,
                      @projects,
                      @email,
                      @linkedin,
                      @twitter,
                      @education,
                      @languages,
                      @awards,
                      @testimonials,
                      @publications
                    )
                  `);
                
                console.log("✅ Profile created successfully:", profile.name);
                return result;
            } catch (error) {
                console.error("❌ Error creating profile:", error);
                throw error;
            }
        }
        ,
        async deleteProfile(id) {
            try {
                const pool = await connectToDB();
                const result = await pool
                  .request()
                  .input("id", sql.Int, id)
                  .query("DELETE FROM CSMTranBA WHERE id = @id");
                return result;
              } catch (error) {
                console.error("❌ Error deleting profile:", error);
                throw error;
              }
        },};
module.exports = BusinessAssociateModel;
