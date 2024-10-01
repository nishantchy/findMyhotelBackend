const mongoose = require("mongoose");

const HotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Hotel name is required"],
    match: [/^[A-Za-z\s]+$/, "Name should only contain letters and spaces"],
  },
  basePrice: {
    type: Number,
    required: [true, "Base price is required"],
    min: [0, "Base price cannot be negative"],
  },
  numberOfRooms: {
    type: Number,
    required: [true, "Number of rooms is required"],
    min: [1, "Number of rooms must be at least 1"],
  },
  location: {
    name: { type: String, required: [true, "Location name is required"] },
    address: { type: String, required: [true, "Address is required"] },
    latitude: {
      type: Number,
      required: [true, "Latitude is required"],
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      required: [true, "Longitude is required"],
      min: -180,
      max: 180,
    },
  },
  ratings: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  propertyType: { type: String, required: [true, "Property type is required"] },
  images: {
    type: [String],
    validate: {
      validator: function (v) {
        return v.length > 0;
      },
      message: "At least one image is required",
    },
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  description: { type: String },
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required"],
    match: [/^\d{10}$/, "Phone number must be 10 digits"],
  },
  roomTypes: {
    type: [String],
    required: [true, "At least one room type is required"],
    validate: {
      validator: function (v) {
        return v.length > 0;
      },
      message: "At least one room type must be selected",
    },
  },
});

module.exports = mongoose.model("Hotel", HotelSchema);
