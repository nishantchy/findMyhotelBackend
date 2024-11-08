const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  hotelId: {
    type: String,
    required: true,
  },
  hotelName: { type: String, required: true },
  hotelImage: {
    type: String,
    required: true,
  },

  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  roomType: { type: String, required: true },
  numberOfGuests: { type: Number, required: true },
});

module.exports = mongoose.model("Booking", bookingSchema);
