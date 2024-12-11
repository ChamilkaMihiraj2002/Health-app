import React, { useState } from 'react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="navbar navbar-expand-md navbar-light bg-white shadow-sm">
            <div className="container">
                {/* Logo */}
                <a className="navbar-brand fw-bold text-primary" href="/">
                    MediCare
                </a>

                {/* Mobile Toggle Button */}
                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-controls="navbarResponsive"
                    aria-expanded={isMenuOpen}
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navigation Links */}
                <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarResponsive">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link text-dark" href="/">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-dark" href="/about">About</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-dark" href="/contact">Contact Us</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-dark" href="/appointments">Appointments</a>
                        </li>
                    </ul>

                    {/* Auth Buttons */}
                    <div className="d-flex">
                        <a href="/login" className="btn btn-outline-primary me-2">Login</a>
                        <a href="/register" className="btn btn-primary">Register</a>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;