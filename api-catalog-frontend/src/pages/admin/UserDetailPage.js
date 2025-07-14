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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Avatar,
  Card,
  CardContent,
  useTheme
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  Security as SecurityIcon,
  Phone as PhoneIcon,
  Receipt as ReceiptIcon,
  LocationOn as LocationIcon,
  AccountBalanceWallet as WalletIcon,
  Api as ApiIcon
} from '@mui/icons-material';
import api from '../../api';

export default function UserDetailPage() {
  const theme = useTheme();
  const { userId } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await api.get(`/admin/user-details/${userId}`);
        setUserDetails(res.data);
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
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '80vh'
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!userDetails) {
    return (
      <Typography variant="h6" color="error" sx={{ textAlign: 'center', mt: 4 }}>
        Utilisateur non trouvé
      </Typography>
    );
  }

  const { user, subscriptions, transactions } = userDetails;

  return (
    <Box sx={{ 
      p: 2, 
      maxWidth: 1400, 
      margin: '0', // Added margin top/bottom
      border: `1px solid ${theme.palette.divider}`, // Add border
      borderRadius: 2, // Rounded corners
      boxShadow: 3, // Add shadow
      backgroundColor: 'lightgrey', // White background
      position: 'relative', // Ensures proper positioning
      top: 0, // Explicitly positions at top
      left: 0,
      minWidth: '850px', // Minimum width for smaller screens
    }}>

      {/* User Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', // Add this
        mb: 4,
        p: 3,
        borderRadius: 2,
        background: 'linear-gradient(45deg,rgb(10, 0, 101) 10%,rgb(7, 3, 223) 90%)',
        color: 'white'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ 
            bgcolor: 'white', 
            color: theme.palette.primary.main,
            width: 80, 
            height: 80,
            mr: 3,
            fontSize: 40
          }}>
            {user.username.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h3" fontWeight="bold">
              {user.username}
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              {user.role} • {user.raisonSociale}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ 
          background: 'rgba(255,255,255,0.2)',
          p: 2,
          borderRadius: 2,
          textAlign: 'center'
        }}>
          <Typography variant="h6">Balance</Typography>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {user.balance} TND
          </Typography>
        </Box>
      </Box>

      {/* Info Cards */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 4, 
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2
        }}>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4} >
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BusinessIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Informations sur l'entreprise</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={1.5}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Entreprise</Typography>
                    <Typography>{user.raisonSociale}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">ID Taxe</Typography>
                    <Typography>{user.matriculeFiscale}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Secteur</Typography>
                    <Typography>{user.secteurActivite}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationIcon color="action" sx={{ mr: 1 }} />
                    <Typography>{user.adresse}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ height: '100%',minWidth: '220px' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EmailIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Contact</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={1.5}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Email</Typography>
                    <Typography>{user.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PhoneIcon color="action" sx={{ mr: 1 }} />
                    <Typography>{user.tel}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ height: '100%',minWidth: '220px' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SecurityIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Sécurité</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={1.5}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">IP Autorisé : </Typography>
                    <Typography>{user.ipAutorisee}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>  

      {/* Subscriptions Section */}
      <Typography variant="h5" sx={{ 
        mb: 3, 
        display: 'flex', 
        alignItems: 'center',
        color: theme.palette.primary.dark
      }}>
        <ApiIcon sx={{ mr: 1 }} /> Abonnements
      </Typography>
      
      <TableContainer component={Paper} elevation={3} sx={{ mb: 4, borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ background: 'linear-gradient(45deg,rgb(10, 0, 101) 10%,rgb(7, 3, 223) 90%)' }}>
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
                <TableCell align='center'>
                  <Chip 
                    label={sub.status} 
                    color={getStatusColor(sub.status)} 
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 500,fontSize:'16px' }} align='center'>{sub.allowedRequests}</TableCell>
                <TableCell sx={{ fontWeight: 500,fontSize:'16px' }} align='center'>{sub.usedRequests}</TableCell>
                <TableCell sx={{ fontWeight: 500,fontSize:'16px' }} align='center'>{new Date(sub.requestDate).toLocaleString()}</TableCell>
                <TableCell sx={{ fontWeight: 500,fontSize:'16px' }} align='center'>
                  {sub.approvalDate ? (
                    new Date(sub.approvalDate).toLocaleString()
                  ) : (
                    <Typography color="text.secondary">-</Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
            
      {/* Transactions Section */}
      <Typography variant="h5" sx={{ 
        mb: 3, 
        display: 'flex', 
        alignItems: 'center',
        color: theme.palette.primary.dark
      }}>
        <ReceiptIcon sx={{ mr: 1 }} /> Transactions
      </Typography>
      <Paper 
        elevation={0} 
        sx={{ 
          mb: 4, 
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          overflow: 'hidden' // Ensures border-radius applies to tables too
        }}>  
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ background: 'linear-gradient(45deg,rgb(10, 0, 101) 10%,rgb(7, 3, 223) 90%)' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700,fontSize:'18px',color: 'white' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 700,fontSize:'18px',color: 'white' }} align='center'>Description</TableCell>
              <TableCell sx={{ fontWeight: 700,fontSize:'18px',color: 'white' }} align='center'>Montant (TND)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id} hover>
                <TableCell sx={{ fontWeight: 500,fontSize:'16px' }} >{new Date(tx.timestamp).toLocaleString()}</TableCell>
                <TableCell sx={{ fontWeight: 500,fontSize:'16px' }} align='center'>{tx.description}</TableCell>
                <TableCell sx={{ 
                  fontWeight: 'bold',
                  fontSize: '16px',
                  color: tx.amount >= 0 ? 'success.main' : 'error.main' 
                }} align='center'>
                  {tx.amount >= 0 ? `+${tx.amount}` : tx.amount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Paper>
    </Box>
  );
}