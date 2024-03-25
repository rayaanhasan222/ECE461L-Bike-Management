import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './HardwareSet.css';

function HardwareSet({ name, available, total }) {
  return (
    <div className="hardware-set">
      <span>{`${name}: ${available}/${total}`}</span>
      <TextField size="small" label="Enter qty" type="number" />
      <Button variant="outlined" size="small">Check In</Button>
      <Button variant="outlined" size="small">Check Out</Button>
    </div>
  );
}

export default HardwareSet;
