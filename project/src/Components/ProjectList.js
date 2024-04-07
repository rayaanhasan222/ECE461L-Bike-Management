import React from 'react';
import Project from './Project';
import './Project.css'; // Import the CSS file


const ProjectList = () => {
  const projects = [
    { name: 'Project 1', users: ['User 1', 'User 2'] },
    { name: 'Project 2', users: ['User 3', 'User 4'] },
    { name: 'Project 3', users: ['User 5', 'User 6'] }
  ];

  return (
    <div className="projectlist">
      <form>
        <input type="text" placeholder="Enter Project ID" />
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
