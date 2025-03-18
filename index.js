import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import morgan from "morgan"
import connectToDB from "./config/db.js"
import User from "./models/User.js"
import OTP from "./models/OTP.js"
import authRoutes from "./routes/authRoutes.js"
import uploadRoutes from "./routes/uploadRoutes.js"
// Add the profile routes
import profileRoutes from "./routes/profileRoutes.js"

// Import debug logger
import debugLogger from "./utils/debugLogger.js"

// Load environment variables
dotenv.config()

// Initialize express app
const app = express()
const PORT = process.env.PORT || 5000

// Add CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)

// Middleware
app.use(express.json({ limit: "10mb" })) // Increase JSON payload limit
app.use(morgan("dev"))

// Add request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

// Add debug logger in development
if (process.env.NODE_ENV !== "production") {
  app.use(debugLogger)
}

// Initialize database tables
const initDB = async () => {
  try {
    await connectToDB()
    await User.createTable()
    await OTP.createTable()
    console.log("Database tables initialized")
  } catch (error) {
    console.error("Database initialization error:", error)
    process.exit(1)
  }
}

// Routes
app.use("/api", authRoutes)
app.use("/api/upload", uploadRoutes)
app.use("/api/profile", profileRoutes)

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" })
})

// Add more detailed error handling
app.use((err, req, res, next) => {
  console.error("Server error:", err)

  // Send appropriate error response
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : "Server error",
  })
})

// Start server
const startServer = async () => {
  try {
    await initDB()
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

startServer()

export default app

