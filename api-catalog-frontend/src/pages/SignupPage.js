import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Grid,
  Button,
  Box,
  Divider,
  useTheme,
  Paper,
  Card
} from '@mui/material';
import HorizontalLinearStepper from '../components/HorizontalLinearStepper';

export default function SignupPage() {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    matriculeFiscale: '',
    secteurActivite: '',
    raisonSociale: '',
    adresse: '',
    nomPremierResponsable: '',
    prenomPremierResponsable: '',
    emailPremierResponsable: '',
    telPremierResponsable: '',
    nomResponsableTechnique: '',
    prenomResponsableTechnique: '',
    emailResponsableTechnique: '',
    telResponsableTechnique: '',
    ip: '',
    tel: '',
    email: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8081/signup`, formData);
      alert("Votre demande d'inscription a été soumise. Un courriel vous sera envoyé après approbation.");
      // Clear the form
      setFormData({
        matriculeFiscale: '',
        secteurActivite: '',
        raisonSociale: '',
        adresse: '',
        nomPremierResponsable: '',
        prenomPremierResponsable: '',
        emailPremierResponsable: '',
        telPremierResponsable: '',
        nomResponsableTechnique: '',
        prenomResponsableTechnique: '',
        emailResponsableTechnique: '',
        telResponsableTechnique: '',
        ip: '',
        tel: '',
        email: '',
      });
    } catch (error) {
      console.error('Signup failed:', error);
      alert("Un problème s'est produit. Veuillez réessayer.");
    }
  };

  const renderTextFields = (fields) =>
    fields.map((field) => (
      <Grid item xs={12} sm={6} key={field}>
        <TextField
          fullWidth
          required
          label={field}
          name={field}
          value={formData[field]}
          onChange={handleChange}
          className='signup-textfield'
        />
      </Grid>
    ));

  return (
    <Box sx={{ 
      p: 2, 
      maxWidth: 1400, 
      margin: '0', // Added margin top/bottom
      border: `1px solid ${theme.palette.divider}`, // Add border
      borderRadius: 2, // Rounded corners
      boxShadow: 3, // Add shadow
      position: 'relative', // Ensures proper positioning
      top: 0,
      left: 0,
      minWidth: '850px',
      backgroundColor: 'lightgray'
    }}>
      <Paper elevation={0} sx={{ 
        p: 3, 
        mb: 3,
        borderRadius: 3,
        background: 'linear-gradient(45deg,rgb(10, 0, 101) 10%,rgb(7, 3, 223) 90%)',
        color: 'white',
        boxShadow: '0 4px 20px rgba(106, 17, 203, 0.3)'
      }}>
        <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center'
            }}>
          <Typography variant="h4" component="h1" fontWeight='bold' sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
            Inscription
          </Typography>
        </Box>
      </Paper>
      <Paper elevation={0} sx={{ 
        p: 2, 
        mb: 3,
        borderRadius: 3,
        background: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        width:'1007px'
      }}>
        <HorizontalLinearStepper formData={formData} handleChange={handleChange}  handleSubmit={handleSubmit} />
      </Paper>
    </Box>
  );
}