import React from 'react';
import { Box, Typography, IconButton } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications'; 
import userAvatar from '../Images/profile.png'; 
import './header.css'; 

const Header = () => {
  return (
    <Box className="header">
      <Box className="title">
        <Typography variant="h6">
          Menu Management Dashboard
        </Typography>
      </Box>
      <Box className="user-section">
        <Typography variant="body1" className="user-name">
          Lucia Tayler
        </Typography>
        <IconButton color="inherit">
          <NotificationsIcon />
        </IconButton>
        <img src={userAvatar} alt="User Avatar" />
      </Box>
    </Box>
  );
};

export default Header;
