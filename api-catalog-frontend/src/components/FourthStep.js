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

export default function FourthStep({ formData, handleChange, onStepComplete }) {

  React.useEffect(() => {
    const allFilled =
      formData.ip.trim() !== '' &&
      formData.tel.trim() !== '' &&
      formData.email.trim() !== '' ;

    onStepComplete(allFilled);
  }, [
    formData.ip,
    formData.tel,
    formData.email,
    onStepComplete,
  ]);


  return (
    <FormContainer>
      <FormTitle variant="h5" gutterBottom>
        Informations de contact
      </FormTitle>
      <Box
        component="form"
        sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
        noValidate
        autoComplete="off"
      >
        <TextField
          label="IP"
          name="ip"
          value={formData.ip}
          onChange={handleChange}
          size="small"
        />
        <TextField
          label="Tel"
          name="tel"
          value={formData.tel}
          onChange={handleChange}
          size="small"
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          size="small"
        />
      </Box>
    </FormContainer>
  );
}
