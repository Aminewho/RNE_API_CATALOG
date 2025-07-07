import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import {
  Box,
  Typography,
  Grid,
  Avatar,
  Paper,
  IconButton,
  InputAdornment,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  TextField,
  Tooltip,
  Chip,
  Stack,
  Dialog, 
  DialogTitle,
  DialogContent, 
  DialogActions, 
  Button, 
  TexField,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import AddCardIcon from '@mui/icons-material/AddCard';

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [fundsDialog, setFundsDialog] = useState({
    open: false,
    userId: null,
    username: '',
    amount: ''
  });
  
  // ─── open dialog when clicking the icon ─────────────────────────────────────
  const handleOpenFundsDialog = (u) => {
    setFundsDialog({ open: true, userId: u.id, username: u.username, amount: '' });
  };
  
  const handleCloseFundsDialog = () => setFundsDialog(prev => ({ ...prev, open: false }));
  
  const handleAmountChange = (e) =>
    setFundsDialog(prev => ({ ...prev, amount: e.target.value }));
  
  // ─── call backend ───────────────────────────────────────────────────────────
  const handleSubmitFunds = async () => {
    const amt = Number(fundsDialog.amount);
    if (isNaN(amt) || amt <= 0) return alert('Enter a valid amount');
    console.log('Funds added :', amt,fundsDialog.userId);

    try {
      await api.put(`/admin/add-funds/${fundsDialog.userId}`, { amount: amt });
      alert('Funds added!');
      handleCloseFundsDialog();
      fetchUsers();          // refresh list / balances if you display them
    } catch (err) {
      alert(err.response?.data || 'Failed to add funds');
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users');
      setUsers(response.data);
  
    } catch (error) {
      console.error('Error fetching users:', error);
      // Handle error (e.g., show snackbar)
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredUsers = users
    .filter(user => user.role === 'USER')
    .filter(user => 
      Object.values(user).some(
        value => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleViewUser = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        fetchUsers(); // Refresh the list
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };


  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">User Management</Typography>
        <Tooltip title="Refresh">
          <IconButton onClick={fetchUsers} color="primary">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search users by name, email or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
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
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Primary Contact</TableCell>
                  <TableCell>Technical Contact</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {user.username.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {user.username}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {user.email}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Typography variant="subtitle2">{user.raisonSociale}</Typography>
                        <Typography variant="body2" color="text.secondary">{user.matriculeFiscale}</Typography>
                        <Typography variant="body2">{user.secteurActivite}</Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="subtitle2">
                          {user.nomPremierResponsable} {user.prenomPremierResponsable}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {user.emailPremierResponsable}
                        </Typography>
                        <Typography variant="body2">{user.telPremierResponsable}</Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="subtitle2">
                          {user.nomResponsableTechnique} {user.prenomResponsableTechnique}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {user.emailResponsableTechnique}
                        </Typography>
                        <Typography variant="body2">{user.telResponsableTechnique}</Typography>
                      </TableCell>

                      <TableCell>
                        <Chip label="Active" color="success" size="small" variant="outlined" />
                      </TableCell>

                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="View">
                            <IconButton onClick={() => handleViewUser(user.id)}>
                              <VisibilityIcon color="info" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Add funds">
                          <IconButton onClick={() => handleOpenFundsDialog(user)}>
                          <AddCardIcon color="primary" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton onClick={() => handleDeleteUser(user.id)}>
                              <DeleteIcon color="error" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body1" color="text.secondary">No users found</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
      <Dialog open={fundsDialog.open} onClose={handleCloseFundsDialog}>
  <DialogTitle>Add Funds to {fundsDialog.username}</DialogTitle>

  <DialogContent>
    <TextField
      autoFocus
      fullWidth
      label="Amount (TND)"
      type="number"
      variant="outlined"
      value={fundsDialog.amount}
      onChange={handleAmountChange}
      inputProps={{ min: 1 }}
      sx={{ mt: 1 }}
    />
  </DialogContent>

  <DialogActions>
    <Button onClick={handleCloseFundsDialog}>Cancel</Button>
    <Button variant="contained" onClick={handleSubmitFunds}>Add</Button>
  </DialogActions>
</Dialog>

    </Box>
    
  )
  ;
}