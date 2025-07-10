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
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
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
  const navigate = useNavigate();
  const [expandedIndex, setExpandedIndex] = useState(null); // index of expanded row

const toggleExpand = (index) => {
  setExpandedIndex((prev) => (prev === index ? null : index));
};
  const fetchSubscriptionRequests = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('http://localhost:8080/admin/subscriptions');
      setRequests(response.data);
      setSuccess('Data loaded successfully');
    } catch (err) {
      setError('Failed to fetch subscription requests');
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

  const filteredRequests = requests.filter((request) =>
    request.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.api.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedRequests = filteredRequests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ p: 3 , backgroundColor: '#45484f', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Subscription
        </Typography>
        <Box>
          <Tooltip title="Refresh">
            <IconButton onClick={fetchSubscriptionRequests} color="primary">
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
            <Table sx={{ minWidth: 650 }} aria-label="subscription requests table">
              <TableHead>
                <TableRow>
               
                  <TableCell>Username</TableCell>
                  <TableCell>API</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Allowed</TableCell>
                  <TableCell>Used</TableCell>
                  <TableCell>Request Date</TableCell>
                  <TableCell>Approval Date</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                    {paginatedRequests.length > 0 ? (
                      paginatedRequests.map((request, index) => (
                        <React.Fragment key={index}>
                          <TableRow hover>
                        
                            <TableCell>{request.username}</TableCell>
                            <TableCell>{request.api}</TableCell>
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
                            <TableCell>{request.allowedRequests}</TableCell>
                            <TableCell>{request.usedRequests}</TableCell>
                            <TableCell>{new Date(request.requestDate).toLocaleString()}</TableCell>
                            <TableCell>{request.approvalDate ? new Date(request.approvalDate).toLocaleString() : '-'}</TableCell>
                            <TableCell>
                              <IconButton size="small" onClick={() => toggleExpand(index)}>
                                {expandedIndex === index ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                              </IconButton>
                            </TableCell>
                          
                          {request.status === 'PENDING' && (
                                  <TableCell>
                                    <Stack direction="row" spacing={1}>
                                      <Button
                                        size="small"
                                        variant="contained"
                                        color="success"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleApprove(request.id); // define this function to call the backend
                                        }}
                                      >
                                        Approve
                                      </Button>
                                      <Button
                                        size="small"
                                        variant="outlined"
                                        color="error"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedRequest(request);
                                          setRejectDialogOpen(true);
                                        }}
                                      >
                                        Reject
                                      </Button>
                                    </Stack>
                                  </TableCell>
                            )}</TableRow>
                          {expandedIndex === index && (
                            <TableRow>
                              <TableCell colSpan={8}>
                                <Paper sx={{ p: 3 }}>
                                  <Typography variant="h6" gutterBottom>General Information</Typography>
                                  <Divider sx={{ mb: 2 }} />

                                  <Typography variant="body1"><strong>Username:</strong> {request.username}</Typography>
                                  <Typography variant="body1"><strong>API:</strong> {request.api}</Typography>
                                  <Typography variant="body1"><strong>Status:</strong> 
                                    <Chip 
                                      label={request.status}
                                      color={
                                        request.status === 'APPROVED' ? 'success' :
                                        request.status === 'REJECTED' ? 'error' : 'warning'
                                      }
                                      size="small"
                                      sx={{ ml: 1 }}
                                    />
                                  </Typography>
                                  <Typography variant="body1"><strong>Allowed Requests:</strong> {request.allowedRequests}</Typography>
                                  <Typography variant="body1"><strong>Used Requests:</strong> {request.usedRequests}</Typography>
                                  <Typography variant="body1"><strong>Request Date:</strong> {new Date(request.requestDate).toLocaleString()}</Typography>
                                  <Typography variant="body1"><strong>Approval Date:</strong> {request.approvalDate ? new Date(request.approvalDate).toLocaleString() : '-'}</Typography>
                                  {request.rejectionReason && (
                                    <Typography variant="body1" sx={{ mt: 2 }}>
                                      <strong>Rejection Reason:</strong> {request.rejectionReason}
                                    </Typography>
                                  )}
                                </Paper>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          <Typography variant="body1" color="textSecondary">
                            No subscription requests found
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
      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)}>
  <DialogTitle>Reject Subscription Request</DialogTitle>
  <DialogContent>
    <TextField
      fullWidth
      multiline
      rows={4}
      label="Reason for rejection"
      value={rejectReason}
      onChange={(e) => setRejectReason(e.target.value)}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setRejectDialogOpen(false)} color="inherit">
      Cancel
    </Button>
    <Button
      onClick={() => {
        handleReject(selectedRequest.id, rejectReason); // define this
        setRejectDialogOpen(false);
        setRejectReason('');
      }}
      color="error"
      variant="contained"
    >
      Reject
    </Button>
  </DialogActions>
</Dialog>

    </Box>
    
  );
}
