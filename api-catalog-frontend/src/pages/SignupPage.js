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
} from '@mui/material';

export default function SignupPage() {
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
      await axios.post(`http://localhost:8080/signup`, formData);
      alert("Your signup request has been submitted. An email will be sent upon approval.");
    } catch (error) {
      console.error('Signup failed:', error);
      alert("Something went wrong. Please try again.");
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
    <>
    <Container maxWidth="md" sx={{ mt: 5 }} className='signup-container'>
      <Typography variant="h4" align="center" gutterBottom className='signup-title'>
        Inscription
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }} >
        {/* Company Info */}
        <Typography variant="h6" gutterBottom className='info'>Informations sur l'entreprise</Typography>
        <Grid container spacing={2} >
          {renderTextFields([
            'matriculeFiscale',
            'secteurActivite',
            'raisonSociale',
            'adresse',
          ])}
        </Grid>

        <Divider sx={{ my: 4 }}  />

        {/* Premier Responsable */}
        <Typography variant="h6" gutterBottom className='info'>Premier Responsable</Typography>
        <Grid container spacing={2}>
          {renderTextFields([
            'nomPremierResponsable',
            'prenomPremierResponsable',
            'emailPremierResponsable',
            'telPremierResponsable',
          ])}
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Responsable Technique */}
        <Typography variant="h6" gutterBottom className='info'>Responsable Technique</Typography>
        <Grid container spacing={2}>
          {renderTextFields([
            'nomResponsableTechnique',
            'prenomResponsableTechnique',
            'emailResponsableTechnique',
            'telResponsableTechnique',
          ])}
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Contact Info */}
        <Typography variant="h6" gutterBottom className='info'>Informations de contact</Typography>
        <Grid container spacing={2}>
          {renderTextFields(['ip', 'tel', 'email'])}
        </Grid>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 4,
            width: '100%',
            padding: '1rem',
            border: 'none',
            borderRadius: '0.5rem',
            background: 'linear-gradient(90deg, var(--primary-light) 0%, var(--accent) 100%)',
            color: 'var(--white)',
            fontSize: '1rem',
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
    </Container>
    <footer className='footer'></footer>
    </>
  );
}