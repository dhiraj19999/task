import { useState, useEffect } from "react";
import axios from "axios";

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://task-2-3z5h.onrender.com/api/v1/users/userprojects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(response.data);
    } catch (error) {
      setError("Failed to fetch projects");
    }
  };

  // Create a new project
  const createProject = async (e) => {
    e.preventDefault();
    if (!projectName) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post("https://task-2-3z5h.onrender.com/api/v1/users/createproject", { name: projectName }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects([...projects, response.data]);
      setProjectName("");
      console.log(response.data);
    } catch (error) {
      setError("Failed to create project");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="project-container">
      <h2>Project Management</h2>
      {error && <p className="error">{error}</p>}
      
      <form onSubmit={createProject}>
        <input 
          type="text" 
          value={projectName} 
          onChange={(e) => setProjectName(e.target.value)} 
          placeholder="Enter project name" 
          required 
        />
        <button type="submit" disabled={loading}>Create Project</button>
      </form>

      <ul>
        {projects.map((project) => (
          <li key={project._id}>
            {project.name}
           
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectManagement;
