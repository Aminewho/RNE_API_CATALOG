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
  Avatar
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Visibility as ViewIcon,
  PersonAdd as CreateAccountIcon
} from '@mui/icons-material';

export default function SignupRequests() {
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
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Signup Requests
        </Typography>
        <Box>
          <Tooltip title="Refresh">
            <IconButton onClick={fetchSignupRequests} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 2, p: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search requests..."
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
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="signup requests table">
              <TableHead>
                <TableRow>
                  <TableCell>Company</TableCell>
                  <TableCell>Primary Contact</TableCell>
                  <TableCell>Technical Contact</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRequests.length > 0 ? (
                  paginatedRequests.map((request) => (
                    <TableRow key={request.id} hover>
                      <TableCell>
                        <Typography variant="body1" fontWeight="medium">
                          {request.raisonSociale}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {request.matriculeFiscale}
                        </Typography>
                        <Typography variant="body2">{request.secteurActivite}</Typography>
                        <Typography variant="body2">{request.adresse}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1">
                          {request.nomPremierResponsable} {request.prenomPremierResponsable}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {request.emailPremierResponsable}
                        </Typography>
                        <Typography variant="body2">{request.tel}</Typography>
                      </TableCell>
                      <TableCell>
                        {request.nomResponsableTechnique && (
                          <>
                            <Typography variant="body1">
                              {request.nomResponsableTechnique} {request.prenomResponsableTechnique}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {request.emailResponsableTechnique}
                            </Typography>
                          </>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={request.status}
                          color={
                            request.status === 'APPROVED' ? 'success' : 
                            request.status === 'REJECTED' ? 'error' : 'warning'
                          }
                          size="small"
                          variant="outlined"
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
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body1" color="textSecondary">
                        No signup requests found
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
          />
        </>
      )}

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