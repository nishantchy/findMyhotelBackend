const express = require("express");
const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const User = require("../models/userModel");
const Hotel = require("../models/Hotels");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post("/bookings", async (req, res) => {
  try {
    const {
      paymentMethodId,
      userEmail,
      hotelId,
      roomType,
      numberOfGuests,
      totalPrice,
      checkInDate,
      checkOutDate,
    } = req.body;
    console.log("Looking for user with email:", userEmail);

    const user = await User.findOne({ emailAddress: userEmail });
    if (!user) {
      console.error(`User not found for email: ${userEmail}`); // Log the email
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!mongoose.Types.ObjectId.isValid(hotelId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid hotel ID format" });
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res
        .status(404)
        .json({ success: false, message: "Hotel not found" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100),
      currency: "usd",
      payment_method: paymentMethodId,
      confirm: true,
    });

    if (paymentIntent.status !== "succeeded") {
      return res
        .status(400)
        .json({ success: false, message: "Payment failed" });
    }

    // Create a new booking
    const newBooking = new Booking({
      user: user._id,
      hotelId: hotel._id,
      hotelName: hotel.name,
      checkInDate,
      checkOutDate,
      totalPrice,
      roomType,
      numberOfGuests,
      paymentIntentId: paymentIntent.id,
    });

    const savedBooking = await newBooking.save();
    res.status(201).json({ success: true, booking: savedBooking });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating booking",
      error: error.message,
    });
  }
});

router.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().populate("user hotelId");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error });
  }
});

router.get("/bookings/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      "user hotelId"
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Error fetching booking", error });
  }
});

router.put("/bookings/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Error updating booking", error });
  }
});

router.delete("/bookings/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting booking", error });
  }
});

module.exports = router;
