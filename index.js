const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");

const connectToDB = require("./config/db");
const User = require("./models/User");
const OTP = require("./models/OTP");
const Properties = require("./models/Properties");
const AboutProperty = require("./models/AboutProperty");
const Amenities = require("./models/Amenities");
const BankInfo = require("./models/BankInfo");
const Brochure = require("./models/brochure");
const BuilderDetails = require("./models/BuilderDeatails");
const FloorPlan = require("./models/FloorPlan");
const Location = require("./models/Location");
const PaymentPlan = require("./models/PaymentPlan");
const Ratings = require("./models/Rating");
const Booking = require("./models/bookingmodal");
const Quries = require("./models/Quries");
const customermodel = require("./models/customermodel");
const Milestone = require("./models/Milestone");
const aboutlocality = require("./models/aboutlocality");
const Yotubevideo = require("./models/yotubeVideoModel");
const ProjectDetails = require("./models/projectDetailsModel.js");
const AboutDeveloper = require("./models/AboutDeveloper.js");
const AboutProject = require("./models/AboutProject.js");
const StateCity = require("./models/stateCityModel.js");
const buyCategory = require("./models/buyCategory.model.js");
const rentCategory = require("./models/rentcatogry.js"); // Assuming you have a rentCategory model
const ExploreCities = require("./models/ExploreCitites.js"); // Assuming you have an ExploreCities model
const Testimonial = require("./models/Testimonials.js");
const Faqmodel = require("./models/faqmodel.js");
const TermsOfService = require("./models/TermsOfService.js");
const Privacypolicy = require("./models/privacypolicy.js"); // Assuming you have a privacy policy model

const PartnerSection = require("./models/PartnerSection.js");
const subscribeNewsletter = require("./models/newsletter.js");
const AboutUs = require("./models/AboutUs.js")
const PropertyLeads = require("./models/PropertyLeads.js");
const Services = require("./models/services.js"); // Assuming you have a services model
const SellPages  = require("./models/SellPageData.js"); // Assuming you have a SellPages model
const HelpPages = require("./models/Helppagedata.js");
const HomePage = require("./models/homepagedata.js")
// Routes
const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const profileRoutes = require("./routes/profileRoutes");
const proptiesroutes = require("./routes/propertyroutes");
const aboutpropertyroutes = require("./routes/aboutpropertyroutes");
const amenitiesroutes = require("./routes/amenitiesroutes");
const bankinforoutes = require("./routes/bankinforoutes");
const brochureRoutes = require("./routes/brochureroutes");
const builderDetailsRoutes = require("./routes/BuilderDeatailsroutes");
const floorplanroutes = require("./routes/FloorPlanroutes");
const Locationroutes = require("./routes/Locationroutes");
const Milestoneroutes = require("./routes/Milestoneroutes");
const paymentplanroutes = require("./routes/PaymentPlanroutes");
const Ratingroutes = require("./routes/Ratingroutes.js");
const bookingRoutes = require("./routes/booking.routes");
const queryroutes = require("./routes/queryroutes");
const customerroutes = require("./routes/customerroutes");
const BlogModel = require("./models/blogModel.js");
const blogRoutes = require("./routes/blogRoutes.js");
const jobRoutes = require("./routes/jobRoutes.js");
const JobModel = require("./models/jobModel.js");
const jobformRoutes = require("./routes/jobformRoutes.js");
const JobformModel = require("./models/jobformModel.js");
const BusinessAssociateModel = require("./models/BusinessAssociateModel.js");
const BusinessAssociateRoutes = require("./routes/BusinessAssociateRoutes.js");
const ContactModel = require("./models/contactModel.js");
const contactRoutes = require("./routes/contactRoutes.js");
const LegalAssistanceModel = require("./models/LegalAssistanceModel.js");
const LegalAssistanceRoutes = require("./routes/LegalAssistanceroutes.js");
const PropertyValuationModel = require("./models/propertyvalutionmodel.js");
const propertyValuationRoutes = require("./routes/propertyvalutionroutes.js");
const HomeConstructionModel = require("./models/HomeConstructionmodel.js");
const HomeConstructionRoutes = require("./routes/HomeConstructionRoutes.js");
const HomeInteriorModel = require("./models/HomeInteriormodel.js");
const HomeInteriorRoutes = require("./routes/HomeInteriorRoutes.js");
const HomeLoanModel = require("./models/Homeloanmodal.js");
const HomeLoanRoutes = require("./routes/homeloadnroutes.js");
const HomeInsuranceModel = require("./models/HomeInsurancemodel.js");
const HomeInsuranceRoutes = require("./routes/HomeInsuranceroutes.js");
const forbuilderModel = require("./models/for-builderModel.js");
const forbuilderRoutes = require("./routes/forbuilderRoutes.js");
const forownerModel = require("./models/forownermodel.js");
const forownerRoutes = require("./routes/forownerRoutes.js");
const foragentModel = require("./models/foragentmodel.js");
const foragentRoutes = require("./routes/foragentroutes.js");
const aboutlocalityroutes = require("./routes/aboutlocalityRoutes.js");
const youtubeVideoRoutes = require("./routes/youtubeVideoRoutes.js");
const projectDetailsRoutes = require("./routes/projectDetailsroutes.js");
const AboutDeveloperRoutes = require("./routes/aboutDeveloperRoutes.js");
const AboutProjectRoutes = require("./routes/aboutProjectRoutes.js"); 
const StateCityRoutes = require("./routes/stateCityRoutes.js");
const buyCategoryRoutes = require("./routes/buyCategory.routes.js");
const rentCategoryroutes = require("./routes/rentCategoryroutes.js"); // Assuming you have a rentCategory route
const ExploreCitiesRoutes = require("./routes/exploreCitiesRoutes.js"); // Assuming you have an ExploreCities route
const TestimonialRoutes = require("./routes/testimonialsRoutes.js"); // Assuming you have a Testimonial route
const FaqRoutes = require("./routes/faqRoutes.js"); // Assuming you have a Faq route
const termsRoutes = require("./routes/termsRoutes.js");
const PrivacyPolicyRoutes = require("./routes/privacypolicyRoutes.js"); // Assuming you have a PrivacyPolicy route
const PartnerSectionRoutes = require("./routes/partnerSection.routes.js");
const whyWorkWithUsController = require('./controllers/whyWorkWithUsController'); // Adjust path
const whyworkwithus = require('./models/whyworkwithus'); // Adjust path
const newsletterRoutes = require("./routes/newsletterRoutes.js"); // Assuming you have a newsletter route
const aboutUsRoutes = require("./routes/aboutUsRoutes.js")
const propertyLeadsRoutes = require("./routes/propertyLeadsRoutes.js");
const ServicesRoutes = require("./routes/servicesRoutes.js"); // Assuming you have a services route
const sellPagesRoutes = require("./routes/sellPagesRoutes.js");
const helpPagesRoutes = require("./routes/helpPagesRoutes.js");
const homePageRoutes = require("./routes/homePageRoutes.js");

// Debug Logger
const debugLogger = require("./utils/debugLogger");

// Load environment variables
dotenv.config()

// Initialize express app
const app = express()
const PORT = process.env.PORT || 5000

// Add CORS configuration

// Middleware
app.use(express.json({ limit: "10mb" })) // Increase JSON payload limit
app.use(morgan("dev"))
const allowedOrigins = [
  'https://sales.realestatecompany.co.in',
  'http://localhost:3000', // during development
  'https://realestatecompany.co.in', // production
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));


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
    await Quries.createTable()
    await customermodel.createTable()
    await buyCategory.createTable(); // Ensure buy category table exists
    await rentCategory.createTable(); // Ensure rent category table exists
    

    await JobModel.createTable(); // Ensure jobs table exists
    await JobformModel.createTable(); // Ensure job applications table exists
    await BusinessAssociateModel.initializeTable();
    await ContactModel.createTable();
    await LegalAssistanceModel.createTable();
    await PropertyValuationModel.createtable();
    await HomeConstructionModel.createtable();
    await HomeInteriorModel.createtable();
    await HomeLoanModel.createtable();
    await HomeInsuranceModel.createtable();
    await forbuilderModel.initializeTable();
    await forownerModel.initializeTable();
    await foragentModel.initializeTable();
    await BlogModel.createTable(); // Ensure table exists
    await aboutlocality.createTable(); // Ensure table exists
    await Yotubevideo.createTable(); // Ensure table exists
    await ProjectDetails.createTable(); // Ensure table exists
    await AboutDeveloper.createTable(); // Ensure table exists
    await AboutProject.createTable(); // Ensure table exists
    await StateCity.createTable(); // Ensure table exists
    await ExploreCities.createTable(); // Ensure table exists
    await Testimonial.createTable(); // Ensure table exists
    await Faqmodel.createTable(); // Ensure table exists
    await TermsOfService.createTable(); // Ensure table exists
    await Privacypolicy.createTable(); // Ensure table exists
    await PartnerSection.createTable(); // Ensure table exists
    await whyworkwithus.createTable(); // Ensure table exists
    await subscribeNewsletter.createTable(); // Ensure table exists
    await AboutUs.createTable(); // Ensure table exists
    await PropertyLeads.createTable(); // Ensure property leads table exists
    await Services.createTable(); // Ensure services table exists
    await SellPages.createTable();
    await HelpPages.createTable();
    await HomePage.createTable();
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
app.use("/api/ratings", Ratingroutes)
app.use("/api/booking", bookingRoutes)
app.use("/api/query", queryroutes)
app.use("/api/customer", customerroutes)

app.use("/api/blogs", blogRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/jobform", jobformRoutes);
app.use("/api/business-associates", BusinessAssociateRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/legal-assistance", LegalAssistanceRoutes);
app.use("/api/property-valuations", propertyValuationRoutes);
app.use("/api/home-constructions", HomeConstructionRoutes);
app.use("/api/home-interiors", HomeInteriorRoutes);
app.use("/api/home-loans", HomeLoanRoutes);
app.use("/api/home-insurances", HomeInsuranceRoutes);
app.use("/api/forbuilder", forbuilderRoutes);
app.use("/api/forowner", forownerRoutes);
app.use("/api/foragent", foragentRoutes);
app.use("/api/aboutlocality", aboutlocalityroutes);
app.use("/api/video", youtubeVideoRoutes);
app.use("/api/projectdetails", projectDetailsRoutes);
app.use("/api/aboutdeveloper", AboutDeveloperRoutes);
app.use("/api/aboutproject", AboutProjectRoutes);
app.use("/api/statecity", StateCityRoutes);
app.use("/api/buycategory", buyCategoryRoutes);
app.use("/api/rentcategory", rentCategoryroutes); // Rent category route
app.use("/api/explorecities", ExploreCitiesRoutes); // Explore cities route
app.use("/api/testimonials", TestimonialRoutes); // Testimonial route
app.use("/api/faq", FaqRoutes); // Faq route
app.use("/api/terms", termsRoutes); // Terms of Service route
app.use("/api/privacy-policy", PrivacyPolicyRoutes); // Privacy Policy route
app.use("/api/partner-section", PartnerSectionRoutes); // Partner Section route
app.use("/api/why-work-with-us", whyWorkWithUsController); // Why Work With Us route
app.use("/api/newsletter", newsletterRoutes); // Newsletter route
app.use("/api/aboutus", aboutUsRoutes)
app.use("/api/propertylead", propertyLeadsRoutes) // Property leads route
app.use("/api/services", ServicesRoutes); // Services route

app.use("/api/sellpages", sellPagesRoutes); // Sell pages route
app.use("/api/helppage",helpPagesRoutes)
app.use("/api/homepage", homePageRoutes);

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

module.exports = app; // CommonJS export

