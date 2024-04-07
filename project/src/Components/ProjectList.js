import React from 'react';
import Project from './Project';
import { useState } from 'react';
import './Project.css'; // Import the CSS file



const ProjectList = () => {
  const [projects, setProjects] = React.useState([]);
  // Creating a project
  const [enterProjectName, setEnterProjectName] = useState('');
  const [enterProjectID, setEnterProjectID] = useState(''); 
  const [enterProjectDescription, setEnterProjectDescription] = useState('');
  // Joining a project
  const [joinProjectId, setJoinProjectId] = React.useState('');

  const YOUR_USERNAME = 'YOUR_USERNAME'; // Replace YOUR_USERNAME with your username
  React.useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/projectsJoined?userName=${YOUR_USERNAME}`);
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
    const url = "http://127.0.0.1:5000/join" 
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ joinProjectId })
    });
    const data = await response.json();

    // Display the response message
    alert(data.message);

    // Clear text field
    setJoinProjectId('');
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
        <Project key={index} projectId={`${index + 1}`} name={project.name} users={project.users} />
      ))}
    </div>
  );
};

export default ProjectList;
