


  import React from 'react';
  import { Link } from 'react-router-dom';


    const Home = () => {    
        return (
            <div>
                <h1>Home Page</h1>

              
                <nav style={{ backgroundColor: '#333', padding: '10px', textAlign: 'center' }}>
                <Link to="/register" style={{ color: 'white', marginRight: '10px' }}>Register</Link>
                <Link to="/login" style={{ color: 'white', marginRight: '10px' }}>Login</Link>
                <Link to="/dashboard" style={{ color: 'white', marginRight: '10px' }}>Dashboard</Link>
                <Link to="/project-management" style={{ color: 'white', marginRight: '10px' }}>Project Management</Link>
                <Link to="/task" style={{ color: 'white', marginRight: '10px' }}>Task</Link>
            </nav>
 
            </div>
        )
    }

    export default Home;