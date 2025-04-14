import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BSNavbar, Container, Nav, NavDropdown, Form, Button } from 'react-bootstrap';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const Navbar = ({ currentUser, darkMode, toggleDarkMode }) => {
  const [expanded, setExpanded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle user logout
  const handleLogout = async () => {
    try {
    await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Close mobile menu when a link is clicked
  const closeMenu = () => {
    setExpanded(false);
  };

  return (
    <BSNavbar 
      expand="lg" 
      fixed="top"
      expanded={expanded}
      className={`custom-navbar ${scrolled ? 'scrolled' : ''}`}
    >
      <Container>
        {/* Logo */}
        <BSNavbar.Brand as={Link} to="/" onClick={closeMenu}>
          <span className="brand-text">Uni<span className="brand-highlight">Bazaar</span></span>
        </BSNavbar.Brand>
        
        {/* Mobile toggle */}
        <div className="d-flex order-lg-last align-items-center">
          {/* Dark mode toggle */}
          <Button 
            variant="link" 
            className="nav-icon-btn me-2" 
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <i className="icon sun-icon"></i>
            ) : (
              <i className="icon moon-icon"></i>
            )}
          </Button>
          
          {/* User avatar/login button */}
          {currentUser ? (
            <NavDropdown 
              title={
                <div className="avatar-container">
                  {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt="User" className="user-avatar" />
                  ) : (
                    <div className="user-avatar-placeholder">
                      {currentUser.displayName ? currentUser.displayName.charAt(0) : currentUser.email.charAt(0)}
                    </div>
                  )}
                </div>
              }
              align="end"
              id="user-dropdown"
            >
              <NavDropdown.Item as={Link} to="/profile" onClick={closeMenu}>My Profile</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/my-listings" onClick={closeMenu}>My Listings</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          ) : (
            <Button 
              variant="primary"
              as={Link}
              to="/login"
              size="sm"
              className="login-btn me-2"
              onClick={closeMenu}
            >
              Login
            </Button>
          )}
          
          <BSNavbar.Toggle 
            aria-controls="basic-navbar-nav" 
            onClick={() => setExpanded(!expanded)}
            className="ms-2"
          />
        </div>
        
        {/* Navigation links */}
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" onClick={closeMenu}>Home</Nav.Link>
            <Nav.Link as={Link} to="/listings" onClick={closeMenu}>Browse</Nav.Link>
            <Nav.Link as={Link} to="/post" onClick={closeMenu}>Sell</Nav.Link>
            <Nav.Link as={Link} to="/about" onClick={closeMenu}>About</Nav.Link>
          </Nav>
        </BSNavbar.Collapse>
      </Container>
      
      <style jsx>{`
        .custom-navbar {
          background-color: var(--navbar-bg);
          transition: all 0.3s ease;
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--navbar-border);
        }
        
        .custom-navbar.scrolled {
          box-shadow: var(--shadow);
          padding: 0.5rem 0;
        }
        
        .brand-text {
          font-weight: 700;
          font-size: 1.5rem;
          color: var(--text-color);
        }
        
        .brand-highlight {
          color: var(--primary-color);
        }
        
        /* Fix for dark mode logo contrast */
        body.dark-mode .brand-text {
          color: white !important; /* Ensure text stays white in dark mode */
        }
        
        body.dark-mode .brand-text:active,
        body.dark-mode .brand-text:focus {
          color: white !important; /* Maintain white color when clicked/focused */
        }
        
        .nav-link {
          color: var(--text-color) !important;
          font-weight: 500;
          padding: 0.5rem 1rem !important;
          transition: color 0.2s ease;
          position: relative;
        }
        
        .nav-link:hover {
          color: var(--primary-color) !important;
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: 0;
          left: 50%;
          background-color: var(--primary-color);
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }
        
        .nav-link:hover::after {
          width: 70%;
        }
        
        .nav-icon-btn {
          background: transparent;
          border: none;
          padding: 0.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-color);
        }
        
        .nav-icon-btn:hover {
          color: var(--primary-color);
        }
        
        .icon {
          width: 20px;
          height: 20px;
          display: block;
        }
        
        .moon-icon {
          background-color: var(--text-secondary);
          mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'/%3E%3C/svg%3E");
          mask-repeat: no-repeat;
          mask-position: center;
          -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'/%3E%3C/svg%3E");
          -webkit-mask-repeat: no-repeat;
          -webkit-mask-position: center;
        }
        
        .sun-icon {
          background-color: var(--text-secondary);
          mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='5'/%3E%3Cline x1='12' y1='1' x2='12' y2='3'/%3E%3Cline x1='12' y1='21' x2='12' y2='23'/%3E%3Cline x1='4.22' y1='4.22' x2='5.64' y2='5.64'/%3E%3Cline x1='18.36' y1='18.36' x2='19.78' y2='19.78'/%3E%3Cline x1='1' y1='12' x2='3' y2='12'/%3E%3Cline x1='21' y1='12' x2='23' y2='12'/%3E%3Cline x1='4.22' y1='19.78' x2='5.64' y2='18.36'/%3E%3Cline x1='18.36' y1='5.64' x2='19.78' y2='4.22'/%3E%3C/svg%3E");
          mask-repeat: no-repeat;
          mask-position: center;
          -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='5'/%3E%3Cline x1='12' y1='1' x2='12' y2='3'/%3E%3Cline x1='12' y1='21' x2='12' y2='23'/%3E%3Cline x1='4.22' y1='4.22' x2='5.64' y2='5.64'/%3E%3Cline x1='18.36' y1='18.36' x2='19.78' y2='19.78'/%3E%3Cline x1='1' y1='12' x2='3' y2='12'/%3E%3Cline x1='21' y1='12' x2='23' y2='12'/%3E%3Cline x1='4.22' y1='19.78' x2='5.64' y2='18.36'/%3E%3Cline x1='18.36' y1='5.64' x2='19.78' y2='4.22'/%3E%3C/svg%3E");
          -webkit-mask-repeat: no-repeat;
          -webkit-mask-position: center;
        }
        
        .avatar-container {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
        }
        
        .user-avatar-placeholder {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: var(--primary-color);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .sell-btn {
          white-space: nowrap;
        }
        
        @media (max-width: 991px) {
          .navbar-nav {
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </BSNavbar>
  );
};

export default Navbar;
