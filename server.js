require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const hotelRoutes = require("./routes/hotels");
const roomTypeRoutes = require("./routes/roomTypes");
const userRoutes = require("./routes/users");
const bookingRoutes = require("./routes/bookings");
const path = require("path");

const app = express();

const port = process.env.PORT || 8000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB Atlas", error);
  });

// Enable CORS for all routes
app.use(cors());

app.use(express.json());

// Serve static files from the 'public' directory
console.log("Public directory:", path.join(__dirname, "public"));
app.use(express.static(path.join(__dirname, "public")));

// Serve files from the 'uploads' directory
console.log("Uploads directory:", path.join(__dirname, "uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", hotelRoutes);
app.use("/api", roomTypeRoutes);
app.use("/api", userRoutes);
app.use("/api", bookingRoutes);
// Add a test route
app.get("/test", (req, res) => {
  res.send("Hello from the test route!");
});

// Catch-all route for debugging
app.get("*", (req, res) => {
  console.log("Received request for:", req.url);
  res.status(404).send("Not found");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
