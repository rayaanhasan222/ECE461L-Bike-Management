// Project.js
import React, { useState } from 'react';
import './Project.css'; // Import the CSS file
import ProjectDetails from './ProjectDetails';
import HWSet from './HWSet';



const Project = ({ projectId, projectName, projectDescription }) => {

  const currentUsername = localStorage.getItem('user') || 'guest';
  
  const handleCheckIn = async (projectId, qty, userid, hwset, callback) => {
    try {
        const response = await fetch(`http://127.0.0.1:5000/checkin/${projectId}?qty=${qty}&userid=${userid}&hwset=${hwset}`, { method: 'POST' });
        const data = await response.json();
        alert(data.message);
        if (response.ok && callback) {
            callback();  // Call the callback function to trigger state change and re-fetch availability
        }
    } catch (error) {
        console.error('Error checking in hardware:', error);
    }
};

const handleCheckOut = async (projectId, qty, userid, hwset, callback) => {
    try {
        const response = await fetch(`http://127.0.0.1:5000/checkout/${projectId}?qty=${qty}&userid=${userid}&hwset=${hwset}`, { method: 'POST' });
        const data = await response.json();
        alert(data.message);
        if (response.ok && callback) {
            callback();  // Call the callback function to trigger state change and re-fetch availability
        }
    } catch (error) {
        console.error('Error checking out hardware:', error);
    }
};


  const handleLeaveProject = async (projectId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/leave/${projectId}`, { method: 'POST' });
      const data = await response.json();
      alert(data.message); // Show the message in a popup
    } catch (error) {
      console.error('Error leaving project:', error);
      // Handle errors
    }
  };
  
   

  return (
    <div className="project-container">
      <ProjectDetails projectName={projectName} description={projectDescription} />
      <div className="HW-container">
        <HWSet
          hwSetName="HWSet1"
          projectId = {projectId}
          handleCheckIn={handleCheckIn}
          handleCheckOut={handleCheckOut}
          handleLeaveProject={handleLeaveProject}
          userID = {currentUsername}
          />
        <HWSet
          hwSetName="HWSet2"
          projectId = {projectId}
          handleCheckIn={handleCheckIn}
          handleCheckOut={handleCheckOut}
          handleLeaveProject={handleLeaveProject}
          userID = {currentUsername}
        />
      </div>
    </div>
  );
};

export default Project;