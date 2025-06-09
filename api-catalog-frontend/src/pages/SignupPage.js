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
        />
      </Grid>
    ));

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Signup
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
        {/* Company Info */}
        <Typography variant="h6" gutterBottom>Company Information</Typography>
        <Grid container spacing={2}>
          {renderTextFields([
            'matriculeFiscale',
            'secteurActivite',
            'raisonSociale',
            'adresse',
          ])}
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Premier Responsable */}
        <Typography variant="h6" gutterBottom>Premier Responsable</Typography>
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
        <Typography variant="h6" gutterBottom>Responsable Technique</Typography>
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
        <Typography variant="h6" gutterBottom>Contact Information</Typography>
        <Grid container spacing={2}>
          {renderTextFields(['ip', 'tel', 'email'])}
        </Grid>

        <Button
          type="submit"
          variant="contained"
          color="success"
          fullWidth
          sx={{ mt: 4 }}
        >
          Submit Signup Request
        </Button>
      </Box>
    </Container>
  );
}
