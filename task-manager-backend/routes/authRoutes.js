import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js"; // Import middleware

const router = express.Router();

// @route    POST /api/auth/register
// @desc     Register a new user
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be 6+ chars"),
  ],
  async (req, res) => {

    console.log("📌 Register route hit with data:", req.body); // Log request data
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try { 
      
      console.log("🔍 Checking if user exists...");
      // Check if user already exists
      let user = await User.findOne({ where: { email } });
      if (user) {
        console.log("⚠️ User already exists:", email);
        return res.status(400).json({ msg: "User already exists" });
      }

      // Hash the password
      console.log("🔑 Hashing password...");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      console.log("🆕 Creating user...");
      user = await User.create({ name, email, password: hashedPassword });

      // Generate JWT token
      console.log("🔐 Generating JWT token...");
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

      console.log("✅ User registered successfully!");
      res.status(201).json({message: "User registered successfully!", token, user });
    } catch (err) {
      console.error("❌ Server error:", err);  
      res.status(500).json({ msg: "Server error" });
    }
  }
);

// @route    POST /api/auth/login
// @desc     Login user & get token
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      // Generate JWT token
     //console.log("JWT Secret Key:", process.env.JWT_SECRET);
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

      res.json({ token, user });
    } catch (err) {
      res.status(500).json({ msg: "Server error" });
    }
  }
);

// @route    GET /api/auth/user
// @desc     Get logged-in user details
router.get("/user", authMiddleware, async (req, res) => {
    try {
        const user = await User.findByPk(req.user, {
            attributes: { exclude: ["password"] } // Don't send the password
        });

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

export default router;
