import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../authentication/AuthContext';
import api from '../api'; // Ensure this points to your Axios instance with interceptors set up
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Link
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function LoginPage() {
  const navigate = useNavigate();
  const { fetchUser } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/auth/login', {
        username,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      // Save the JWT token to localStorage
      const token = response.data.token;
      console.log('token:', token);
      localStorage.setItem('token', token);
  
      // Set token in default Axios header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
      // Now fetch user info using /me (with token automatically attached)
      await fetchUser();
  
      // Extract role from the decoded token or fetchUser result
      const role = response.data.roles;
      console.log('Login successful, role:', role[0]);
  
      if (role[0] === 'ROLE_ADMIN') {
        navigate('/admin');
      } else if (role[0] === 'ROLE_USER') {
        navigate('/user');
      } else {
        alert('Unknown role, cannot navigate.');
      }
  
    } catch (err) {
      alert('Login failed: ' + (err.response?.data?.message || err.message));
    }
  };
  

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          mt: 8,
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label="Password"
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                    tabIndex={-1}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, mb: 1 }}
          >
            Login
          </Button>

          <Typography variant="body2" align="center">
            Don’t have an account?{' '}
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/signup')}
            >
              Signup Instead
            </Link>
          </Typography>
        </form>
      </Box>
    </Container>
  );
}
