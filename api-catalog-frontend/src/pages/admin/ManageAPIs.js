import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Button, Collapse, TextField
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../api';

export default function ManageAPIs() {
  const [wso2Apis, setWso2Apis] = useState([]);
  const [catalogApis, setCatalogApis] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [formValues, setFormValues] = useState({});

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
    return catalogApis.some(api => api.id === id && api.published);
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>WSO2 Available APIs</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>API Name</TableCell>
              <TableCell>API ID</TableCell>
              <TableCell>WSO2 Instance</TableCell>
              <TableCell align="right">Actions</TableCell>
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
                          Delete
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={() => handleExpand(apiObj.id)}
                        >
                          {expandedRow === apiObj.id ? 'Cancel' : 'Add'}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>

                  {!inCatalog && (
                    <TableRow>
                      <TableCell colSpan={4} sx={{ p: 0 }}>
                        <Collapse in={expandedRow === apiObj.id} timeout="auto" unmountOnExit>
                          <Box sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                            <Typography variant="subtitle1" gutterBottom>Additional Info</Typography>

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
                                Confirm Add
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
    </Box>
  );
}
