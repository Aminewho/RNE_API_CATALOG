import React, { use, useContext } from 'react';
import { Box, IconButton, Badge } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AccountBalance from './AccountBalance';
import { useAuth } from '../authentication/AuthContext'; // Adjust path if needed
const WalletIcon = () => {
  const { user } = useAuth();
  if (user?.role !== 'ROLE_USER') return null; // hide for non-USER roles

  return (
    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
      <IconButton
        size="large"
        aria-label="wallet balance"
        color="inherit"
        sx={{ backgroundColor: '#3c6bd1' }}
      >
        <Badge>
          <AccountBalanceWalletIcon />
          <AccountBalance />
        </Badge>
      </IconButton>
    </Box>
  );
};

export default WalletIcon;
