import React from 'react';
import Project from './Project';
import './Project.css'; // Import the CSS file


  
const ProjectList = () => {
  const [projects, setProjects] = React.useState([]);

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

  const [joinProjectId, setJoinProjectId] = React.useState('');

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

  return (
    <div className="projectlist">
      <form>
        <input type="text" placeholder="Enter Project ID" value={joinProjectId} onChange={(e) => setJoinProjectId(e.target.value)} />
        <button type="submit" onClick={handleJoinProject}>Join</button>
      </form>
      <form>
        <input type="text" placeholder="Enter Project Name" />
        <input type="text" placeholder="Enter Project ID" />
        <input type="text" placeholder="Enter Project Description" />
        <button type="submit">Create</button>
      </form>
      {projects.map((project, index) => (
        <Project key={index} projectId={`${index + 1}`} name={project.name} users={project.users} />
      ))}
    </div>
  );
};

export default ProjectList;
