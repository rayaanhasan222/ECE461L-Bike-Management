// Project.js
import React, { useState } from 'react';
import './Project.css'; // Import the CSS file
import ProjectDetails from './ProjectDetails';
import HWSet from './HWSet';

const Project = ({ projectId, name, users }) => {

  const currentUsername = localStorage.getItem('user') || 'guest';
  const handleCheckIn = async (projectId, qty, userid, hwset) => {
    try {
      const response = await fetch(`http://localhost:5000/checkin/${projectId}?qty=${qty}&userid=${userid}&hwset=${hwset}`, { method: 'POST' });
      const data = await response.json();
      alert(data.message); // Show the message in a popup
    } catch (error) {
      console.error('Error checking in hardware:', error);
      // Handle errors (e.g., show an error message)
    }
  };
  
  const handleCheckOut = async (projectId, qty, userid, hwset) => {
    try {
      const response = await fetch(`http://localhost:5000/checkout/${projectId}?qty=${qty}&userid=${userid}&hwset=${hwset}`, { method: 'POST' });
      const data = await response.json();
      alert(data.message); // Show the message in a popup
    } catch (error) {
      console.error('Error checking out hardware:', error);
      // Handle errors
    }
  };

  const handleJoinProject = async (projectId) => {
    try {
      const response = await fetch(`http://localhost:5000/join/${projectId}`, { method: 'POST' });
      const data = await response.json();
      alert(data.message); // Show the message in a popup
    } catch (error) {
      console.error('Error joining project:', error);
      // Handle errors
    }
  };

  const handleLeaveProject = async (projectId) => {
    try {
      const response = await fetch(`http://localhost:5000/leave/${projectId}`, { method: 'POST' });
      const data = await response.json();
      alert(data.message); // Show the message in a popup
    } catch (error) {
      console.error('Error leaving project:', error);
      // Handle errors
    }
  };
  
  
  

  return (
    <div className="project-container">
      <ProjectDetails name={name} users={users} />
      <div className="HW-container">
        <HWSet
          hwSetName="HWSet1"
          projectId = {projectId}
          handleCheckIn={handleCheckIn}
          handleCheckOut={handleCheckOut}
          handleJoinProject={handleJoinProject}
          handleLeaveProject={handleLeaveProject}
          userID = {currentUsername}
          />
        <HWSet
          hwSetName="HWSet2"
          projectId = {projectId}
          handleCheckIn={handleCheckIn}
          handleCheckOut={handleCheckOut}
          handleJoinProject={handleJoinProject}
          handleLeaveProject={handleLeaveProject}
          userID = {currentUsername}
        />
      </div>
    </div>
  );
};

export default Project;