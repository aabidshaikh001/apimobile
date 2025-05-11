const connectToDB = require("../config/db");
const sql = require("mssql");


const customermodel = {
    createTable: async () => {
        try {
            const pool = await connectToDB();
            const query = `
                IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'CSMTranCustomer')
                BEGIN
                    CREATE TABLE CSMTranCustomer (
                         id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) UNIQUE NOT NULL,
    phone NVARCHAR(50) NOT NULL,
    address NVARCHAR(MAX),
    customerType NVARCHAR(50),
    notes NVARCHAR(MAX),
    contactPreference NVARCHAR(50),
    createdBy NVARCHAR(255) NOT NULL,
    createdAt DATETIME DEFAULT GETDATE()
                    );
                END;
            `;
            await pool.request().query(query);
            console.log("User table created or already exists.");
        } catch (error) {
            console.error("Error creating User table:", error);
        }
    },
    createcustomer: async (customer) => {
        try {
            const pool = await connectToDB();
            const query = `
                INSERT INTO CSMTranCustomer (name, email, phone, address, customerType, notes, contactPreference, createdBy)
                VALUES (@name, @email, @phone, @address, @customerType, @notes, @contactPreference, @createdBy);
            `;
            await pool.request()
                .input("name", sql.NVarChar(255), customer.name)
                .input("email", sql.NVarChar(255), customer.email)
                .input("phone", sql.NVarChar(50), customer.phone)
                .input("address", sql.NVarChar(sql.MAX), customer.address)
                .input("customerType", sql.NVarChar(50), customer.customerType)
                .input("notes", sql.NVarChar(sql.MAX), customer.notes)
                .input("contactPreference", sql.NVarChar(50), customer.contactPreference)
                .input("createdBy", sql.NVarChar(255), customer.createdBy) // Updated for string
                .query(query);
            console.log("Customer created successfully.");
        } catch (error) {
            console.error("Error creating customer:", error);
        }
    },
    getAllCustomers: async () => {
        try {
            const pool = await connectToDB();
            const query = `SELECT * FROM CSMTranCustomer`;
            const result = await pool.request().query(query);
            return result.recordset;
        } catch (error) {
            console.error("Error fetching customers:", error);
            throw error;
        }
    },
    getCustomerById: async (id) => {
        try {
            const pool = await connectToDB();
            const query = `SELECT * FROM CSMTranCustomer WHERE id = @id`;
            const result = await pool.request()
                .input("id", sql.Int, id)
                .query(query);
            return result.recordset[0];
        } catch (error) {
            console.error("Error fetching customer:", error);
            throw error;
        }
    },
    deleteCustomer: async (id) => {
        try {
            const pool = await connectToDB();
            const query = `DELETE FROM CSMTranCustomer WHERE id = @id`;
            await pool.request()
                .input("id", sql.Int, id)
                .query(query);
            console.log("Customer deleted successfully.");
        } catch (error) {
            console.error("Error deleting customer:", error);
        }
    },
    updateCustomer: async (id, customer) => {
        try {
            const pool = await connectToDB();
            const query = `
                UPDATE CSMTranCustomer
                SET name = @name,
                    email = @email,
                    phone = @phone,
                    address = @address,
                    customerType = @customerType,
                    notes = @notes,
                    contactPreference = @contactPreference
                WHERE id = @id;
            `;
            await pool.request()
                .input("id", sql.Int, id)
                .input("name", sql.NVarChar(255), customer.name)
                .input("email", sql.NVarChar(255), customer.email)
                .input("phone", sql.NVarChar(50), customer.phone)
                .input("address", sql.NVarChar(sql.MAX), customer.address)
                .input("customerType", sql.NVarChar(50), customer.customerType)
                .input("notes", sql.NVarChar(sql.MAX), customer.notes)
                .input("contactPreference", sql.NVarChar(50), customer.contactPreference)
                .query(query);
            console.log("Customer updated successfully.");
        } catch (error) {
            console.error("Error updating customer:", error);
        }
    }
};
module.exports = customermodel;