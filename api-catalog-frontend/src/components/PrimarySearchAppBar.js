import * as React from 'react';
import { useAuth } from '../authentication/AuthContext';
import NotificationsMenu from './NotificationsMenu'; 
import AccountBalance from './AccountBalance';
import { styled, alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PeopleIcon from '@mui/icons-material/People';
import ApiIcon from '@mui/icons-material/Api';
import StorageIcon from '@mui/icons-material/Storage';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Wallet } from '@mui/icons-material';
import WalletIcon from './WalletIcon';
import { blue, grey } from '@mui/material/colors';
import { Avatar } from '@mui/material';


const drawerWidth = 240;


const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function CombinedApp() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const { user, loading } = useAuth();

  // Define nav items based on role
  const navItems = React.useMemo(() => {
    if (!user) return [];

    if (user.role === 'ROLE_ADMIN') {
      return [
        { label: 'Tableau de bord', path: '/admin/dashboard', icon: <DashboardIcon /> },
        { label: 'Gestion des Abonnements', path: '/admin/subscriptions', icon: <InboxIcon /> },
        { label: "Demandes d'Inscriptions", path: '/admin/signup-requests', icon: <GroupAddIcon /> },
        { label: 'Gestion des utilisateurs', path: '/admin/users', icon: <PeopleIcon /> },
        { label: 'Gestion des API', path: '/admin/apis', icon: <ApiIcon /> },
        { label: 'Gestion des Instances WSO2', path: '/admin/wso2', icon: <StorageIcon /> },
        { label: 'Se Déconnecter', path: '/logout', icon: <LogoutIcon />, danger: true }
      ];
    }

    if (user.role === 'ROLE_USER') {
      return [
        { label: 'Tableau de bord', path: '/dashboard', icon: <DashboardIcon /> },
        { label: 'Les API', path: '/apis', icon: <ApiIcon /> },
        { label: 'Les Abonnements', path: '/subscriptions', icon: <InboxIcon/> },
        { label: 'Les Transactions', path: '/transactions', icon: <AccountBalanceWalletIcon /> },
        { label: 'Se Déconnecter', path: '/logout', icon: <LogoutIcon />, danger: true }
      ];
    }

    return [];
  }, [user]);

  // Don't render anything until auth is loaded
  if (loading) return null;

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">

        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          color="inherit"
        >
          <Badge  color="error">
            <NotificationsMenu />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{ backgroundColor:'#222f72'  }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <logo/>
          <Box
            component="img"
            src="/tt.png" // Assuming the image is placed in the public folder
            alt="RNE "
            sx={{ height: 50, width :400 , display: { xs: 'none', sm: 'block' }, objectFit: "contain "  }}
          />
         
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex'} }}>
           <WalletIcon />
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge  color="error">
              <NotificationsMenu />
              </Badge>
            </IconButton>
            <Avatar 
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              sx={{ 
                marginTop: 1,
                backgroundColor: '#3c6bd1', 
                color: 'white',
                width: 50,
                height: 50,
                mr: 3,
                fontSize: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: `2px solid ${grey[300]}`,
                boxShadow: `0 2px 4px ${alpha(grey[500], 0.2)}`,
                '&:hover': {
                  backgroundColor: alpha(blue[500], 0.1),
                  boxShadow: `0 4px 8px ${alpha(grey[500], 0.3)}`,
                }
              }}
            >
              {user?.username?.charAt(0).toUpperCase() ?? '?'}
            </Avatar>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {navItems.map((item) => (
            <ListItem 
              key={item.path} 
              disablePadding
              sx={{
                ...(item.danger && {
                  '& .MuiListItemText-primary, & .MuiListItemIcon-root': {
                    color: 'error.main'
                  }
                })
              }}
            >
              <ListItemButton component="a" href={item.path}>
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {/* Your main content goes here */}
      </Main>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}