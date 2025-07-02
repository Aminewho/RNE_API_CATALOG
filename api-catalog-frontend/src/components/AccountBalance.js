import React from 'react';
import { Box, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import api from '../api';
import {useAuth} from '../authentication/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';
const AccountBalance = ({ currency = 'TND', size = 'medium' }) => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await api.get('/wallet');
        setBalance(response.data.balance);
      } catch (error) {
        setBalance('Error');
      } finally {
        setLoading(false);
      }
    };
    if (user.role === 'ROLE_USER') {
      fetchBalance();
    } else {
      setLoading(false);
    }
  });
  if (loading) return <CircularProgress size={20} />;
  if (balance === 'Error') return <Typography color="error">Failed to load balance</Typography>;
  if (user?.role !== 'ROLE_USER') return null;
  // Format balance based on currency
  const formatBalance = () => {
    return new Intl.NumberFormat('fr-FRANCE', {
      style: 'currency',
      minimumFractionDigits: 3,
      currency: currency
    }).format(balance);
  };

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Typography variant={size === 'small' ? 'body2' : 'body1'}>
        {formatBalance()}
      </Typography>
    </Box>
  );
};

export default AccountBalance;