const sql = require("mssql") // const mssql library
const connectToDB = require("../config/db") // const database connection

class User {
  // Create users table if it doesn't exist
  static async createTable() {
    try {
      const pool = await connectToDB()

      await pool.request().query(`
   IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' AND xtype='U')

        CREATE TABLE users (
          id VARCHAR(36) PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          name VARCHAR(255),
          phone VARCHAR(20),
          address VARCHAR(500),
          pinNumber VARCHAR(10),
        image NVARCHAR(MAX),
          reraNumber VARCHAR(50),
          bankName VARCHAR(100),
          accountNumber VARCHAR(50),
          ifscCode VARCHAR(20),
          recipientName VARCHAR(100),
          createdAt DATETIME DEFAULT GETDATE(),
          updatedAt DATETIME DEFAULT GETDATE()
        )
      `)

      // Create documents table for storing multiple documents
      await pool.request().query(`
  IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='user_documents' AND xtype='U')



        CREATE TABLE user_documents (
          id VARCHAR(36) PRIMARY KEY,
          userId VARCHAR(36) NOT NULL,
          documentUrl VARCHAR(500) NOT NULL,
          createdAt DATETIME DEFAULT GETDATE(),
          FOREIGN KEY (userId) REFERENCES users(id)
        )
      `)

      console.log("User tables created successfully")
      return true
    } catch (error) {
      console.error("Error creating user tables:", error)
      throw error
    }
  }

  // Create a new user
  static async createUser(userData) {
    try {
      const pool = await connectToDB()
      const userId = this.generateUUID()

      const { email, name = null, phone = null } = userData

      // Check if user already exists
      const userExists = await this.findByEmail(email)
      if (userExists) {
        return { success: false, message: "User with this email already exists" }
      }

      // Insert the new user
      await pool
        .request()
        .input("id", sql.VarChar, userId)
        .input("email", sql.VarChar, email)
        .input("name", sql.VarChar, name)
        .input("phone", sql.VarChar, phone)
        .query(`
          INSERT INTO users (id, email, name, phone)
          VALUES (@id, @email, @name, @phone)
        `)

      return { success: true, userId, email }
    } catch (error) {
      console.error("Error creating user:", error)
      throw error
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const pool = await connectToDB()

      const result = await pool
        .request()
        .input("email", sql.VarChar, email)
        .query(`
          SELECT u.*, 
            (SELECT STRING_AGG(documentUrl, ',') FROM user_documents WHERE userId = u.id) as documents
          FROM users u
          WHERE u.email = @email
        `)

      if (result.recordset.length === 0) {
        return null
      }

      const user = result.recordset[0]

      // Convert comma-separated documents to array if exists
      if (user.documents) {
        user.document = user.documents.split(",")
        delete user.documents
      } else {
        user.document = []
      }

      return user
    } catch (error) {
      console.error("Error finding user by email:", error)
      throw error
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const pool = await connectToDB()

      // First get the user
      const userResult = await pool
        .request()
        .input("id", sql.VarChar, id)
        .query(`
          SELECT * FROM users
          WHERE id = @id
        `)

      if (userResult.recordset.length === 0) {
        return null
      }

      const user = userResult.recordset[0]

      // Then get documents separately
      const documentsResult = await pool
        .request()
        .input("userId", sql.VarChar, id)
        .query(`
          SELECT documentUrl FROM user_documents
          WHERE userId = @userId
        `)

      // Add documents as an array
      user.document = documentsResult.recordset.map((doc) => doc.documentUrl)

      return user
    } catch (error) {
      console.error("Error finding user by ID:", error)
      throw error
    }
  }

  static async updateProfile(userId, userData) {
    try {
      const pool = await connectToDB()
  
      // Remove 'id' FROM userData to avoid duplicate parameter error
      if ("id" in userData) {
        delete userData.id
      }
  
      // Build dynamic update query based on provided fields
      const updateFields = []
      const request = pool.request()
  
      request.input("id", sql.VarChar, userId) // ✅ Declare "id" only once
  
      // Process each field that needs to be updated
      for (const [key, value] of Object.entries(userData)) {
        if (key === "document") continue // Skip documents (handled separately)
  
        if (value !== undefined && value !== null) {
          updateFields.push(`${key} = @${key}`)
          request.input(key, sql.NVarChar, value)
        }
      }
  
      // Only proceed if there are fields to update
      if (updateFields.length > 0) {
        updateFields.push(`updatedAt = GETDATE()`)
  
        const updateQuery = `
          UPDATE users
          SET ${updateFields.join(", ")}
          WHERE id = @id
        `
        await request.query(updateQuery)
      }
  
      // Handle document array separately if provided
      if (userData.document && Array.isArray(userData.document)) {
        // Delete existing documents using a new request object
        const deleteRequest = pool.request()
        deleteRequest.input("userId", sql.VarChar, userId)
        await deleteRequest.query(`DELETE FROM user_documents WHERE userId = @userId`)
  
        // Insert new documents with new request objects
        for (const docUrl of userData.document) {
          if (docUrl) {
            const docId = this.generateUUID()
            const insertRequest = pool.request() // ✅ New request object
            insertRequest.input("docId", sql.VarChar, docId) // Changed parameter name
            insertRequest.input("userId", sql.VarChar, userId)
            insertRequest.input("documentUrl", sql.NVarChar, docUrl)
  
            await insertRequest.query(`
              INSERT INTO user_documents (id, userId, documentUrl)
              VALUES (@docId, @userId, @documentUrl)
            `)
          }
        }
      }
  
      return { success: true, message: "Profile updated successfully" }
    } catch (error) {
      console.error("Error updating user profile:", error)
      throw error
    }
  }
  
  

  // Helper method to generate UUID
  static generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }
}

module.exports = User

