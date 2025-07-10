import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';


const drawerWidth = 240;

export default function AdminLayout() {
  return (
    <Box sx={{ display: 'flex',backgroundColor: '#202531' }}>
 
     
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: `${drawerWidth}px`,
      
       
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
