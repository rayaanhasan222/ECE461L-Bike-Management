// Import necessary modules and components
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ProjectList from './Components/ProjectList';
import './App.css';


async function loginUser(credentials) {
  return { username: credentials.username, message: 'Login successful' };
}

// Define the NavBar component
function NavBar() {
  return (
    <nav>
      <Link to="/home">Homepage</Link> | 
      <Link to="/login">Login</Link> | 
      <Link to="/signup">Sign Up</Link> |
      <Link to="/database">Database</Link> |
      <Link to="/ProjectList">Project List</Link> |
    </nav>
  );
}

// Define the HomePage component
function HomePage() {
  const loggedInUser = localStorage.getItem('user');
  return (
    <div>
      <h1>Welcome {loggedInUser}</h1>
    </div>
  );
}

// Define the LoginPage component
function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
      e.preventDefault();
      const data = await loginUser({ username, password });
      localStorage.setItem('user', username); // Store username in local storage
      alert(data.message);
      navigate('/home'); // Redirect to home page on successful login
  };

  return (
      <div>
          <h1>Login</h1>
          <form onSubmit={handleLogin}>
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
              <Button type="submit" variant="contained">Login</Button>
          </form>
      </div>
  );
}


function SignUpPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async (e) => {
      e.preventDefault();
      const url = "http://127.0.0.1:5000/signup" 
      const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      alert(data.message);
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

// Define the App component with React Router for routing
function App() {
  return (
      <Router>
          <NavBar />
          <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/ProjectList" element={<ProjectList />} />
          </Routes>
      </Router>
  );
}



export default App;
