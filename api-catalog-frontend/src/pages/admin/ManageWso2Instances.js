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
} from '@mui/material';

const ManageWso2Instances = () => {
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
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manage WSO2 Instances
      </Typography>

      <Box component="form" onSubmit={handleAddInstance} sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Add New Instance
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
              label="Client ID"
              name="clientId"
              value={newInstance.clientId}
              onChange={handleInputChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Client Secret"
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
          Add Instance
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Typography variant="h6" gutterBottom>
        Existing Instances
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
                  Client ID: {instance.clientId}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => handleDeleteInstance(instance.id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ManageWso2Instances;
