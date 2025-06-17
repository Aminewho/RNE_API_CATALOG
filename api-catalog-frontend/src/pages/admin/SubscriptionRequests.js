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
  Chip
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

export default function SubscriptionRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Subscription Requests
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
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRequests.length > 0 ? (
                  paginatedRequests.map((request, index) => (
                    <TableRow key={index} hover>
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
  clickable={false} // Ensures the Chip is not clickable
  onClick={() => {}} // Explicitly override any unintended click behavior
/>
                      </TableCell>
                      <TableCell>{request.allowedRequests}</TableCell>
                      <TableCell>{request.usedRequests}</TableCell>
                      <TableCell>{new Date(request.requestDate).toLocaleString()}</TableCell>
                      <TableCell>{request.approvalDate ? new Date(request.approvalDate).toLocaleString() : '-'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
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
    </Box>
  );
}
