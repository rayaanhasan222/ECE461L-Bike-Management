// HWSet.js
import React, {useState} from 'react';
import Button from '@mui/material/Button'; // Import Material UI Button
import TextField from '@mui/material/TextField'; // Import Material UI TextField
import './Project.css'; // Import the CSS file

    

const HWSet = ({ hwSetName, projectId, handleCheckIn, handleCheckOut, handleJoinProject, handleLeaveProject, userID}) => {
  const [quantity, setQuantity] = useState(0);
  const[isJoined, setIsJoined] = useState(false);

  const handleChange = (event) => {
    setQuantity(event.target.value);
  };

  const toggleJoinLeave = () => {
    if (isJoined) {
      handleLeaveProject(projectId);
    } else {
      handleJoinProject(projectId);
    }
    setIsJoined(!isJoined);
  };

  return (
    <div className="hw-set">
      <div className ="hw-setdetails">
        <h3>{hwSetName}:</h3>
        <span>{quantity}/100</span>
      </div>

      <TextField
          type="number"
          label="Enter quantity"
          variant="outlined"
          value = {quantity}
          onChange = {handleChange}
        />
      <Button variant="contained" onClick={() => handleCheckIn(projectId, parseInt(quantity), userID, hwSetName)}>
        Check-in
      </Button>
      <Button variant="contained" onClick={() => handleCheckOut(projectId, parseInt(quantity), userID, hwSetName)}>
        Check-out
      </Button>
      <Button variant="contained" onClick={toggleJoinLeave}>
        {isJoined ? 'Leave' : 'Join'}
      </Button>
    </div>
  );
};

export default HWSet;
