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

export default function SecondStep({ formData, handleChange, onStepComplete }) {

  React.useEffect(() => {
    const allFilled =
      formData.nomPremierResponsable.trim() !== '' &&
      formData.prenomPremierResponsable.trim() !== '' &&
      formData.emailPremierResponsable.trim() !== '' &&
      formData.telPremierResponsable.trim() !== '';

    onStepComplete(allFilled);
  }, [
    formData.nomPremierResponsable,
    formData.prenomPremierResponsable, 
    formData.emailPremierResponsable,
    formData.telPremierResponsable,
    onStepComplete,
  ]);
  

  return (
    <FormContainer>
      <FormTitle variant="h5" gutterBottom>
        Informations de Premier Responsable
      </FormTitle>
      <Box
        component="form"
        sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
        noValidate
        autoComplete="off"
      >
        <TextField
          label="Nom"
          name="nomPremierResponsable"
          value={formData.nomPremierResponsable}
          onChange={handleChange}
          size="small"
        />
        <TextField
          label="Prenom"
          name="prenomPremierResponsable"
          value={formData.prenomPremierResponsable}
          onChange={handleChange}
          size="small"
        />
        <TextField
          label="Email"
          name="emailPremierResponsable"
          value={formData.emailPremierResponsable}
          onChange={handleChange}
          size="small"
        />
        <TextField
          label="Tel"
          name="telPremierResponsable"
          value={formData.telPremierResponsable}
          onChange={handleChange}
          size="small"
        />
      </Box>
    </FormContainer>
  );
}
