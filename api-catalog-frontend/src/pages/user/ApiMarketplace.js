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
import ReactJson from 'react-json-view';

export default function ApiMarketplace() {
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredApis, setFilteredApis] = useState([]);
  const [selectedApi, setSelectedApi] = useState(null);
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
    console.log('Subscribing to:', apiItem);

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
      await api.post('/api/subscriptions', {
        apiId: selectedApi.id,
        allowedRequests: parseInt(allowedRequests)
      });
      setSubscriptionDialog(prev => ({ ...prev, open: false }));
      alert(`Successfully subscribed to ${selectedApi.name}!`);
    } catch (err) {
      setSubscriptionDialog(prev => ({
        ...prev,
        error: err.response?.data?.error || err.message || 'Failed to create subscription',
        isSubmitting: false
      }));
    }
  };

  const handleViewDetails = (apiItem) => {
    setSelectedApi(apiItem);
    console.log('Subscribing to:', apiItem);
  };

  const handleCloseDetails = () => {
    setSelectedApi(null);
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
                  <Card   sx={{
                                backgroundColor: '#222f72 ', 
                                color: '#fff',
                                border: '1px solid #333',
                                borderRadius: 2,
                                p: 3,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                              }}>
  <Box>
    <Typography variant="h5" fontWeight="bold" gutterBottom>
      {apiItem.name}
    </Typography>

    <Typography variant="subtitle2" color="gray" gutterBottom>
      {apiItem.description || 'No description available'}
    </Typography>

    <Box sx={{ mt: 2 }}>
      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        ✅ <b style={{ marginLeft: 4 }}>{apiItem.request_cost} TND per request</b>
      </Typography>
     
    </Box>
  </Box>
                    <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                      <Button size="small" startIcon={<ViewIcon />} onClick={() => handleViewDetails(apiItem)}>Learn More</Button>
                      <Button size="small" variant="contained" startIcon={<SubscribeIcon />} onClick={() => handleSubscribeClick(apiItem)} sx={{ backgroundColor: 'primary.main', color: 'white', '&:hover': { backgroundColor: 'primary.dark' } }}>Subscribe</Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {/* Subscribe Dialog */}
      <Dialog open={subscriptionDialog.open} onClose={handleSubscriptionClose}>
        <DialogTitle>Subscribe to {subscriptionDialog.api?.name || 'API'}</DialogTitle>
        <DialogContent>
          {subscriptionDialog.error && (
            <Alert severity="error" sx={{ mb: 2 }}>{subscriptionDialog.error}</Alert>
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
          <Button onClick={handleSubscriptionClose} disabled={subscriptionDialog.isSubmitting}>Cancel</Button>
          <Button onClick={handleSubscriptionSubmit} color="primary" disabled={subscriptionDialog.isSubmitting}>
            {subscriptionDialog.isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={!!selectedApi} onClose={handleCloseDetails} maxWidth="md" fullWidth>
        <DialogTitle>API Details</DialogTitle>
        <DialogContent dividers>
          <Typography variant="h6" gutterBottom>Request Sample</Typography>
          <Paper
              sx={{
                bgcolor: '#1e1e1e',
                p: 2,
                mb: 3,
                color: '#b5f774',
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap', // preserve newlines & wrapping
                overflowX: 'auto',       // scroll horizontally if too wide
                maxHeight: 300,          // optional: limit vertical space
              }}
          >
  {selectedApi?.input || 'No input provided'}
</Paper>


          <Typography variant="h6" gutterBottom>Response Sample</Typography>
         
          <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
  <ReactJson
    src={
      (() => {
        try {
          return JSON.parse(selectedApi?.output);
        } catch (e) {
          return { error: 'Invalid JSON format' };
        }
      })()
    }
    name={false}
    collapsed={false}
    displayDataTypes={false}
    enableClipboard={true}
    theme="rjv-default"
  />
</Paper>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
