import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashbord'
import ProjectManagement from './pages/Project-Management'
import Task from './pages/Task'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'
 import ProtectRoute from './pages/ProtectRoute'
 import TaskDetail from './pages/TaskDetail'
function App() {


  return (
    <>
  <Router>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard/>} />
      <Route path="/project-management" element={<ProtectRoute><ProjectManagement/></ProtectRoute>} />
      <Route path="/task" element={<ProtectRoute><Task/></ProtectRoute>} />
    {  <Route path="/task/:id" element={<ProtectRoute><TaskDetail /> </ProtectRoute>} />}
      </Routes>
    </Router>
    </>
  )
}

export default App
