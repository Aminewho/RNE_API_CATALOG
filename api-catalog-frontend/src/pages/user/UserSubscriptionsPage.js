import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip
} from '@mui/material';
import api from '../../api';

export default function UserSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await api.get('/api/subscriptions/user');
        setSubscriptions(response.data);
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'REJECTED':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        My Subscriptions
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        View all your API subscriptions and their usage
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : subscriptions.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No subscriptions found.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
              <TableRow>
                <TableCell><strong>API</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell align="right"><strong>Allowed</strong></TableCell>
                <TableCell align="right"><strong>Used</strong></TableCell>
                <TableCell><strong>Requested</strong></TableCell>
                <TableCell><strong>Approved</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subscriptions.map((sub) => (
                <TableRow key={sub.id} hover>
                  <TableCell>{sub.api}</TableCell>
                  <TableCell>
                    <Chip label={sub.status} color={getStatusColor(sub.status)} size="small" />
                  </TableCell>
                  <TableCell align="right">{sub.allowedRequests}</TableCell>
                  <TableCell align="right">{sub.usedRequests}</TableCell>
                  <TableCell>
                    {new Date(sub.requestDate).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {sub.approvalDate ? new Date(sub.approvalDate).toLocaleString() : '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
