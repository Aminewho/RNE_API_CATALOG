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
        const response = await api.get('/apis/published');
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
        error: 'Veuillez saisir un nombre valide de demandes autorisées (doit être supérieur à 0).'
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
      alert(`Abonné avec succès à ${selectedApi.name}!`);
    } catch (err) {
      setSubscriptionDialog(prev => ({
        ...prev,
        error: err.response?.data?.error || err.message || "Échec de la création de l'abonnement",
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
    <Box sx={{ 
          p: 2,  
          margin: '0', // Added margin top/bottom
          borderRadius: 2, // Rounded corners
          boxShadow: 3, // Add shadow
          position: 'relative', // Ensures proper positioning
          top: 0,
          left: 0,
          width: '756px',
          backgroundColor: 'lightgray'
    }}>
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
            API Marketplace
          </Typography>
        </Box>
      </Paper>
      <Typography variant="h6" color="text.secondary">
        Découvrir les API disponibles et s'y abonner
      </Typography>

      {/* Search Field */}  
      <Paper elevation={0} sx={{ 
        p: 2, 
        mb: 3,
        borderRadius: 3,
        background: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="🔍Recherche d'API par nom ou par description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            sx: { 
              borderRadius: 2,
              backgroundColor: '#f8f9fa',
              '&:hover': {
                backgroundColor: '#e9ecef'
              }
            }
          }}
        />
      </Paper>

      {/* API Liste */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {filteredApis.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                Pas d'API correspondant à votre recherche
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
                    <Box width={'300px'} height={'120px'}>
                      <Typography variant="h5" fontWeight="bold" gutterBottom>
                        {apiItem.name}
                      </Typography>

                      <Typography variant="subtitle2" color="gray" gutterBottom>
                        {apiItem.description || 'Aucune description disponible'}
                      </Typography>

                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          ✅ <b style={{ marginLeft: 4 }}>{apiItem.request_cost} TND par requête</b>
                        </Typography>
                      
                      </Box>
                    </Box>
                    <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                      <Button size="small" startIcon={<ViewIcon />} onClick={() => handleViewDetails(apiItem)}>En savoir plus</Button>
                      <Button size="small" variant="contained" startIcon={<SubscribeIcon />} onClick={() => handleSubscribeClick(apiItem)} sx={{ backgroundColor: 'primary.main', color: 'white', '&:hover': { backgroundColor: 'primary.dark' } }}>S'abonner</Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {/* Subscribe Dialog */}
      <Dialog 
        open={subscriptionDialog.open} 
        onClose={handleSubscriptionClose}
        PaperProps={{
          sx: {
            borderRadius: 3,
            width: '100%',
            maxWidth: '500px'
          }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 600,
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          py: 3
        }}>S'abonner à {subscriptionDialog.api?.name || 'API'}</DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          {subscriptionDialog.error && (
            <Alert severity="error" sx={{ mb: 3 }}>{subscriptionDialog.error}</Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Requêtes autorisées"
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
        <DialogActions sx={{ 
          px: 3,
          py: 2,
          borderTop: '1px solid rgba(0,0,0,0.08)'
        }}> 
          <Button onClick={handleSubscriptionClose} 
            disabled={subscriptionDialog.isSubmitting} 
            sx={{ color: 'text.secondary' }}>Annuler</Button>
          <Button onClick={handleSubscriptionSubmit} color="primary" 
          disabled={subscriptionDialog.isSubmitting}
          sx={{ 
            fontWeight: 600,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 8px rgba(103, 58, 183, 0.3)'
            }
          }}>
            {subscriptionDialog.isSubmitting ? 'Subscribing...' : "S'abonner"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={!!selectedApi} onClose={handleCloseDetails} maxWidth="md" >
        <DialogTitle>API Details</DialogTitle>
        <DialogContent dividers>
          <Typography variant="h6" gutterBottom>Request Sample</Typography>
          <Paper
              sx={{
                bgcolor: '#1e1e1e',
                minWidth: '600px',
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