import { useState, useEffect } from "react";
import AddTaskForm from "../components/AddTaskForm"; 

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || "Failed to fetch tasks");

      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err.message);
    }
  };

  const addTask = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTask }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || "Task creation failed");

      setTasks([...tasks, data]); // Add new task to state
      setNewTask(""); // Clear input field
    } catch (err) {
      console.error("Error adding task:", err.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Task deletion failed");

      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      console.error("Error deleting task:", err.message);
    }
  };

  return (
    <div>
      <h2>Task Dashboard</h2>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Enter task"
      />
      <button onClick={addTask}>Add Task</button>
      
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title}
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
