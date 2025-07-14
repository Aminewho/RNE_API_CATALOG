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
  useTheme,
  styled,
  Card
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import AddCardIcon from '@mui/icons-material/AddCard';



export default function UserManagementPage() {
  const theme = useTheme();
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

      {/* Header */}
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
            Gestion des utilisateurs
          </Typography>
          <Box>
            <Tooltip title="Actualiser">
              <IconButton 
                onClick={fetchUsers}
                sx={{
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.3)'
                  }
                }}  
                >
                <RefreshIcon fontSize='large' />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Search and Filter */}
      <Paper elevation={0} sx={{ 
        p: 2, 
        mb: 3,
        borderRadius: 3,
        background: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="🔍Recherche d'utilisateurs par nom, mail ou entreprise..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            sx: { 
              borderRadius: 2,
              backgroundColor: '#f8f9fa',
              '&:hover': {
                backgroundColor: '#e9ecef'
              }
            }
          }}
        />
      </Paper>

      {/* User Table */}  
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
            height: '50vh'
        }}>
          <CircularProgress size={60} thickness={4} />
        </Box>
      ) : (
        <>
          <TableContainer>
            <Table>
              <TableHead sx={{ background: 'linear-gradient(45deg,rgb(10, 0, 101) 10%,rgb(7, 3, 223) 90%)'}}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700,fontSize:'18px',color: 'white' }}>Utilisateur</TableCell>
                  <TableCell sx={{ fontWeight: 700,fontSize:'18px',color: 'white' }}>Entreprise</TableCell>
                  <TableCell sx={{ fontWeight: 700,fontSize:'18px',color: 'white' }}>Contact Principal</TableCell>
                  <TableCell sx={{ fontWeight: 700,fontSize:'18px',color: 'white' }}>Contact Technique</TableCell>
                  <TableCell sx={{ fontWeight: 700,fontSize:'18px',color: 'white' }}>Statut</TableCell>
                  <TableCell sx={{ fontWeight: 700,fontSize:'18px',color: 'white' }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="flex-start">
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
                        <Stack direction="row" spacing={2} alignItems="flex-start">
                          <Avatar sx={{ 
                            bgcolor: theme.palette.primary.light,
                            color: theme.palette.primary.dark,
                            mt: 1
                          }}>
                            <BusinessIcon />
                          </Avatar>
                          <Box>
                            <Typography fontWeight={600}>
                              {user.raisonSociale}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {user.matriculeFiscale}
                            </Typography>
                            <Chip 
                              label={user.secteurActivite} 
                              size="small" 
                              variant="outlined"
                              sx={{ 
                                mt: 0.5,
                                borderColor: theme.palette.divider
                              }}
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                              <LocationIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                              <Typography variant="body2">
                                {user.adresse}
                              </Typography>
                            </Box>
                          </Box>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <PersonIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                            <Typography>
                              {user.nomPremierResponsable} {user.prenomPremierResponsable}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <EmailIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                            <Typography variant="body2">
                              {user.emailPremierResponsable}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <PhoneIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                            <Typography variant="body2">
                              {user.tel}
                            </Typography>
                          </Box>
                        </Grid>
                      </TableCell>

                      <TableCell>
                        {user.nomResponsableTechnique && (
                          <Grid item xs={12} sm={6}>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <PersonIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                              <Typography>
                                {user.nomResponsableTechnique} {user.prenomResponsableTechnique}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <EmailIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                              <Typography variant="body2">
                                {user.emailResponsableTechnique}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <PhoneIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                              <Typography variant="body2">
                                {user.telResponsableTechnique}
                              </Typography>
                            </Box>
                          </Grid>
                        )}
                      </TableCell>

                      <TableCell>
                        <Chip label="Active" color="success" size="small" variant="filled" onClick={()=>{}} />
                      </TableCell>

                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="Voir">
                            <IconButton onClick={() => handleViewUser(user.id)}>
                              <VisibilityIcon color="info" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Add funds">
                          <IconButton onClick={() => handleOpenFundsDialog(user)}>
                          <AddCardIcon color="primary" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body1" color="text.secondary">Aucun utilisateur trouvé</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}          
          <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredUsers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Lignes par page :"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
              sx={{ 
                borderTop: `1px solid ${theme.palette.divider}`,
                '& .MuiTablePagination-toolbar': {
                  minHeight: 60
                }
              }}
            />
        </>
      )}

      </Card>

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