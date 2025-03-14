import express from "express";
import authMiddleware  from "../middleware/authMiddleware.js";
import Task from "../models/Task.js";

const router = express.Router();

// ✅ GET all tasks
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.findAll({ where: { userId: req.user.id } });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ POST (Add a new task)
router.post("/", authMiddleware, async (req, res) => {
  console.log("Received request to add task:", req.body);
  console.log("User ID from authMiddleware:", req.user?.id);


  if (!req.user || !req.user.id) {
    return res.status(401).json({ msg: "Unauthorized: Missing user ID" });
  }
  
  const { title } = req.body;
  if (!title) {
    console.log("Task title is missing!");
    return res.status(400).json({ msg: "Task title is required" });
  }

  try {
    const task = await Task.create({ title, userId: req.user.id });
    console.log("Task created successfully:", task);
    res.status(201).json(task);
  } catch (error) {
    console.error("Error adding task:", error); // ✅ Log full error
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});


// ✅ DELETE task
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!task) return res.status(404).json({ msg: "Task not found" });

    await task.destroy();
    res.json({ msg: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

export default router; // ✅ Use ES Module export
