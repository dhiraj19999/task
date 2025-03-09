import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token from local storage
        if (!token) {
            console.error("No token found!");
            return;
          }
      
        const response = await axios.get('https://task-2-3z5h.onrender.com/api/v1/users/usertasks', {
            headers: {
                Authorization: `Bearer ${token}`,  // Send the token in the Authorization header
              },
        });
        setTasks(response.data);
        console.log(response.data);
      } catch (error) {
        setError('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Your Assigned Tasks</h2>
      <div>
        {tasks.length === 0 ? (
          <p>No tasks assigned yet!</p>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li key={task._id}>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p>Status: {task.status}</p>
                <p>Assigned on: {new Date(task.createdAt).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

