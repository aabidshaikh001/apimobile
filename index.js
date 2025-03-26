import express from "express"
import dotenv from "dotenv"
import morgan from "morgan"
import connectToDB from "./config/db.js"
import User from "./models/User.js"
import OTP from "./models/OTP.js"
import authRoutes from "./routes/authRoutes.js"
import uploadRoutes from "./routes/uploadRoutes.js"
import cors from "cors"
// Add the profile routes
import profileRoutes from "./routes/profileRoutes.js"
import proptiesroutes from "./routes/propertyroutes.js"
import Properties from "./models/Properties.js"
import AboutProperty from "./models/AboutProperty.js"
import Amenities from "./models/Amenities.js"
import BankInfo from "./models/BankInfo.js"
import Brochure from "./models/brochure.js"
import BuilderDetails from "./models/BuilderDeatails.js"
import FloorPlan from "./models/FloorPlan.js"
import Location from "./models/Location.js"
import PaymentPlan from "./models/PaymentPlan.js"
import Ratings from "./models/Rating.js"
import Booking from "./models/bookingmodal.js"
// routes
import aboutpropertyroutes from "./routes/aboutpropertyroutes.js"
import amenitiesroutes from "./routes/amenitiesroutes.js"
import bankinforoutes from "./routes/bankinforoutes.js"
import brochureRoutes from "./routes/brochureroutes.js"
import builderDetailsRoutes from "./routes/BuilderDeatailsroutes.js"
import floorplanroutes from "./routes/FloorPlanroutes.js"
import Locationroutes from "./routes/Locationroutes.js"
import Milestoneroutes from "./routes/Milestoneroutes.js"
import paymentplanroutes from "./routes/PaymentPlanroutes.js"
import ratingsroutes from "./routes/Ratingroutes.js"
import bookingRoutes from "./routes/booking.routes.js";



// Import debug logger
import debugLogger from "./utils/debugLogger.js"
import Milestone from "./models/Milestone.js"

// Load environment variables
dotenv.config()

// Initialize express app
const app = express()
const PORT = process.env.PORT || 5000

// Add CORS configuration

// Middleware
app.use(express.json({ limit: "10mb" })) // Increase JSON payload limit
app.use(morgan("dev"))
app.use(cors());

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
    await Properties.createTable()
    await AboutProperty.createTable()
    await Amenities.createTable()
    await BankInfo.createTable()
    await Brochure.createTable()
    await BuilderDetails.createTable()
    await FloorPlan.createTable()
    await Location.createTable()
    await PaymentPlan.createTable()
    await Ratings.createTable()
    await Milestone.createTable()
    await Booking.createTable()
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
app.use("/api/properties", proptiesroutes)
app.use("/api/aboutproperty", aboutpropertyroutes)
app.use("/api/amenities", amenitiesroutes)
app.use("/api/bankinfo", bankinforoutes)
app.use("/api/brochure", brochureRoutes)
app.use("/api/builderdetails", builderDetailsRoutes)
app.use("/api/floorplan", floorplanroutes)
app.use("/api/location", Locationroutes)
app.use("/api/milestone", Milestoneroutes)
app.use("/api/paymentplan", paymentplanroutes)
app.use("/api/ratings", ratingsroutes)
app.use("/api/booking", bookingRoutes)


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

