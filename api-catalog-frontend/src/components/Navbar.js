import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Avatar, Box } from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../authentication/AuthContext';

const Navbar = () => {
  const { user } = useAuth();

  const renderUserAvatar = (username) => {
    const initials = username.slice(0, 2).toUpperCase();
    return (
      <Avatar sx={{ bgcolor: 'primary.main' }} title={username}>
        {initials}
      </Avatar>
    );
  };

  return (
    <AppBar position="fixed" color="primary">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}
        >
          RNE
        </Typography>

        <Box>
          {user ? (
            renderUserAvatar(user.username)
          ) : (
            <Button
              component={RouterLink}
              to="/login"
              color="inherit"
              startIcon={<LoginIcon />}
              variant="outlined"
              sx={{ borderColor: 'white', color: 'white' }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
