// app.js
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const characterRoutes = require("./routes/characterRoutes");

const app = express();

// Middleware

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173", // Replace with your frontend URL
  credentials: true, // If you're using cookies/sessions
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/characters", characterRoutes);

// Connect to MongoDB
connectDB();

module.exports = app;
