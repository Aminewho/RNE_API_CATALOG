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
    Chip,
    useTheme,
    Card
  } from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import api from '../../api'; // Make sure this is your authenticated Axios instance

const TransactionsPage = () => {
  const theme = useTheme();
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
          minWidth: '850px',
          backgroundColor: 'lightgray'
    }}>

      {/* Header Section */}
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
            Transactions du portefeuille
          </Typography>
        </Box>
      </Paper>  
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Voyez tous les dépôts et les frais d'API sur votre compte-wallet
      </Typography>

      {/* Transactions Table */} 
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
        ) : transactions.length === 0 ? (
          <Typography sx={{ mt: 4 }}>Aucune transaction trouvée.</Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead sx={{ background: 'linear-gradient(45deg,rgb(10, 0, 101) 10%,rgb(7, 3, 223) 90%)'}}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700,fontSize:'18px',color: 'white' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 700,fontSize:'18px',color: 'white' }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 700,fontSize:'18px',color: 'white' }} align='center'>Montant (TND)</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id} hover>
                    <TableCell sx={{ fontWeight: 500,fontSize:'16px' }}>{new Date(tx.timestamp).toLocaleString()}</TableCell>
                    <TableCell sx={{ fontWeight: 500,fontSize:'16px' }}>{tx.description}</TableCell>
                    <TableCell align='center' sx={{ fontWeight: 500,fontSize:'16px' }}>
                      <Chip
                        sx={{ fontWeight: 500 ,width: '150px',fontSize:'16px'}}
                        label={`${tx.amount > 0 ? '+' : ''}${tx.amount} TND`}
                        color={tx.amount >= 0 ? 'success' : 'error'}
                        variant="filled"
                        onClick={() => {}}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>
    </Box>
  );
};

export default TransactionsPage;