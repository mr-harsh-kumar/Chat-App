import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LoginModal, SignupModal } from './Modal'; // Import your modal components
import './navbar.css'; // Import your navbar styles
import $ from 'jquery';

export default function Navbar() {
    const [activeLink, setActiveLink] = useState('');
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);
    const [showOptions, setShowOptions] = useState(false);

 const [hoveredLink, setHoveredLink] = useState(null);

    const handleLinkClick = (link) => {
        setActiveLink(link);
    };

    const openLoginModal = () => {
        setActiveLink('/login');
        setShowLoginModal(true);
    };

    const closeLoginModal = () => {
        setShowLoginModal(false);
    };

    const openSignupModal = () => {
        setActiveLink('/signup');
        setShowSignupModal(true);
    };

    const closeSignupModal = () => {
        setShowSignupModal(false);
        
    };

    const handleClick = (event) => {
        event.currentTarget.classList.toggle("change");
        setShowOptions(!showOptions); // Toggle showOptions state
    };

    const isLoggedIn = localStorage.getItem('user');
    
    const linkStyles = (isActive, isHovered) => ({
        color: isActive || isHovered ? 'rgb(84, 223, 227)' : 'white',
        transition: 'color 0.3s ease',
    });
    return (
        <>
            <div className="navbar-body">
                <nav className="navbar navbar-expand-lg navbar-light">
                    <Link className="navbar-brand" style={{ fontSize: '28px', color: activeLink === '/home' ? 'rgb(84, 223, 227)' : 'white' }} onClick={() => handleLinkClick('/home')} to="">HK ChatApp</Link>
                    
                    <button className="navbar-toggler" type="button" style={{ color: 'rgb(84, 223, 227)' }} data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="menu" onClick={handleClick} >
                            <div className="bar1"></div>
                            <div className="bar2"></div>
                            <div className="bar3"></div>
                        </span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item" id="my-links">
                            <Link 
                                className={`nav-link ${activeLink === '/about' ? 'active' : ''}`} 
                                onClick={() => handleLinkClick('/about')} 
                                to="/about"
                                style={linkStyles(activeLink === '/about', hoveredLink === '/about')}
                                onMouseEnter={() => setHoveredLink('/about')}
                                onMouseLeave={() => setHoveredLink(null)}
                            >
                                About
                            </Link> 
                            </li>
                            <li className="nav-item" id="my-links">
                            <Link 
                                className={`nav-link ${activeLink === '/chat_app' ? 'active' : ''}`} 
                                onClick={() => handleLinkClick('/chat_app')} 
                                to="/chat_app"
                                style={linkStyles(activeLink === '/chat_app', hoveredLink === '/chat_app')}
                                onMouseEnter={() => setHoveredLink('/chat_app')}
                                onMouseLeave={() => setHoveredLink(null)}
                            >
                                Chat-App
                            </Link> 
                            </li>
                            {!isLoggedIn ? (
                <li className="nav-item" id="my-links">
                      <Link 
                                        className={`nav-link ${activeLink === '/login' ? 'active' : ''}`} 
                                        onClick={openLoginModal}
                                        style={linkStyles(activeLink === '/login', hoveredLink === '/login')}
                                        onMouseEnter={() => setHoveredLink('/login')}
                                        onMouseLeave={() => setHoveredLink(null)}
                                    >
                                        Login
                    </Link>
                </li>
            ) : null}
                            <li className="nav-item" id="my-links">
                            <Link 
                                    className={`nav-link ${activeLink === '/signup' ? 'active' : ''}`} 
                                    onClick={openSignupModal}
                                    style={linkStyles(activeLink === '/signup', hoveredLink === '/signup')}
                                    onMouseEnter={() => setHoveredLink('/signup')}
                                    onMouseLeave={() => setHoveredLink(null)}
                                >
                                    Signup
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>

            {/* Render the Login Modal */}
            <LoginModal showModal={showLoginModal} closeModal={closeLoginModal} />

            {/* Render the Signup Modal */}
            <SignupModal showModal={showSignupModal} closeModal={closeSignupModal} openLoginModal={() => setShowLoginModal(true)}/>
        </>
    );
}
