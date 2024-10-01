// roomTypes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const RoomType = require("../models/RoomType");
const Hotel = require("../models/Hotels");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// Create a new room type
router.post("/roomTypes", upload.array("images", 5), async (req, res) => {
  try {
    const { hotelId, type, description, basePrice, multiplier } = req.body;
    const images = req.files ? req.files.map((file) => file.path) : [];

    const roomType = new RoomType({
      hotelId,
      type,
      description,
      basePrice,
      multiplier,
      images,
    });

    await roomType.save();

    // Add room type to the hotel
    await Hotel.findByIdAndUpdate(hotelId, {
      $push: { roomTypes: roomType._id },
    });

    res.status(201).send(roomType);
  } catch (error) {
    console.error("Error creating room type:", error);
    res.status(400).send(error);
  }
});

// Get room types for a specific hotel
router.get("/roomTypes/:hotelId", async (req, res) => {
  try {
    const roomTypes = await RoomType.find({ hotelId: req.params.hotelId });
    res.json(roomTypes);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a room type
router.patch("/roomTypes/:id", upload.array("images", 5), async (req, res) => {
  try {
    const updates = req.body;
    if (req.files && req.files.length > 0) {
      updates.images = req.files.map((file) => file.path);
    }

    const roomType = await RoomType.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });
    if (!roomType) {
      return res.status(404).send("Room type not found");
    }
    res.json(roomType);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a room type
router.delete("/roomTypes/:id", async (req, res) => {
  try {
    const roomType = await RoomType.findByIdAndDelete(req.params.id);
    if (!roomType) {
      return res.status(404).send("Room type not found");
    }

    // Remove room type from the hotel
    await Hotel.findByIdAndUpdate(roomType.hotelId, {
      $pull: { roomTypes: roomType._id },
    });

    res.send(roomType);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
