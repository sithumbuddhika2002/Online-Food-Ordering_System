import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Menu, MenuItem } from '@mui/material'; // Updated import
import SearchIcon from '@mui/icons-material/Search'; // Updated import
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; // Updated import
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Updated import
import HomeIcon from '@mui/icons-material/Home'; // Updated import
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'; // Updated import
import InfoIcon from '@mui/icons-material/Info'; // Updated import
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary'; // Updated import
import ContactMailIcon from '@mui/icons-material/ContactMail'; // Updated import
import { Link, useNavigate } from 'react-router-dom';
import logo from '../Images/logo.png';
import './header.css';
import { jwtDecode } from 'jwt-decode';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [firstName, setFirstName] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const fetchUserName = async () => {
        try {
          const response = await fetch('http://localhost:3002/user-first-name', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();

          if (response.ok) {
            setFirstName(data.firstName); // Set the user's first name
          }
        } catch (error) {
          console.error('Error fetching user name:', error);
        }
      };

      fetchUserName();
    }
  }, [token]);

  // Open Menu when profile icon is clicked
  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close Menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('firstName');
    handleClose();
    navigate('/login');
  };

  const handleManageProfile = () => {
    handleClose();
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      navigate(`/manage-profile/${userId}`);
    }
  };

  return (
    <Box className="header-container">
      <Box className="guest_header">
        <Box className="contact-section">
          <Typography variant="body1">
            Order Online or Call Now: <br />
            0717901354 / 0703399599
          </Typography>
        </Box>

        <Box className="logo-section">
          <img src={logo} alt="Logo" className="logo" />
        </Box>

        <Box className="icon-section">
          <IconButton color="inherit">
            <SearchIcon />
          </IconButton>
          <IconButton color="inherit">
            <ShoppingCartIcon />
          </IconButton>

          {/* Display profile icon and greeting if user is logged in */}
          {token && (
            <>
              <IconButton color="inherit" onClick={handleProfileClick}>
                <AccountCircleIcon />
              </IconButton>
              <Typography variant="body1" style={{ marginLeft: '8px', color: '#fff' }}>
                Hi, {firstName || 'User'} {/* Display greeting */}
              </Typography>
            </>
          )}

          {/* Profile Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {token ? (
              <>
                <MenuItem onClick={handleManageProfile}>Manage Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </>
            ) : (
              <MenuItem onClick={() => navigate('/login')}>Login</MenuItem>
            )}
          </Menu>
        </Box>
      </Box>

      {/* Navbar section */}
      <Box className="navbar-container" style={{ paddingBottom: '10px' }}>
        <Box className="navbar">
          <Box display="flex" alignItems="center" className="nav-item">
            <HomeIcon style={{ marginRight: '5px' }} />
            <Typography variant="body1">
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" className="nav-item">
            <RestaurantMenuIcon style={{ marginRight: '5px' }} />
            <Typography variant="body1">
              <Link to="/menu" style={{ textDecoration: 'none', color: 'inherit' }}>Menu & Order Online</Link>
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" className="nav-item">
            <InfoIcon style={{ marginRight: '5px' }} />
            <Typography variant="body1">
              <Link to="/about" style={{ textDecoration: 'none', color: 'inherit' }}>About Us</Link>
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" className="nav-item">
            <PhotoLibraryIcon style={{ marginRight: '5px' }} />
            <Typography variant="body1">
              <Link to="/gallery" style={{ textDecoration: 'none', color: 'inherit' }}>Gallery</Link>
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" className="nav-item">
            <ContactMailIcon style={{ marginRight: '5px' }} />
            <Typography variant="body1">
              <Link to="/contact" style={{ textDecoration: 'none', color: 'inherit' }}>Contact</Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
