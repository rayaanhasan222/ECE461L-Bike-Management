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
      {projects.map((project, index) => (
        <Project key={index} projectId={`${index + 1}`} name={project.name} users={project.users} />
      ))}
    </div>
  );
};

export default ProjectList;
