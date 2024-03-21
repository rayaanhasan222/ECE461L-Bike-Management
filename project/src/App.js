// Import necessary modules and components
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './App.css';

// Define the EnterQty component
function EnterQty(props) {
  return <TextField label={props.input} variant="filled" size='small' className='text' />;
}

// Define the Enter component
function Enter(props) {
  const [buttonText, setButtonText] = useState('Sign Up ');

  function clickButton(e) {
    e.preventDefault();
    setButtonText(buttonText === 'Join ' ? 'Leave ' : 'Join ');
  }

  return <Button variant="contained" onClick={clickButton}>{buttonText}{props.pname}</Button>;
}

// Define the NavBar component
function NavBar() {
  return (
    <nav>
      <Link to="/home">Homepage</Link> | 
      <Link to="/login">Login</Link> | 
      <Link to="/signup">Sign Up</Link> |
      <Link to="/database">Database</Link>
    </nav>
  );
}

// Define the HomePage component
function HomePage() {
  return <div><h1>Homepage</h1></div>;
}

// Define the LoginPage component
function LoginPage() {
  return (
    <div className="Login">
      <h1>Returning User Login</h1>
      <div className="inputBox">
        <EnterQty input='Username' />
        <EnterQty input='Password' />
        <Enter pname='' />
      </div>
    </div>
  );
}

function SignUpPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async (e) => {
      e.preventDefault();
      const response = await fetch('/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      console.log(data);
      // Redirect to login or home page on successful sign-up
  };

  return (
      <div>
          <h1>Sign Up</h1>
          <form onSubmit={handleSignUp}>
              <TextField
                  label="Username"
                  variant="filled"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  size="small"
                  className="text"
              />
              <TextField
                  label="Password"
                  type="password"
                  variant="filled"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  size="small"
                  className="text"
              />
              <Button type="submit" variant="contained">Sign Up</Button>
          </form>
      </div>
  );
}


function DatabasePage() {
  const [usernames, setUsernames] = useState([]);

  useEffect(() => {
      fetch('/database')
          .then(response => response.json())
          .then(data => setUsernames(data))
          .catch(error => console.error('Error fetching data:', error));
  }, []);  // The empty array ensures this effect runs only once after the component mounts

  return (
      <div>
          <h1>User Database</h1>
          <ul>
              {usernames.map((username, index) => (
                  <li key={index}>{username}</li>
              ))}
          </ul>
      </div>
  );
}




// Define the App component with React Router for routing
function App() {
  return (
      <Router>
          <NavBar />
          <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/database" element={<DatabasePage />} />
              <Route path="/" element={<HomePage />} />
          </Routes>
      </Router>
  );
}



export default App;
