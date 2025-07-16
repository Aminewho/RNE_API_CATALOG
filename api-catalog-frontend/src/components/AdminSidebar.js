import React from 'react';
import { NavLink } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, ListItemButton, Toolbar, Box } from '@mui/material';

const drawerWidth = 240;

export default function AdminSidebar() {
  const navItems = [
    { label: 'Tableau de bord', path: '/admin/dashboard' },
    { label: "Demandes d'Inscriptions", path: '/admin/signup-requests' },
    { label: 'Gestion des utilisateurs', path: '/admin/users' },
    { label: 'Gestion des API', path: '/admin/apis' },
    { label: 'Gestion des instances WSO2', path: '/admin/wso2' },
    { label: 'Se Déconnecter', path: '/logout', danger: true }
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#212121',
          color: '#fff',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {navItems.map(({ label, path, danger }) => (
            <ListItem key={label} disablePadding>
              <ListItemButton
                component={NavLink}
                to={path}
                sx={{
                  color: danger ? '#f44336' : '#fff',
                  '&.active': {
                    backgroundColor: '#424242',
                  },
                }}
              >
                <ListItemText primary={label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}