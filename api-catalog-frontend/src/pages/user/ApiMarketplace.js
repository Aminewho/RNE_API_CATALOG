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
  Divider,
  Avatar
} from '@mui/material';
import {
  Search as SearchIcon,
  Api as ApiIcon,
  Public as PublicIcon,
  Code as CodeIcon,
  Visibility as ViewIcon,
  CloudDownload as SubscribeIcon
} from '@mui/icons-material';
import api from '../../api'; // Your configured axios instance

export default function ApiMarketplace() {
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredApis, setFilteredApis] = useState([]);

  useEffect(() => {
    const fetchApis = async () => {
      try {
        const response = await api.get('/apis');
        setApis(response.data);
        setFilteredApis(response.data);
      } catch (error) {
        console.error('Error fetching APIs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApis();
  }, []);

  useEffect(() => {
    const results = apis.filter(api =>
      api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (api.description && api.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredApis(results);
  }, [searchTerm, apis]);

  const getApiColor = (apiName) => {
    const colors = ['#3f51b5', '#009688', '#ff5722', '#673ab7', '#e91e63', '#00bcd4'];
    return colors[Math.abs(apiName.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % colors.length];
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          API Marketplace
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Discover and subscribe to available APIs
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
              {filteredApis.map((api) => (
                <Grid item xs={12} sm={6} md={4} key={api.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: getApiColor(api.name), mr: 2 }}>
                          <ApiIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h5" component="div">
                            {api.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {api.provider} • v{api.version}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Chip
                          icon={<PublicIcon fontSize="small" />}
                          label={`Context: ${api.context}`}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                        <Chip
                          icon={<CodeIcon fontSize="small" />}
                          label={api.published ? 'Published' : 'Draft'}
                          color={api.published ? 'success' : 'default'}
                          size="small"
                          sx={{ mb: 1 }}
                        />
                      </Box>

                      <Typography variant="body2" paragraph sx={{ minHeight: 60 }}>
                        {api.description || 'No description available'}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                      <Button
                        size="small"
                        startIcon={<ViewIcon />}
                        onClick={() => console.log(`View details for ${api.name}`)}
                      >
                        Details
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<SubscribeIcon />}
                        disabled={!api.published}
                        onClick={() => console.log(`Subscribe to ${api.name}`)}
                      >
                        Subscribe
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Box>
  );
}