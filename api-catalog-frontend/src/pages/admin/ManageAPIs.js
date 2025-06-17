import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Paper,
  Avatar
} from '@mui/material';
import {
  Search as SearchIcon,
  Api as ApiIcon,
  Public as PublicIcon,
  Code as CodeIcon,
  Visibility as ViewIcon,
  Settings as ConfigureIcon
} from '@mui/icons-material';
import api from '../../api';

export default function ManageAPIs() {
  const [allApis, setAllApis] = useState([]);
  const [catalogApis, setCatalogApis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredApis, setFilteredApis] = useState([]);

  useEffect(() => {
    const fetchAll = async () => { 
      try {
        const [adminRes, catalogRes] = await Promise.all([
          api.get('/admin/apis'),
          api.get('/admin/catalog/apis')
        ]);
        setAllApis(adminRes.data);
        setCatalogApis(catalogRes.data.map(api => api.id));
        setFilteredApis(adminRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching APIs:', error);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    const results = allApis.filter(apiItem =>
      apiItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (apiItem.description && apiItem.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredApis(results);
  }, [searchTerm, allApis]);

  const toggleApi = async (apiItem) => {
    const isSelected = catalogApis.includes(apiItem.id);
    try {
      if (isSelected) {
        await api.delete(`/admin/catalog/apis/${apiItem.id}`);
        setCatalogApis(prev => prev.filter(id => id !== apiItem.id));
      } else {
        await api.post(`/admin/catalog/add`, apiItem);
        setCatalogApis(prev => [...prev, apiItem.id]);
      }
    } catch (error) {
      console.error('Error toggling API:', error);
    }
  };

  const getApiColor = (apiName) => {
    const colors = ['#3f51b5', '#009688', '#ff5722', '#673ab7', '#e91e63', '#00bcd4'];
    return colors[Math.abs(apiName.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % colors.length];
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          API Management
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage which APIs appear in the catalog
        </Typography>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search APIs by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {filteredApis.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No APIs found matching your search
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {filteredApis.map((apiItem) => {
                const isInCatalog = catalogApis.includes(apiItem.id);
                return (
                  <Grid item xs={12} sm={6} md={4} key={apiItem.id}>
                    <Card sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      border: isInCatalog ? '2px solid #4caf50' : 'none'
                    }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ bgcolor: getApiColor(apiItem.name), mr: 2 }}>
                            <ApiIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="h5" component="div">
                              {apiItem.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {apiItem.provider} • v{apiItem.version}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Chip
                            icon={<PublicIcon fontSize="small" />}
                            label={`Context: ${apiItem.context}`}
                            size="small"
                            sx={{ mr: 1, mb: 1 }}
                          />
                          <Chip
                            icon={<CodeIcon fontSize="small" />}
                            label={isInCatalog ? 'In Catalog' : 'Not in Catalog'}
                            color={isInCatalog ? 'success' : 'default'}
                            size="small"
                            sx={{ mb: 1 }}
                          />
                        </Box>

                        <Typography variant="body2" paragraph sx={{ minHeight: 60 }}>
                          {apiItem.description || 'No description available'}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                        <Button
                          size="small"
                          startIcon={<ViewIcon />}
                          onClick={() => console.log(`View details for ${apiItem.name}`)}
                        >
                          Details
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<ConfigureIcon />}
                          onClick={() => toggleApi(apiItem)}
                          sx={{
                            backgroundColor: isInCatalog ? 'error.main' : 'primary.main',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: isInCatalog ? '#d32f2f' : '#1565c0',
                            }
                          }}
                        >
                          {isInCatalog ? 'Remove' : 'Add to Catalog'}
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </>
      )}
    </Box>
  );
}