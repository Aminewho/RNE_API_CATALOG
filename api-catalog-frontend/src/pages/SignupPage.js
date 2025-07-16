import React, { useState } from 'react';
import axios from 'axios';
import '../pages/signup.css';
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

      {/* Header */}
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

      {/* Main */}      
      <Card elevation={0} sx={{ 
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        overflow: 'hidden',
        background: '#2e458bff',
        boxShadow: theme.shadows[2],
        width:'825px'
      }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4,padding:3 }} >
          {/* Company Info */}
          <Typography variant="h5" gutterBottom className='info'>
            Informations sur l'entreprise
          </Typography>
          <Grid container spacing={2} >
            {renderTextFields([
              'matriculeFiscale',
              'secteurActivite',
              'raisonSociale',
              'adresse',
            ])}
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Premier Responsable */}
          <Typography variant="h5" gutterBottom className='info'>Premier Responsable</Typography>
          <Grid container spacing={2}>
            {renderTextFields([
              'nomPremierResponsable',
              'prenomPremierResponsable',
              'emailPremierResponsable',
              'telPremierResponsable',
            ])}
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Responsable Technique */}
          <Typography variant="h5" gutterBottom className='info'>Responsable Technique</Typography>
          <Grid container spacing={2}>
            {renderTextFields([
              'nomResponsableTechnique',
              'prenomResponsableTechnique',
              'emailResponsableTechnique',
              'telResponsableTechnique',
            ])}
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Contact Info */}
          <Typography variant="h5" gutterBottom className='info'>Informations de contact</Typography>
          <Grid container spacing={2}>
            {renderTextFields(['ip', 'tel', 'email'])}
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ 
              mt: 4,
              width: '100%',
              padding: '1rem',
              border: 'none',
              borderRadius: '0.5rem',
              background: 'linear-gradient(45deg,rgba(14, 0, 172, 1) 10%,rgba(21, 0, 210, 1) 90%)',
              color: 'var(--white)',
              fontSize: '1.25rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginTop: '0.5rem',
              '&:hover':{
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)'
              },
              '&:active':{
                transform: 'translateY(0)'
              }
              } }
            
          >
            Envoyer une demande d'inscription
          </Button>
        </Box>
      </Card>
    </Box>
  );
}