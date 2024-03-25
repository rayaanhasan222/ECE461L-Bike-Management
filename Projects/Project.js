import React from 'react';
import HardwareSet from './HardwareSet';
import Button from '@mui/material/Button';
import './Project.css';

function Project({ name, isMember }) {
  return (
    <div className={`project ${isMember ? 'member' : ''}`}>
      <h2>{name}</h2>
      <p>list, of, authorized, users</p>
      <div className="hardware-sets">
        <HardwareSet name="HWSet1" available={50} total={100} />
        <HardwareSet name="HWSet2" available={0} total={100} />
      </div>
      <Button variant="contained" color="primary">
        {isMember ? 'Leave' : 'Join'}
      </Button>
    </div>
  );
}

export default Project;
