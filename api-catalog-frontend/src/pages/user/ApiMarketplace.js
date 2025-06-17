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
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  Api as ApiIcon,
  Public as PublicIcon,
  Code as CodeIcon,
  Visibility as ViewIcon,
  CloudDownload as SubscribeIcon
} from '@mui/icons-material';
import api from '../../api';

export default function ApiMarketplace() {
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredApis, setFilteredApis] = useState([]);
  const [subscriptionDialog, setSubscriptionDialog] = useState({
    open: false,
    api: null,
    allowedRequests: '',
    error: '',
    isSubmitting: false
  });

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
    const results = apis.filter(apiItem =>
      apiItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (apiItem.description && apiItem.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredApis(results);
  }, [searchTerm, apis]);

  const getApiColor = (apiName) => {
    const colors = ['#3f51b5', '#009688', '#ff5722', '#673ab7', '#e91e63', '#00bcd4'];
    return colors[Math.abs(apiName.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % colors.length];
  };

  const handleSubscribeClick = (apiItem) => {
    setSubscriptionDialog({
      open: true,
      api: apiItem,
      allowedRequests: '',
      error: '',
      isSubmitting: false
    });
  };

  const handleSubscriptionClose = () => {
    setSubscriptionDialog(prev => ({
      ...prev,
      open: false
    }));
  };

  const handleAllowedRequestsChange = (e) => {
    setSubscriptionDialog(prev => ({
      ...prev,
      allowedRequests: e.target.value,
      error: ''
    }));
  };

  const handleSubscriptionSubmit = async () => {
    const { api: selectedApi, allowedRequests } = subscriptionDialog;

    if (!allowedRequests || isNaN(allowedRequests) || parseInt(allowedRequests) <= 0) {
      setSubscriptionDialog(prev => ({
        ...prev,
        error: 'Please enter a valid number of allowed requests (must be greater than 0)'
      }));
      return;
    }

    setSubscriptionDialog(prev => ({
      ...prev,
      isSubmitting: true,
      error: ''
    }));

    try {
      const response = await api.post('/api/subscriptions', {
        apiId: selectedApi.id,
        allowedRequests: parseInt(allowedRequests)
      });
      
      setSubscriptionDialog(prev => ({
        ...prev,
        open: false
      }));
      alert(`Successfully subscribed to ${selectedApi.name}!`);
    } catch (err) {
      setSubscriptionDialog(prev => ({
        ...prev,
        error: err.response?.data?.error || err.message || 'Failed to create subscription',
        isSubmitting: false
      }));
    }
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
              {filteredApis.map((apiItem) => (
                <Grid item xs={12} sm={6} md={4} key={apiItem.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
                          label={apiItem.published ? 'Published' : 'Draft'}
                          color={apiItem.published ? 'success' : 'default'}
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
                        startIcon={<SubscribeIcon />}
                        onClick={() => handleSubscribeClick(apiItem)}
                        sx={{
                          backgroundColor: 'primary.main',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'primary.dark',
                          }
                        }}
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

      <Dialog open={subscriptionDialog.open} onClose={handleSubscriptionClose}>
        <DialogTitle>
          Subscribe to {subscriptionDialog.api?.name || 'API'}
        </DialogTitle>
        <DialogContent>
          {subscriptionDialog.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {subscriptionDialog.error}
            </Alert>
          )}
          
          <TextField
            autoFocus
            margin="dense"
            label="Allowed Requests"
            type="number"
            fullWidth
            variant="outlined"
            value={subscriptionDialog.allowedRequests}
            onChange={handleAllowedRequestsChange}
            inputProps={{ min: 1 }}
            error={!!subscriptionDialog.error}
            disabled={subscriptionDialog.isSubmitting}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleSubscriptionClose}
            disabled={subscriptionDialog.isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubscriptionSubmit}
            color="primary"
            disabled={subscriptionDialog.isSubmitting}
          >
            {subscriptionDialog.isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}