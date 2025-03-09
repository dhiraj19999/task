import React, { useState, useEffect } from "react";
import axios from "axios";
import {Link }from "react-router-dom";
const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [draggedTask, setDraggedTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
        const token = localStorage.getItem("token");
      const response = await axios.get("https://task-2-3z5h.onrender.com/api/v1/users/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data.tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Function to group tasks by status
  const groupTasksByStatus = () => {
    return tasks.reduce((acc, task) => {
      acc[task.status] = acc[task.status] || [];
      acc[task.status].push(task);
      return acc;
    }, {});
  };

  // Handle drag start
  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  // Handle drop event
  const handleDrop = async (newStatus) => {
    if (!draggedTask) return;

    try {
      // Update task status in backend
      const token = localStorage.getItem("token");
      await axios.put(`https://task-2-3z5h.onrender.com/api/v1/users/updatetaskstatus/${draggedTask._id}`, { status: newStatus }, {headers: { Authorization: `Bearer ${token}` }});

      // Update UI
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t._id === draggedTask._id ? { ...t, status: newStatus } : t))
      );
      fetchTasks();
    } catch (error) {
      console.error("Error updating task status:", error);
    } finally {
      setDraggedTask(null);
    }
  };

  const groupedTasks = groupTasksByStatus();
  const statuses = ["To-Do", "In Progress", "Completed"];

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
        <h1>Tasks</h1>
      {statuses.map((status) => (
        <div
          key={status}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(status)}
          style={{
            flex: 1,
            minHeight: "300px",
            padding: "10px",
            border: "2px solid gray",
            borderRadius: "5px",
            backgroundColor: "#f4f4f4",
          }}
        >
          <h3>{status}</h3>
          {groupedTasks[status]?.map((task) => (
            <div
              key={task._id}
              draggable
              onDragStart={() => handleDragStart(task)}
              style={{
                padding: "10px",
                margin: "10px 0",
                backgroundColor: "white",
                border: "1px solid #ccc",
                cursor: "grab",
              }}
            >
              <h4>{task.title}</h4>
              <p>{task.description}</p>
              <p>Due: {task.dueDate}</p>
              <Link to={`/task/${task._id}`}>View Task</Link>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TaskBoard;
