import React from 'react';
import './Project.css'; // Import the CSS file

const ProjectDetails = ({name, users}) => {

  return (
    <div className="project-details">
      <h3>{name}</h3>
      <ul >
          {/* {users.map((user, index) => (
          <li key={index}>{user}</li>
          ))} */}
      </ul>
    </div>
  );
};

export default ProjectDetails;