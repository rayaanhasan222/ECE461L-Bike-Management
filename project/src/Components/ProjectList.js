import React from 'react';
import Project from './Project';
import { useState, useEffect } from 'react';
import './Project.css'; // Import the CSS file



const ProjectList = () => {
  const [projects, setProjects] = React.useState([]);
  const [enterProjectName, setEnterProjectName] = useState('');
  const [enterProjectID, setEnterProjectID] = useState(''); 
  const [enterProjectDescription, setEnterProjectDescription] = useState('');
  const [joinProjectId, setJoinProjectId] = React.useState('');

  const currentUsername = localStorage.getItem('user') || 'guest';
  
  useEffect(() => {
    const fetchProjects = async () => {

      if(currentUsername == 'guest'){
        console.log('No user logged in')
        return;
      }

      try {
        const
        //fetch the list of project IDs the user is part of 
        response = await fetch(`http://127.0.0.1:5000/projectsJoined?userName=${currentUsername}`);
        if (response.ok) {
          const data = await response.json();
          setProjects(data.projectIDs);
        } else {
          alert('Failed to fetch projects');
        }
      } catch (error) {
        alert('An error occurred while fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  

  const handleJoinProject = async (e) => {
    e.preventDefault();
    try {
      // Send a request to the backend to join the project with the given projectId
      const response = await fetch(`/api/projects/${joinProjectId}`, {
        method: 'POST',
        // Add any necessary headers and body to the request
      });
      if (response.ok) {
        // If the request is successful, load the project page with the joined project
        // You can use React Router or any other method to navigate to the project page
        alert(`Joined project with ID: ${joinProjectId}`);
      } else {
        // Handle the case when the request fails
        alert('Failed to join project');
      }
      // Reset the input field
      setJoinProjectId('');
    } catch (error) {
      alert('An error occurred while joining the project:', error);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    // Send a request to the backend to create a project with project details
    const url = "http://127.0.0.1:5000/create" 
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enterProjectName, enterProjectID, enterProjectDescription })
    });
    const data = await response.json();

    // Display the response message
    alert(data.message);


    setEnterProjectName('');
    setEnterProjectID('');
    setEnterProjectDescription('');
    
  };

  return (
    <div className="projectlist">
      
      <form>
        <input type="text" placeholder="Enter Project ID" value={joinProjectId} onChange={(e) => setJoinProjectId(e.target.value)} />
        <button type="submit" onClick={handleJoinProject}>Join</button>
      </form>
      <form>
        <input type="text" placeholder="Enter Project Name" value={enterProjectName} onChange={(e) => setEnterProjectName(e.target.value)}/>
        <input type="text" placeholder="Enter Project ID" value={enterProjectID} onChange={(e) => setEnterProjectID(e.target.value)}/>
        <input type="text" placeholder="Enter Project Description" value={enterProjectDescription} onChange={(e) => setEnterProjectDescription(e.target.value)}/>
        <button type="submit" onClick ={handleCreateProject}>Create</button>
      </form>
      {projects.map((project, index) => (
        //Each project component intakes projectID, project name, and users
        <Project 
          key={index} 
          projectId={project.projectID} 
          name={project.projectName} 
          users={project.projectDescription} />
      ))}
    </div>
  );
};

export default ProjectList;