import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import { sequelize } from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import User from "./models/User.js";
import Task from "./models/Task.js";

// Load environment variables
dotenv.config();

// Connect to PostgreSQL
connectDB();

// Sync database models
sequelize.sync({ force: false }) // Set to true to drop tables and recreate
  .then(() => console.log("✅ Database Synced!"))
  .catch((err) => console.error("❌ Error syncing database:", err));

  

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/tasks", taskRoutes);

// Routes
app.use("/api/auth", authRoutes);

// API Health Check
app.get("/", (req, res) => {
    res.send("Task Manager API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
