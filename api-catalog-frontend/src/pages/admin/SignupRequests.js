import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  CircularProgress,
  IconButton,
  Tooltip,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Divider,
  useTheme,
  Stack,
  Grid,
  alpha
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Visibility as ViewIcon,
  PersonAdd as CreateAccountIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon  
} from '@mui/icons-material';

export default function SignupRequests() {
  const theme = useTheme();
  const [signupRequests, setSignupRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSignupRequests();
  }, []);

  const fetchSignupRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/signups');
      setSignupRequests(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching signup requests:', error);
      setError('Failed to load signup requests');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredRequests = signupRequests.filter(request =>
    Object.values(request).some(
      value => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const paginatedRequests = filteredRequests.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleOpenApproveDialog = (request) => {
    setCurrentRequest(request);
    setCredentials({ username: '', password: '' });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentRequest(null);
    setError(null);
  };

  const handleApproveRequest = async () => {
    try {
      await api.put(`/admin/signups/${currentRequest.id}/approve`, credentials);
      setSuccess('Request approved successfully!');
      fetchSignupRequests();
      handleCloseDialog();
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to approve request');
    }
  };

  const handleRejectRequest = async (id) => {
    if (window.confirm('Are you sure you want to reject this request?')) {
      try {
        await api.put(`/admin/signups/${id}/reject`);
        setSuccess('Request rejected successfully!');
        fetchSignupRequests();
        setTimeout(() => setSuccess(null), 3000);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to reject request');
      }
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
          backgroundColor: 'lightgray',
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
            Demandes d'Iscriptions
          </Typography>
          <Box>
            <Tooltip title="Actualiser">
              <IconButton 
                onClick={fetchSignupRequests}
                sx={{
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.3)'
                  }
                }}  
                >
                <RefreshIcon fontSize='large' />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>  

      {/* Alerts */}
      <Box sx={{ mb: 3 }}>
        {success && (
          <Alert 
            severity="success" 
            icon={<ApproveIcon fontSize="inherit" />}
            onClose={() => setSuccess(null)}
            sx={{ 
              borderRadius: 2,
              boxShadow: theme.shadows[1]
            }}
          >
            {success}
          </Alert>
        )}
        {error && (
          <Alert 
            severity="error" 
            icon={<RejectIcon fontSize="inherit" />}
            onClose={() => setError(null)}
            sx={{ 
              borderRadius: 2,
              boxShadow: theme.shadows[1]
            }}
          >
            {error}
          </Alert>
        )}
      </Box>

      {/* Search Bar */}
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
          placeholder="🔍Recherche par entreprise, contact..."
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
      
      {/* Signup Requests Table */}

      <Card elevation={0} sx={{ 
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        overflow: 'hidden',
        background: theme.palette.background.paper,
        boxShadow: theme.shadows[2]
      }}>     
            
      {loading ? (
        <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: 300 
        }}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <>
          <TableContainer>
            <Table>
              <TableHead sx={{ background: 'linear-gradient(45deg,rgb(10, 0, 101) 10%,rgb(7, 3, 223) 90%)'}}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700,fontSize:'18px',color: 'white' }}>Entreprise</TableCell>
                  <TableCell sx={{ fontWeight: 700,fontSize:'18px',color: 'white' }}>Contact principal</TableCell>
                  <TableCell sx={{ fontWeight: 700,fontSize:'18px',color: 'white' }}>Contact Technique</TableCell>
                  <TableCell sx={{ fontWeight: 700,fontSize:'18px',color: 'white' }} align='center'>Statut</TableCell>
                  <TableCell sx={{ fontWeight: 700, width: 150,fontSize:'18px',color: 'white' }} align='center'>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRequests.length > 0 ? (
                  paginatedRequests.map((request) => (
                    <TableRow 
                      key={request.id} 
                      hover
                      >
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="flex-start">
                          <Avatar sx={{ 
                            bgcolor: theme.palette.primary.light,
                            color: theme.palette.primary.dark,
                            mt: 1
                          }}>
                            <BusinessIcon />
                          </Avatar>
                          <Box>
                            <Typography fontWeight={600}>
                              {request.raisonSociale}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {request.matriculeFiscale}
                            </Typography>
                            <Chip 
                              label={request.secteurActivite} 
                              size="small" 
                              variant="outlined"
                              sx={{ 
                                mt: 0.5,
                                borderColor: theme.palette.divider
                              }}
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                              <LocationIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                              <Typography variant="body2">
                                {request.adresse}
                              </Typography>
                            </Box>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell align='center'>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <PersonIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                            <Typography>
                              {request.nomPremierResponsable} {request.prenomPremierResponsable}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <EmailIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                            <Typography variant="body2">
                              {request.emailPremierResponsable}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <PhoneIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                            <Typography variant="body2">
                              {request.tel}
                            </Typography>
                          </Box>
                        </Grid>
                      </TableCell>
                      <TableCell align='center'>
                        {request.nomResponsableTechnique && (
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <PersonIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                              <Typography>
                                {request.nomResponsableTechnique} {request.prenomResponsableTechnique}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <EmailIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                              <Typography variant="body2">
                                {request.emailResponsableTechnique}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <PhoneIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                              <Typography variant="body2">
                                {request.telResponsableTechnique}
                              </Typography>
                            </Box>
                          </Grid>
                        )}
                      </TableCell>
                      <TableCell align='center'>
                        <Chip
                          label={request.status}
                          color={
                            request.status === 'ACCEPTED' ? 'success' : 
                            request.status === 'REJECTED' ? 'error' : 'warning'
                          }
                          size="small"
                          sx={{ 
                              fontWeight: 600,
                              boxShadow: theme.shadows[1]
                          }}
                          onClick={()=>{}}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Tooltip title="View details">
                            <IconButton size="small">
                              <ViewIcon color="info" />
                            </IconButton>
                          </Tooltip>
                          {request.status === 'NEW' && (
                            <>
                              <Tooltip title="Approve">
                                <IconButton 
                                  size="small" 
                                  color="success"
                                  onClick={() => handleOpenApproveDialog(request)}
                                >
                                  <ApproveIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Reject">
                                <IconButton 
                                  size="small" 
                                  color="error"
                                  onClick={() => handleRejectRequest(request.id)}
                                >
                                  <RejectIcon />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Box sx={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center',
                          color: theme.palette.text.disabled
                      }}>
                        <SearchIcon sx={{ fontSize: 48, mb: 1 }} /> 
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Pas de demande d'inscription trouvée
                        </Typography>
                      </Box>  
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredRequests.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Lignes par page :"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
              sx={{ 
                borderTop: `1px solid ${theme.palette.divider}`,
                '& .MuiTablePagination-toolbar': {
                  minHeight: 60
                }
              }}
            />
        </>
      )}

      </Card> 

      {/* Approve Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CreateAccountIcon color="primary" />
            <span>Create Account for {currentRequest?.raisonSociale}</span>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              margin="normal"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleApproveRequest} 
            variant="contained" 
            color="primary"
            disabled={!credentials.username || !credentials.password}
            startIcon={<ApproveIcon />}
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}