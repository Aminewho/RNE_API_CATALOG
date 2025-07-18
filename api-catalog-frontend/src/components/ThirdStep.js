import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';

const FormContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  margin: '0 auto'
}));

const FormTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  color: theme.palette.text.primary,
  fontWeight: 500
}));

export default function ThirdStep({ formData, handleChange, onStepComplete }) {

  React.useEffect(() => {
    const allFilled =
      formData.nomResponsableTechnique.trim() !== '' &&
      formData.prenomResponsableTechnique.trim() !== '' &&
      formData.emailResponsableTechnique.trim() !== '' &&
      formData.telResponsableTechnique.trim() !== '';

    onStepComplete(allFilled);
  }, [
    formData.nomResponsableTechnique,
    formData.prenomResponsableTechnique,
    formData.emailResponsableTechnique,
    formData.telResponsableTechnique,
    onStepComplete,
  ]);


  return (
    <FormContainer>
      <FormTitle variant="h5" gutterBottom>
        Informations de Responsable Technique
      </FormTitle>
      <Box
        component="form"
        sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
        noValidate
        autoComplete="off"
      >
        <TextField
          label="Nom"
          name="nomResponsableTechnique"
          value={formData.nomResponsableTechnique}
          onChange={handleChange}
          size="small"
        />
        <TextField
          label="Prenom"
          name="prenomResponsableTechnique"
          value={formData.prenomResponsableTechnique}
          onChange={handleChange}
          size="small"
        />
        <TextField
          label="Email"
          name="emailResponsableTechnique"
          value={formData.emailResponsableTechnique}
          onChange={handleChange}
          size="small"
        />
        <TextField
          label="Tel"
          name="telResponsableTechnique"
          value={formData.telResponsableTechnique}
          onChange={handleChange}
          size="small"
        />
      </Box>
    </FormContainer>
  );
}
