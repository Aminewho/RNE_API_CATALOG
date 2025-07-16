import React, { useEffect, useState } from 'react';
import api from '../../api';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Alert,
  Paper,
  TextField,
  InputAdornment,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Button,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Avatar,
  Grid
} from '@mui/material';
import{
  Refresh as RefreshIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Visibility as ViewIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon  
} from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';


export default function Subscriptions() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [viewDetails, setViewDetails] = useState(false);
  const navigate = useNavigate();
  const [expandedIndex, setExpandedIndex] = useState(null); // index of expanded row

const toggleExpand = (index) => {
  setExpandedIndex((prev) => (prev === index ? null : index));
};
  const fetchSubscriptionRequests = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/admin/subscriptions');
      setRequests(response.data);
      setSuccess('Données chargées avec succès');
    } catch (err) {
      setError("Échec de l'extraction des demandes d'abonnement");
    } finally {
      setLoading(false);
    }
  };
  const handleApprove = async (id) => {
    try {
      await api.put(`/admin/subscriptions/${id}/approve`);
      fetchSubscriptionRequests(); // refresh data
      navigate(`/admin/subscriptions`); // navigate to the subscription details page
    } catch (err) {
      console.error('Approval failed', err);
    }
  };
  
  const handleReject = async (id, reason) => {
    try {
      await api.put(`/admin/subscriptions/${id}/reject`);
      fetchSubscriptionRequests();
    } catch (err) {
      console.error('Rejection failed', err);
    }
  };

  useEffect(() => {
    fetchSubscriptionRequests();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setViewDetails(true);
  };

  const handleCloseDetails = () => {
    setSelectedRequest(null);
    setViewDetails(false);
  };

  const filteredRequests = requests.filter((request) =>
    request.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.api.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedRequests = filteredRequests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ 
      p: 2, 
      maxWidth: 1400, 
      margin: '0', // Added margin top/bottom
      borderRadius: 2, // Rounded corners
      boxShadow: 3, // Add shadow
      position: 'relative', // Ensures proper positioning
      top: 0, // Explicitly positions at top
      left: 0, // Explicitly positions at left
      minWidth: '750px', // Minimum width for responsiveness
      backgroundColor: 'lightgray', // Light gray background
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
            Abonnements
          </Typography>
          <Box>
            <Tooltip title="Actualiser">
              <IconButton 
                onClick={fetchSubscriptionRequests}
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
            severity="success" onClose={() => setSuccess('')} 
            sx={{ 
              mb: 2,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(46, 125, 50, 0.2)'
            }}>
            {success}
          </Alert>
        )}
        {error && (
          <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>
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
          placeholder="🔍Rechercher par nom d'utilisateur ou API..."
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

      {/* Subscription Requests Table */}
      {loading ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: 300
        }}> 
          <CircularProgress size={60} thickness={4} sx={{ color: '#6a11cb' }}/>
        </Box>
      ) : (
        <Paper elevation={0} sx={{ 
          borderRadius: 2,
          overflow: 'hidden',
          background: 'white',
          boxShadow: '0 4px 30px rgba(0,0,0,0.1)'
        }}>
          <TableContainer>
            <Table sx={{ minWidth: 850 }}>
              <TableHead sx={{ background: 'linear-gradient(45deg,rgb(10, 0, 101) 10%,rgb(7, 3, 223) 90%)' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700,fontSize:'18px',color: 'white',py:2 }}>Utilisateur</TableCell>
                  <TableCell sx={{ fontWeight: 700,fontSize:'18px',color: 'white',py:2 }} align='center'>API</TableCell>
                  <TableCell sx={{ fontWeight: 700,fontSize:'18px',color: 'white',py:2 }} align='center'>Statut</TableCell>
                  <TableCell sx={{ fontWeight: 700,fontSize:'18px',color: 'white',py:2 }} align='center'>Autorisé</TableCell>
                  <TableCell sx={{ fontWeight: 700,fontSize:'18px',color: 'white',py:2 }} align='center'>Utilisé</TableCell>
                  <TableCell sx={{ fontWeight: 700,fontSize:'18px',color: 'white',py:2 }} align='center'>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                    {paginatedRequests.length > 0 ? (
                      paginatedRequests.map((request, index) => (
                        <React.Fragment key={index}>
                          <TableRow 
                            hover
                            sx={{ 
                              '&:hover': {
                                backgroundColor: '#e9f5ff'
                              }
                            }}>
                        
                            <TableCell >
                              <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                  {request.username.charAt(0).toUpperCase()}
                                </Avatar>
                                <Typography sx={{ fontWeight: 500,fontSize:'16px' }}>{request.username}</Typography> 
                              </Stack>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 500,fontSize:'16px' }} align='center'>{request.api}</TableCell>
                            <TableCell align='center'>
                              <Chip
                                label={request.status === 'APPROVED' ? 'Approuvé' : request.status === 'REJECTED' ? 'Rejeté' : 'En Attente'}
                                color={
                                  request.status === 'APPROVED'
                                    ? 'success'
                                    : request.status === 'REJECTED'
                                    ? 'error'
                                    : 'warning'
                                }
                                sx={{
                                  fontWeight: 'bold',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}  
                                onClick={()=>{}}
                              />
                            </TableCell>
                            <TableCell sx={{ fontWeight: 500,fontSize:'16px' }} align='center'>{request.allowedRequests}</TableCell>
                            <TableCell sx={{ fontWeight: 500,fontSize:'16px' }} align='center'>{request.usedRequests}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                <Tooltip title="Voir détails">
                                  <Button size="small" startIcon={<ViewIcon />} onClick={() => handleViewDetails(request)}>
                                  </Button>
                                </Tooltip>
                                {request.status === 'PENDING' && (
                                  <>
                                    <Tooltip title="Approve">
                                      <IconButton 
                                        size="small" 
                                        color="success"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleApprove(request.id)}}
                                      >
                                        <ApproveIcon />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Reject">
                                      <IconButton 
                                        size="small" 
                                        color="error"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedRequest(request);
                                          setRejectDialogOpen(true);
                                        }}
                                      >
                                        <RejectIcon />
                                      </IconButton>
                                    </Tooltip>
                                  </>
                                )}
                              </Box>
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          <Typography variant="body1" color="textSecondary">
                            Aucune requête d'abonnement trouvée
                          </Typography>
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
            labelRowsPerPage="Lignes par page"
            sx={{ 
              borderTop: '1px solid #e0e0e0',
              background: '#f8f9fa',
            }}
          />
        </Paper>
      )}
      <Dialog 
        open={rejectDialogOpen} 
        onClose={() => setRejectDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 500,
            background: 'linear-gradient(45deg, #fdfcfb 0%, #e2d1c3 100%)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
          }
        }}
        >
        <DialogTitle sx={{ fontWeight: 'bold',background: 'linear-gradient(45deg,rgb(171, 0, 6) 0%,rgb(200, 51, 10) 100%)',color: 'white' }}>Rejeter la demande d'abonnement</DialogTitle>
        <DialogContent dividers sx={{ py: 3 }}>
          <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
            Veuillez expliquer la raison du rejet de cet abonnement:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'rgba(255,255,255,0.8)'
              } 
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, background: '#f8f9fa' }}>
          <Button 
            onClick={() => setRejectDialogOpen(false)} 
            variant='outlined'
            sx={{ 
              mr: 1,
              color: '#6a11cb',
              borderColor: '#6a11cb',
              '&:hover': {
                backgroundColor: 'rgba(106, 17, 203, 0.08)'
              }
            }}>
            Annuler
          </Button>
          <Button
            onClick={() => {
              handleReject(selectedRequest.id, rejectReason); // define this
              setRejectDialogOpen(false);
              setRejectReason('');
            }}
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #ff416c 0%, #ff4b2b 100%)',
              boxShadow: '0 3px 5px rgba(255, 75, 43, 0.3)',
              '&:hover': {
                boxShadow: '0 5px 8px rgba(255, 75, 43, 0.4)'
              }
            }}
          >
            Rejeter
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog
        open={viewDetails}
        onClose={handleCloseDetails}
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: '16px',
            minWidth: { xs: '90%', sm: '600px' },
            background: 'white',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }
        }}
      >
        <DialogTitle sx={{
          fontWeight: 'bold',
          background: 'linear-gradient(45deg,rgb(10, 0, 101) 10%,rgb(7, 3, 223) 90%)',
          color: 'white',
          py: 2,
          px: 3
        }}>
          Détails de l'abonnement
        </DialogTitle>
        <DialogContent dividers sx={{ py: 3, px: 3 }}>
          {selectedRequest ? (
            <Box>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Avatar sx={{
                  bgcolor: 'primary.main', 
                  width: 48,
                  height: 48,
                  fontSize: '18px'
                }}>
                  {selectedRequest.username.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={600}>{selectedRequest.username}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Demande le {new Date(selectedRequest.requestDate).toLocaleDateString()}
                  </Typography>
                </Box>
              </Stack>

              <Grid container spacing={3} sx={{ mb: 2 }}>
                <Grid item xs={12} md={6}>
                  <Paper elevation={0} sx={{
                    p: 2,
                    borderRadius: '8px',
                    backgroundColor: '#f8f9ff',
                    height: '100%'
                  }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      API
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {selectedRequest.api}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper elevation={0} sx={{
                    p: 2,
                    borderRadius: '8px',
                    backgroundColor: '#f8f9ff',
                    height: '100%'
                  }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Statut
                    </Typography>
                    <Chip
                      label={selectedRequest.status === 'APPROVED' ? 'Approuvé' : selectedRequest.status === 'REJECTED' ? 'Rejeté' : 'En attente'}
                      color={
                        selectedRequest.status === 'APPROVED'
                          ? 'success'
                          : selectedRequest.status === 'REJECTED'
                          ? 'error'
                          : 'warning'
                      }
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '0.75rem',
                        minWidth: '90px'
                      }}
                      onClick={() => {}}
                    />
                  </Paper>
                </Grid>
              </Grid>

              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={6} md={3}>
                  <Paper elevation={0} sx={{
                    p: 2,
                    borderRadius: '8px',
                    backgroundColor: '#f8f9ff',
                    height: '100%'
                  }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Requêtes autorisées
                    </Typography>
                    <Typography variant="h5" fontWeight={600} color="primary">
                      {selectedRequest.allowedRequests}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Paper elevation={0} sx={{
                    p: 2,
                    borderRadius: '8px',
                    backgroundColor: '#f8f9ff',
                    height: '100%'
                  }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Requêtes utilisées
                    </Typography>
                    <Typography variant="h5" fontWeight={600} color="secondary">
                      {selectedRequest.usedRequests}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper elevation={0} sx={{
                    p: 2,
                    borderRadius: '8px',
                    backgroundColor: '#f8f9ff',
                    height: '100%'
                  }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      {selectedRequest.status === 'APPROVED' ? 'Date d\'approbation' : selectedRequest.status === 'REJECTED' ? 'Date de rejet' : 'En attente depuis'}
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {selectedRequest.approvalDate ? new Date(selectedRequest.approvalDate).toLocaleString() : new Date(selectedRequest.requestDate).toLocaleString()}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              {selectedRequest.rejectionReason && (
                <Paper elevation={0} sx={{
                  p: 2,
                  borderRadius: '8px',
                  backgroundColor: '#fff8f8',
                  border: '1px solid #ffebee'
                }}>
                  <Typography variant="subtitle2" color="error" gutterBottom>
                    Raison du rejet
                  </Typography>
                  <Typography variant="body1">
                    {selectedRequest.rejectionReason}
                  </Typography>
                </Paper>
              )}
            </Box>
          ) : (
            <Alert severity="info">Aucune demande sélectionnée</Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, background: '#f9f9f9', borderTop: '1px solid #f0f0f0' }}>
          <Button
            onClick={handleCloseDetails}
            variant="text"
            sx={{
              backgroundColor: 'rgba(255, 0, 0, 0.97)',
              color: 'white'
            }}  
          >
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    
  );
}