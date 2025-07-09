import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';


const drawerWidth = 240;

export default function AdminLayout() {
  return (
    <Box sx={{ display: 'flex' }}>
 
      <Toolbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          //marginLeft: `${drawerWidth}px`,
          margin: '0px',
          padding: '0px',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
