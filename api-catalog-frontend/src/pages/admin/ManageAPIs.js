import React, { useEffect, useState } from 'react';
import {
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead,
  TableRow, 
  Paper, 
  Button, 
  Collapse, 
  TextField,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  IconButton,
  Divider,
  Tooltip,
  Grid,
  Fade,
  LinearProgress,
  Chip,
  styled,
  useTheme
} from '@mui/material';
import{
  Add as AddIcon,
  Delete as DeleteIcon,
  Api as ApiIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
  Cloud as CloudIcon,
  Link as LinkIcon,
  Code as CodeIcon,
  AttachMoney as AttachMoneyIcon
} from '@mui/icons-material';
import api from '../../api';

export default function ManageAPIs() {
  const theme = useTheme();
  const [wso2Apis, setWso2Apis] = useState([]);
  const [catalogApis, setCatalogApis] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApis();
    fetchCatalogApis();
  }, []);

  const fetchApis = async () => {
    try {
      const res = await api.get('/admin/apis');
      setWso2Apis(res.data || []);
    } catch (err) {
      console.error('Failed to fetch WSO2 APIs', err);
    }
  };

  const fetchCatalogApis = async () => {
    try {
      const res = await api.get('/admin/catalog/apis'); // Change if needed
      setCatalogApis(res.data || []);
    } catch (err) {
      console.error('Failed to fetch catalog APIs', err);
    }
  };

  const isInCatalog = (id) => {
    return catalogApis.some(api => api.id === id);
  };

  const handleExpand = (id) => {
    setExpandedRow(prev => (prev === id ? null : id));
    setFormValues({});
  };

  const handleChange = (e) => {
    setFormValues(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddToCatalog = async (apiObj) => {
    const body = {
      incomingApi: {
        id: apiObj.id,
        name: apiObj.name,
        description: apiObj.description || '',
        endpoint: formValues.endpoint || '',
        input: formValues.input || '',
        output: formValues.output || '',
        request_cost: Number(formValues.request_cost || 0),
        published: true
      },
      baseUrl: apiObj.baseUrl
    };

    try {
      await api.post('/admin/catalog/add', body);
      alert('API added to catalog!');
      setExpandedRow(null);
      fetchCatalogApis();
    } catch (err) {
      console.error('Failed to add API', err);
      alert('Error adding API: ' + (err.response?.data || err.message));
    }
  };

  const handleDeleteFromCatalog = async (id) => {
    try {
      await api.delete(`/admin/catalog/apis/${id}`);
      alert('API removed from catalog!');
      fetchCatalogApis();
    } catch (err) {
      console.error('Failed to delete API', err);
      alert('Error deleting API: ' + (err.response?.data || err.message));
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
        background:'linear-gradient(45deg,rgb(10, 0, 101) 10%,rgb(7, 3, 223) 90%)',
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

      {/* Table */}
      <Card elevation={0} sx={{ 
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        overflow: 'hidden',
        background: theme.palette.background.paper,
        boxShadow: theme.shadows[2]
      }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ background: 'linear-gradient(45deg,rgb(10, 0, 101) 10%,rgb(7, 3, 223) 90%)'}}> 
              <TableRow>
                <TableCell sx={{ fontWeight: 700,fontSize:'18px',color: 'white' }}>Nom API</TableCell>
                <TableCell sx={{ fontWeight: 700,fontSize:'18px',color: 'white' }}>ID API</TableCell>
                <TableCell sx={{ fontWeight: 700,fontSize:'18px',color: 'white' }}>Instance WSO2</TableCell>
                <TableCell sx={{ fontWeight: 700,fontSize:'18px',color: 'white' }} align='center'>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {wso2Apis.map((apiObj) => {
                const inCatalog = isInCatalog(apiObj.id);
                return (
                  <React.Fragment key={apiObj.id}>
                    <TableRow>
                      <TableCell>{apiObj.name}</TableCell>
                      <TableCell>{apiObj.id}</TableCell>
                      <TableCell>{apiObj.baseUrl}</TableCell>
                      <TableCell align="right">
                        {inCatalog ? (
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDeleteFromCatalog(apiObj.id)}
                          >
                            Supprimer
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => handleExpand(apiObj.id)}
                          >
                            {expandedRow === apiObj.id ? 'Annuler' : 'Ajouter'}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>

                    {!inCatalog && (
                      <TableRow>
                        <TableCell colSpan={4} sx={{ p: 0 }}>
                          <Collapse in={expandedRow === apiObj.id} timeout="auto" unmountOnExit>
                            <Box sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                              <Typography variant="subtitle1" gutterBottom>Information Additionnelle</Typography>

                              <TextField
                                fullWidth margin="dense" label="Endpoint"
                                name="endpoint" onChange={handleChange}
                              />
                              <TextField
                                fullWidth margin="dense" label="Input Format"
                                name="input" onChange={handleChange}
                              />
                              <TextField
                                fullWidth margin="dense" label="Output Format"
                                name="output" onChange={handleChange}
                              />
                              <TextField
                                fullWidth margin="dense" label="Request Cost"
                                name="request_cost" type="number" onChange={handleChange}
                              />

                              <Box sx={{ mt: 2 }}>
                                <Button variant="contained" onClick={() => handleAddToCatalog(apiObj)}>
                                  Confirmer l'ajout
                                </Button>
                              </Box>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
