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
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import api from '../../api'; // Make sure this is your authenticated Axios instance

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get('/wallet/transactions');
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Wallet Transactions
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        View all deposits and API charges on your wallet
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : transactions.length === 0 ? (
        <Typography sx={{ mt: 4 }}>No transactions found.</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
              <TableRow>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
                <TableCell align="right"><strong>Amount (TND)</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id} hover>
                  <TableCell>
                    {new Date(tx.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>{tx.description}</TableCell>
                  <TableCell align="right">
                    <Chip
                      sx={{ fontWeight: 'bold' ,width: '100px'}}
                      label={`${tx.amount > 0 ? '+' : ''}${tx.amount} TND`}
                      color={tx.amount >= 0 ? 'success' : 'error'}
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default TransactionsPage;
