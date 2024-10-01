const express = require("express");
const User = require("../models/userModel");

const router = express.Router();

// GET all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET user by ID
router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST (create) a new user
router.post("/users", async (req, res) => {
  const { firstName, lastName, emailAddress, imageUrl } = req.body;

  const user = new User({
    firstName,
    lastName,
    emailAddress,
    imageUrl,
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT (update) user by ID
router.put("/users/:id", async (req, res) => {
  const { firstName, lastName, emailAddress, imageUrl } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, emailAddress, imageUrl },
      { new: true, runValidators: true }
    );

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE user by ID
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
