// src/Navbar.js

import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav>
            <Link to="/">Homepage</Link>
            <Link to="/login">Login</Link>
        </nav>
    );
}

export default Navbar;
