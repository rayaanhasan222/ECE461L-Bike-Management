import React from 'react';
import './Project.css'; // Import the CSS file

const ProjectDetails = ({projectName, description}) => {

  return (
    <div className="project-details">
      <h3>{projectName}</h3>
      <p>{description}</p>
    </div>
  );
};

export default ProjectDetails;