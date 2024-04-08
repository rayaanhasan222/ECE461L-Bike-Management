// HWSet.js
import React, {useState, useEffect} from 'react';
import Button from '@mui/material/Button'; // Import Material UI Button
import TextField from '@mui/material/TextField'; // Import Material UI TextField
import './Project.css'; // Import the CSS file

    

const HWSet = ({ hwSetName, projectId, handleCheckIn, handleCheckOut, handleJoinProject, handleLeaveProject}) => {
  const [quantity, setQuantity] = useState(0);
  const [availability, setAvailability] = useState(0);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/availability/${projectId}`);
        if (response.ok) {
          const project = await response.json();
          // Assuming the backend returns the project document with HWSet1Available and HWSet2Available fields
          const available = hwSetName === "HWSet1" ? project.HWSet1Available: project.HWSet2Available;
          setAvailability(available);
        } else {
          console.error('Failed to fetch project availability');
        }
      } catch (error) {
        console.error('Error fetching project availability:', error);
      }
    };

    fetchAvailability();
  }, [projectId, hwSetName]);

  const handleChange = (event) => {
    setQuantity(event.target.value);
  };

  return (
    <div className="hw-set">
      <div className ="hw-setdetails">
        <h3>{hwSetName}:</h3>
        <span>{availability}/100</span>
      </div>

      <TextField
          type="number"
          label="Enter quantity"
          variant="outlined"
          value = {quantity}
          onChange = {handleChange}
        />
      <Button variant="contained" onClick={() => handleCheckIn(projectId, parseInt(quantity))}>
        Check-in
      </Button>
      <Button variant="contained" onClick={() => handleCheckOut(projectId, parseInt(quantity))}>
        Check-out
      </Button>
    </div>
  );
};

export default HWSet;
