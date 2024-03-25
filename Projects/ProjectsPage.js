import React from 'react';
import Project from './Project';
import './ProjectsPage.css';

const projectsData = [
  { id: 1, name: 'Project Name 1', isMember: false },
  { id: 2, name: 'Project Name 2', isMember: true },
  { id: 3, name: 'Project Name 3', isMember: false },
];

function ProjectsPage() {
  return (
    <div className="projects-page">
      <h1>Projects</h1>
      {projectsData.map(project => (
        <Project key={project.id} name={project.name} isMember={project.isMember} />
      ))}
    </div>
  );
}

export default ProjectsPage;
