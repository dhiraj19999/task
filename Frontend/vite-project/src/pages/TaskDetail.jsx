   

import React from 'react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
const TaskDetail = () => {

    const { id } = useParams(); // Get the 'id' parameter from the URL
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      // Fetch task details
      const fetchTask = async () => {
        try {
            const token = localStorage.getItem("token");
          const response = await axios.get(`https://task-2-3z5h.onrender.com/api/v1/users/task/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
            });
            setTask(response.data.task); // Store API response in state
          console.log(response.data);
          
        } catch (err) {
          setError("Failed to fetch task details.");
        } finally {
          setLoading(false);
        }
      };
  
      fetchTask();
    }, [id]); // Re-run when ID changes
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    return (
        <div style={styles.container}>
        <h2 style={styles.title}>{task.title}</h2>
        <p><strong>Description:</strong> {task.description}</p>
        <p><strong>Status:</strong> <span style={{ color: getStatusColor(task.status) }}>{task.status}</span></p>
        <p><strong>Priority:</strong> {task.priority}</p>
        <p><strong>Due Date:</strong> {task.dueDate}</p>
        <p><strong>Created At:</strong> {new Date(task.createdAt).toLocaleString()}</p>
        <p><strong>Updated At:</strong> {new Date(task.updatedAt).toLocaleString()}</p>
  
        {/* Display files if available */}
        {task.files.length > 0 && (
          <div>
            <h3>Files:</h3>
            <ul>
              {task.files.map((file, index) => (
                <li key={index}><a href={file} target="_blank" rel="noopener noreferrer">View File</a></li>
              ))}
            </ul>
          </div>
        )}
  
        {/* Display comments if available */}
        {task.comments.length > 0 && (
          <div>
            <h3>Comments:</h3>
            <ul>
              {task.comments.map((comment, index) => (
                <li key={index}>{comment}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };
  
  // Function to determine color for status
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "green";
      case "In Progress":
        return "blue";
      case "Pending":
        return "orange";
      default:
        return "black";
    }
  };
  
  // Inline CSS styles
  
    const styles = {
        container: {
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        margin: "20px 0",
        },
        title: {
        color: "#333",
        },
    };

export default TaskDetail;


