import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../pages/login.css'; // Ensure this file contains your custom styles
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
      const response = await axios.post('http://localhost:8081/auth/login', {
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
    <Container maxWidth="xs" className='login-container'>
      <Box
        sx={{
          mt: 8,
          p: 4,
          borderRadius: '20px', // More rounded corners
          bgcolor: 'background.paper',
          background: 'linear-gradient(145deg, #0c0372 0%, #1a0ab3 100%)', // Gradient background
          boxShadow: '0 15px 35px rgba(12, 3, 114, 0.2)', // More pronounced shadow
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)', // Hover effect
            boxShadow: '0 20px 40px rgba(12, 3, 114, 0.3)'
          }
        }}
      >
        <div>
        <Typography variant="h5" align="center" gutterBottom className='login-title'>
          Connexion
        </Typography>
        <div className='underline'></div>
        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            margin="normal"
            label="nom d'utilisateur"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="custom-textfield"
          />

          <TextField
            className="custom-textfield"
            fullWidth
            margin="normal"
            label="Mot de passe"
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
            sx={{ 
              mt: 3, 
              mb: 2,
              padding: '12px',
              borderRadius: '10px',
              background: 'linear-gradient(90deg, #6e45e2 0%, #89d4cf 100%)', // Gradient
              color: 'white',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
                background: 'linear-gradient(90deg, #6e45e2 0%, #89d4cf 100%)'
              }
            }}
          >
            Connexion
          </Button>

          <Typography variant="body2" align="center"
            sx={{ 
              color: 'rgba(255, 255, 255, 0.9)',
              mb: 3
            }}>
            Vous n'avez pas de compte?{' '}
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/signup')}
              sx={{ 
                color: '#89d4cf', // Matching accent color
                fontWeight: 600,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Créer un compte
            </Link>
          </Typography>
        </form>
        </div>
      </Box>
    </Container>
  );
}