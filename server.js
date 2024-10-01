require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const hotelRoutes = require("./routes/hotels");
const roomTypeRoutes = require("./routes/roomTypes");
const userRoutes = require("./routes/users");
const bookingRoutes = require("./routes/bookings");
const path = require("path");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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

app.post("/create-payment-intent", async (req, res) => {
  // const { totalPrice } = req.body

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(1000),
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return await res.send({
    clientSecret: paymentIntent.client_secret,
    dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
  });
});

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
