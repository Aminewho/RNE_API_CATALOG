import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Divider,
  CircularProgress,
  Grid,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import api from '../../api';

export default function UserDetailPage() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const userRes = await api.get(`/admin/users/${userId}`);
        setUser(userRes.data);

        const subsRes = await api.get(`/admin/subscriptions/user/${userId}`);
        setSubscriptions(subsRes.data);

        const txRes = await api.get(`/admin/transactions/${userId}`);
        setTransactions(txRes.data);
      } catch (err) {
        console.error('Failed to fetch user details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [userId]);

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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Typography variant="h6">User not found</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        User Details — {user.username}
      </Typography>

      {/* General Info */}
      <Paper sx={{ p: 3, mb: 4, backgroundColor: '#f9f9f9' }}>
        <Typography variant="h6">General Info</Typography>
        <Divider sx={{ my: 1 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Email:</strong> {user.email}</Typography>
            <Typography><strong>Role:</strong> {user.role}</Typography>
            <Typography><strong>Company:</strong> {user.raisonSociale}</Typography>
            <Typography><strong>Matricule Fiscale:</strong> {user.matriculeFiscale}</Typography>
            <Typography><strong>Secteur Activité:</strong> {user.secteurActivite}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Adresse:</strong> {user.adresse}</Typography>
            <Typography><strong>IP Autorisée:</strong> {user.ipAutorisee}</Typography>
            <Typography><strong>Wallet Balance:</strong> {user.balance} TND</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Subscriptions */}
      <Typography variant="h5" gutterBottom>Subscriptions</Typography>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
              <TableCell>API</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Allowed</TableCell>
              <TableCell>Used</TableCell>
              <TableCell>Requested</TableCell>
              <TableCell>Approved</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subscriptions.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell>{sub.api}</TableCell>
                <TableCell>
                  <Chip label={sub.status} color={getStatusColor(sub.status)} size="small" />
                </TableCell>
                <TableCell>{sub.allowedRequests}</TableCell>
                <TableCell>{sub.usedRequests}</TableCell>
                <TableCell>{new Date(sub.requestDate).toLocaleString()}</TableCell>
                <TableCell>{sub.approvalDate ? new Date(sub.approvalDate).toLocaleString() : '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Transactions */}
      <Typography variant="h5" gutterBottom>Transactions</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f3e5f5' }}>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Amount (TND)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>{new Date(tx.timestamp).toLocaleString()}</TableCell>
                <TableCell>{tx.description}</TableCell>
                <TableCell sx={{ color: tx.amount >= 0 ? 'green' : 'red' }}>{tx.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
