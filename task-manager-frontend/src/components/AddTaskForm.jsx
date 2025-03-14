import { useState } from "react";

const AddTaskForm = ({ fetchTasks }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: taskTitle }),
      });

      if (!response.ok) throw new Error("Failed to add task");

      setTaskTitle("");
      fetchTasks(); // Refresh tasks after adding
    } catch (err) {
      console.error("Error adding task:", err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        placeholder="Enter task"
        required
      />
      <button type="submit">Add Task</button>
    </form>
  );
};

export default AddTaskForm;
