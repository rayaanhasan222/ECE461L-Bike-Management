import React from 'react';
import './Project.css'; // Import the CSS file

const ProjectDetails = ({name}) => {

  return (
    <div className="project-details">
      <h3>{name}</h3>
    </div>
  );
};

export default ProjectDetails;