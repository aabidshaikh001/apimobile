const connectToDB = require("../config/db");
const sql = require("mssql");

const generatePropertyId = async () => {
    try {
        const pool = await connectToDB();
        const query = `SELECT TOP 1 PropertyId FROM REMMstProperties ORDER BY PropertyId DESC`;
        const result = await pool.request().query(query);

        if (result.recordset.length > 0) {
            const lastId = result.recordset[0].PropertyId;
            const match = lastId.match(/TREC-prop(\d+)-(\d+)/);
            if (match) {
                let numericPart = parseInt(match[1]) + 1;
                let suffix = parseInt(match[2]) + 1;
                return `TREC-prop${numericPart.toString().padStart(5, "0")}-${suffix.toString().padStart(3, "0")}`;
            }
        }
        return "TREC-prop00001-001"; // Default ID if no records exist
    } catch (error) {
        console.error("Error generating property ID:", error);
        return null;
    }
};

const Properties = {
    createTable: async () => {
        try {
            const pool = await connectToDB();
            const query = `
                IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'REMMstProperties')
                BEGIN
                    CREATE TABLE REMMstProperties (
                        PropertyId VARCHAR(50) PRIMARY KEY,
                        title NVARCHAR(255),
                        location NVARCHAR(255),
                        price NVARCHAR(50),
                        pricePerSqft NVARCHAR(50),
                        latitude FLOAT,
                        longitude FLOAT,
                        propertyType NVARCHAR(255),
                        status NVARCHAR(255),
                        propertyFor NVARCHAR(10),
                        images NVARCHAR(MAX),
                        brokerage NVARCHAR(50),
                        discount NVARCHAR(50),
                        visitBonus NVARCHAR(255),
                        bhkOptions NVARCHAR(MAX),
                        superBuiltUpArea NVARCHAR(50),
                        carpetArea NVARCHAR(50),
                        isSaved BIT,
                        isFeatured BIT,
                        type NVARCHAR(100),
                        projectId INT
                    );
                END;
            `;
            await pool.request().query(query);
            console.log("Properties table created or already exists.");
        } catch (error) {
            console.error("Error creating Properties table:", error);
        }
    },

    insertProperty: async (property) => {
        try {
            const pool = await connectToDB();
            const newId = await generatePropertyId();
            if (!newId) throw new Error("Failed to generate property ID");

            const query = `
                INSERT INTO REMMstProperties (
                    PropertyId, title, location, price, pricePerSqft, latitude, longitude, propertyType, status,
                    propertyFor, images, brokerage, tag, readyToMove, discount, visitBonus, bhkOptions,
                    isSaved, isFeatured, superBuiltUpArea, carpetArea, type, projectId
                )
                VALUES (
                    @PropertyId, @title, @location, @price, @pricePerSqft, @latitude, @longitude, @propertyType, @status,
                    @propertyFor, @images, @brokerage, @tag, @readyToMove, @discount, @visitBonus, @bhkOptions,
                    @isSaved, @isFeatured, @superBuiltUpArea, @carpetArea, @type, @projectId
                )
            `;

            await pool.request()
                .input("PropertyId", sql.VarChar(50), newId)
                .input("title", sql.NVarChar(255), property.title)
                .input("location", sql.NVarChar(255), property.location)
                .input("price", sql.NVarChar(50), property.price)
                .input("pricePerSqft", sql.NVarChar(50), property.pricePerSqft)
                .input("latitude", sql.Float, property.latitude)
                .input("longitude", sql.Float, property.longitude)
                .input("propertyType", sql.NVarChar(255), property.propertyType)
                .input("status", sql.NVarChar(255), property.status)
                .input("propertyFor", sql.NVarChar(10), property.propertyFor)
                .input("images", sql.NVarChar(sql.MAX), JSON.stringify(property.images))
                .input("brokerage", sql.NVarChar(50), property.brokerage)
                .input("tag", sql.NVarChar(50), property.tag)
                .input("readyToMove", sql.Bit, property.readyToMove)
                .input("discount", sql.NVarChar(50), property.discount)
                .input("visitBonus", sql.NVarChar(255), property.visitBonus)
                .input("bhkOptions", sql.NVarChar(sql.MAX), JSON.stringify(property.bhkOptions))
                .input("isSaved", sql.Bit, property.isSaved)
                .input("isFeatured", sql.Bit, property.isFeatured)
                .input("superBuiltUpArea", sql.NVarChar(50), property.superBuiltUpArea)
                .input("carpetArea", sql.NVarChar(50), property.carpetArea)
                .input("type", sql.NVarChar(100), property.type)
                .input("projectId", sql.Int, property.projectId)
                .query(query);

            console.log("Property inserted successfully with ID:", newId);
        } catch (error) {
            console.error("Error inserting property:", error);
        }
    },

    updateProperty: async (PropertyId, property) => {
        try {
            const pool = await connectToDB();
            const query = `
                UPDATE REMMstProperties
                SET title = @title,
                    location = @location,
                    price = @price,
                    pricePerSqft = @pricePerSqft,
                    latitude = @latitude,
                    longitude = @longitude,
                    propertyType = @propertyType,
                    status = @status,
                    propertyFor = @propertyFor,
                    images = @images,
                    brokerage = @brokerage,
                    tag = @tag,
                    readyToMove = @readyToMove,
                    discount = @discount,
                    visitBonus = @visitBonus,
                    bhkOptions = @bhkOptions,
                    isSaved = @isSaved,
                    isFeatured = @isFeatured,
                    superBuiltUpArea = @superBuiltUpArea,
                    carpetArea = @carpetArea,
                    type = @type,
                    projectId = @projectId
                WHERE PropertyId = @PropertyId
            `;

            await pool.request()
                .input("PropertyId", sql.VarChar(50), PropertyId)
                .input("title", sql.NVarChar(255), property.title)
                .input("location", sql.NVarChar(255), property.location)
                .input("price", sql.NVarChar(50), property.price)
                .input("pricePerSqft", sql.NVarChar(50), property.pricePerSqft)
                .input("latitude", sql.Float, property.latitude)
                .input("longitude", sql.Float, property.longitude)
                .input("propertyType", sql.NVarChar(255), property.propertyType)
                .input("status", sql.NVarChar(255), property.status)
                .input("propertyFor", sql.NVarChar(10), property.propertyFor)
                .input("images", sql.NVarChar(sql.MAX), JSON.stringify(property.images))
                .input("brokerage", sql.NVarChar(50), property.brokerage)
                .input("tag", sql.NVarChar(50), property.tag)
                .input("readyToMove", sql.Bit, property.readyToMove)
                .input("discount", sql.NVarChar(50), property.discount)
                .input("visitBonus", sql.NVarChar(255), property.visitBonus)
                .input("bhkOptions", sql.NVarChar(sql.MAX), JSON.stringify(property.bhkOptions))
                .input("isSaved", sql.Bit, property.isSaved)
                .input("isFeatured", sql.Bit, property.isFeatured)
                .input("superBuiltUpArea", sql.NVarChar(50), property.superBuiltUpArea)
                .input("carpetArea", sql.NVarChar(50), property.carpetArea)
                .input("type", sql.NVarChar(100), property.type)
                .input("projectId", sql.Int, property.projectId)
                .query(query);

            console.log("Property updated successfully.");
        } catch (error) {
            console.error("Error updating property:", error);
        }
    },

    getAllProperties: async () => {
        try {
            const pool = await connectToDB();
            const query = "SELECT * FROM REMMstProperties";
            const result = await pool.request().query(query);
            return result.recordset;
        } catch (error) {
            console.error("Error fetching properties:", error);
            return [];
        }
    },

    getPropertyById: async (PropertyId) => {
        try {
            const pool = await connectToDB();
            const query = "SELECT * FROM REMMstProperties WHERE PropertyId = @PropertyId";
            const result = await pool.request()
                .input("PropertyId", sql.VarChar(50), PropertyId)
                .query(query);
            return result.recordset[0];
        } catch (error) {
            console.error("Error fetching property by ID:", error);
            return null;
        }
    },

    deleteProperty: async (PropertyId) => {
        try {
            const pool = await connectToDB();
            const query = "DELETE FROM REMMstProperties WHERE PropertyId = @PropertyId";
            await pool.request()
                .input("PropertyId", sql.VarChar(50), PropertyId)
                .query(query);
            console.log("Property deleted successfully.");
        } catch (error) {
            console.error("Error deleting property:", error);
        }
    },

    getFeaturedProperties: async () => {
        try {
            const pool = await connectToDB();
            const query = "SELECT * FROM REMMstProperties WHERE isFeatured = 1";
            const result = await pool.request().query(query);
            return result.recordset;
        } catch (error) {
            console.error("Error fetching featured properties:", error);
            return [];
        }
    },

    getSavedProperties: async (userId) => {
        try {
            const pool = await connectToDB();
            const query = "SELECT * FROM REMMstProperties WHERE isSaved = 1 AND userId = @userId";
            const result = await pool.request()
                .input("userId", sql.VarChar(50), userId)
                .query(query);
            return result.recordset;
        } catch (error) {
            console.error("Error fetching saved properties:", error);
            return [];
        }
    },
};

module.exports = Properties;