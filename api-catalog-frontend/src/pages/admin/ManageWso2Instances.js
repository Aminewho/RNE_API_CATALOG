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
  Paper,
  Avatar,
  IconButton,
  Chip,
  Tooltip,
  Fade,
  Zoom,
} from '@mui/material';
import { AddCircleOutline, DeleteOutline, Cloud, Security, Link } from '@mui/icons-material';

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

      
      {/* Main Content */}
      <Card elevation={0} sx={{ 
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        overflow: 'hidden',
        background: theme.palette.background.paper,
        boxShadow: theme.shadows[2],
        padding: 3,
      }}>

        {/* add new WSO2 instance */}
        <Grid item xs={12} md={5}>
          <Card elevation={0} sx={{
            borderRadius: 4,
            border: '1px solid',
            borderColor: theme.palette.divider,
            p: 3,
            height: '100%',
            background: 'linear-gradient(to bottom right, #ffffff 0%, #f9faff 100%)'
          }}>
            <Box display="flex" alignItems="center" gap={1} mb={3}>
              <AddCircleOutline color="primary" fontSize="medium" />
              <Typography variant="h5" fontWeight={600}>
                Add New Instance
              </Typography>
            </Box>
            <Box component="form" onSubmit={handleAddInstance}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Base URL"
                    name="baseUrl"
                    value={newInstance.baseUrl}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    variant="outlined"
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <Link color="action" sx={{ mr: 1, opacity: 0.7 }} />
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="ID Client"
                    name="clientId"
                    value={newInstance.clientId}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    variant="outlined"
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <Security color="action" sx={{ mr: 1, opacity: 0.7 }} />
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Secret Client"
                    name="clientSecret"
                    value={newInstance.clientSecret}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                sx={{ mt: 3, py: 1.5, borderRadius: 2 }}
                startIcon={<AddCircleOutline />}
              >
                Ajouter une Instance
              </Button>
            </Box>
          </Card>   
        </Grid><br />

        {/* Existing Instances */}
        <Grid item xs={12} md={7}>
          <Card elevation={0} sx={{
            borderRadius: 4,
            border: '1px solid',
            borderColor: theme.palette.divider,
            p: 3,
            height: '100%'
          }}>
            <Box display="flex" alignItems="center" gap={1} mb={3}>
              <Cloud color="primary" fontSize="medium" />
              <Typography variant="h5" fontWeight={600}>
                Instances Existantes
              </Typography>
              <Chip
                label={`${instances.length} enregistré `}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ ml: 'auto' }}
                onClick={()=>{}}
              />
            </Box>

            {instances.length === 0 ? (
              <Box textAlign="center" py={6}>
                <Typography color="text.secondary">
                  No instances found. Add your first WSO2 instance above.
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {instances.map((instance) => (
                  <Grid item xs={12} key={instance.id}>
                    <Zoom in={true}>
                      <Card variant="outlined" sx={{
                        borderRadius: 3,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                          transform: 'translateY(-2px)'
                        }
                      }}>
                        <CardContent>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }}>
                              <Cloud />
                            </Avatar>
                            <Box flex={1}>
                              <Typography variant="subtitle1" fontWeight={600}>
                                {instance.baseUrl}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Client ID: {instance.clientId}
                              </Typography>
                            </Box>
                            <Tooltip title="Delete instance" arrow TransitionComponent={Fade}>
                              <IconButton
                                color="error"
                                onClick={() => handleDeleteInstance(instance.id)}
                                sx={{
                                  '&:hover': {
                                    backgroundColor: 'rgba(239, 83, 80, 0.08)'
                                  }
                                }}
                              >
                                <DeleteOutline />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </CardContent>
                      </Card>
                    </Zoom>
                  </Grid>
                ))}
              </Grid>
            )}
          </Card>
        </Grid>
      </Card>
    </Box>
  );
};

export default ManageWso2Instances;