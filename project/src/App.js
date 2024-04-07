// Import necessary modules and components
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ProjectList from './Components/ProjectList';
import './App.css';


// Define the NavBar component
function NavBar({ username }) {
  return (
    <nav>
      <Link to="/home">Homepage</Link> | 
      <Link to="/login">Login</Link> | 
      <Link to="/signup">Sign Up</Link> |
      <Link to="/ProjectList">Project List</Link> |
      <div style={{ float: 'right' }}>
        {username}
      </div>
    </nav>
  );
}

// Define the HomePage component
function HomePage({logout}) {

  const loggedInUser = localStorage.getItem('user') || 'guest';
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page on logout
  };

  return (
    <div>
      <h1>Welcome {loggedInUser}</h1>
      {loggedInUser && loggedInUser !== 'guest' && <Button onClick={handleLogout} variant="contained">Logout</Button>}
    </div>
  );
}

// Define the LoginPage component
function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (response.ok) {
        onLoginSuccess(username);
        alert(data.message);
        navigate('/home'); // Redirect to home page on successful login
      } else {
        alert(data.message);
        setUsername(username); // Update the username in the state
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred during login.');
    }
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
    try {
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
    } catch (error) {
      console.error(error);
      alert('An error occurred during sign-up.');
    }
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

  const [username, setUsername] = useState('guest');

  useEffect(() => {
    // Check local storage for user info
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUsername(storedUser);
    }
  }, []);

  const handleLoginSuccess = (username) => {
    localStorage.setItem('user', username);
    setUsername(username);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUsername('guest'); // Update the username state to 'guest'
  };

  return (
      <Router>
          <NavBar username={username} />
          <Routes>
              <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess}/>} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/home" element={<HomePage logout={logout}/>} />
              <Route path="/ProjectList" element={<ProjectList />} />
              <Route path="/" element={<HomePage logout={logout} />} />
          </Routes>
      </Router>
  );
}



export default App;
