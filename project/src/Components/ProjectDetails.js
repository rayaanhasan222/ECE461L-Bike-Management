import React from 'react';
import './Project.css'; // Import the CSS file

<<<<<<< HEAD
const ProjectDetails = ({name}) => {

  return (
    <div className="project-details">
      <h3>{name}</h3>
=======
const ProjectDetails = ({projectName, description}) => {

  return (
    <div className="project-details">
      <h3>{projectName}</h3>
      <p>{description}</p>
>>>>>>> main
    </div>
  );
};

export default ProjectDetails;