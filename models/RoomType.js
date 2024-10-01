// RoomTypes

const mongoose = require("mongoose");

const RoomTypeSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: true,
  },
  type: { type: String, required: true },
  description: { type: String },
  images: [{ type: String }],
  basePrice: { type: Number, required: true },
  multiplier: { type: Number, required: true, default: 1 },
  available: { type: Boolean, default: true },
});

module.exports = mongoose.model("RoomType", RoomTypeSchema);
