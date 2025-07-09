import React, { useState, useEffect } from 'react';
import api from '../../api';
import {
  Container,
  Typography,
  TextField,
  Grid,
  Button,
  Divider,
  Card,
  CardContent,
  CardActions,
  Box,
  useTheme,
  Paper
} from '@mui/material';

const ManageWso2Instances = () => {
  const theme = useTheme();
  const [instances, setInstances] = useState([]);
  const [newInstance, setNewInstance] = useState({
    baseUrl: '',
    clientId: '',
    clientSecret: '',
  });

  useEffect(() => {
    fetchInstances();
  }, []);

  const fetchInstances = async () => {
    try {
      const response = await api.get('/admin/instances');
      setInstances(response.data);
    } catch (error) {
      console.error('Error fetching instances:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewInstance({
      ...newInstance,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddInstance = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/instances', newInstance); // <-- fixed: data was missing
      setNewInstance({ baseUrl: '', clientId: '', clientSecret: '' });
      fetchInstances();
    } catch (error) {
      console.error('Error adding instance:', error);
    }
  };

  const handleDeleteInstance = async (id) => {
    try {
      await api.delete(`/admin/instances/${id}`);
      fetchInstances();
    } catch (error) {
      console.error('Error deleting instance:', error);
    }
  };

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
          minWidth: '950px',
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
            WSO2 APIs disponibles
          </Typography>
      </Box>
      </Paper>

      <Card elevation={0} sx={{ 
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        overflow: 'hidden',
        background: theme.palette.background.paper,
        boxShadow: theme.shadows[2],
        padding: 3,
      }}>

      <Box component="form" onSubmit={handleAddInstance} sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Ajouter une nouvelle Instance
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Base URL"
              name="baseUrl"
              value={newInstance.baseUrl}
              onChange={handleInputChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="ID Client"
              name="clientId"
              value={newInstance.clientId}
              onChange={handleInputChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Secret Client"
              name="clientSecret"
              value={newInstance.clientSecret}
              onChange={handleInputChange}
              required
              fullWidth
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Ajouter une Instance
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Typography variant="h6" gutterBottom>
        Instances Existantes
      </Typography>

      <Grid container spacing={2}>
        {instances.map((instance) => (
          <Grid item xs={12} md={6} key={instance.id}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">
                  {instance.baseUrl}
                </Typography>
                <Typography variant="body2">
                  ID Client : {instance.clientId}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => handleDeleteInstance(instance.id)}
                >
                  Supprimer
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      </Card>
    </Box>
  );
};

export default ManageWso2Instances;
