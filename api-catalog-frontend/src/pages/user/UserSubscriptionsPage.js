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
import api from '../../api';

export default function UserSubscriptionsPage() {
  const theme = useTheme();
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
      case 'EXPIRED':
        return 'error';
      default:
        return 'default';
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
            Mes Abonnements
          </Typography>
        </Box>
      </Paper>  
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Voir tous vos abonnements à l'API et leur utilisation
      </Typography>


      {/* Subscriptions Table */}
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
        ) : subscriptions.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Aucun abonnement trouvé.
            </Typography>
          </Paper>
        ) : (
          <TableContainer>
            <Table>
              <TableHead sx={{ background: 'linear-gradient(45deg,rgb(10, 0, 101) 10%,rgb(7, 3, 223) 90%)'}}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700,fontSize:'18px',color: 'white' }}>API</TableCell>
                  <TableCell sx={{ fontWeight: 700,fontSize:'18px',color: 'white' }} align='center'>Statut</TableCell>
                  <TableCell sx={{ fontWeight: 700,fontSize:'18px',color: 'white' }} align='center'>Autorisé</TableCell>
                  <TableCell sx={{ fontWeight: 700,fontSize:'18px',color: 'white' }} align='center'>Utilisé</TableCell>
                  <TableCell sx={{ fontWeight: 700,fontSize:'18px',color: 'white' }} align='center'>Demandé</TableCell>
                  <TableCell sx={{ fontWeight: 700,fontSize:'18px',color: 'white' }} align='center'>Approuvé</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {subscriptions.map((sub) => (
                  <TableRow key={sub.id} hover>
                    <TableCell sx={{ fontWeight: 500,fontSize:'16px' }}>{sub.api}</TableCell>
                    <TableCell align='center' sx={{ fontWeight: 500,fontSize:'16px' }}><Chip label={sub.status} color={getStatusColor(sub.status)} size="small"/></TableCell>
                    <TableCell align='center' sx={{ fontWeight: 500,fontSize:'16px' }}>{sub.allowedRequests}</TableCell>
                    <TableCell align='center' sx={{ fontWeight: 500,fontSize:'16px' }}>{sub.usedRequests}</TableCell>
                    <TableCell align='center' sx={{ fontWeight: 500,fontSize:'16px' }}>{new Date(sub.requestDate).toLocaleString()}</TableCell>
                    <TableCell align='center' sx={{ fontWeight: 500,fontSize:'16px' }}>{sub.approvalDate ? new Date(sub.approvalDate).toLocaleString() : '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>
    </Box>
  );
}