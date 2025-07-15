import { Badge, IconButton, Popover, List, ListItem, ListItemText } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import React, { useState, useEffect } from 'react';
import api from '../api'; // Axios instance with auth headers
import { useAuth } from '../authentication/AuthContext'; 

export default function NotificationsMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [requests, setRequests] = useState([]);
  const { user, loading } = useAuth();
  // Fetch pending requests
  const fetchRequests = async () => {
    try {
      const res = await api.get('/admin/subscriptions/pending');
      setRequests(res.data || []);
    } catch (err) {
      console.error('Error fetching signup requests', err);
    }
  };
  useEffect(() => {
    if (!loading && user?.role === 'ADMIN') {
      fetchRequests();
    } else {
      setRequests(null);
    }
  }, [loading, user]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    fetchRequests(); // Refresh on click
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'notification-popover' : undefined;

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
      <Badge badgeContent={requests?.length || 0} color="error">          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <List sx={{ minWidth: 300 }}>
          {!requests || requests.length === 0 ? (
            <ListItem>
              <ListItemText primary="Pas de demande en cours" />
            </ListItem>
          ) : (
            requests.map((req, index) => {
                const date = new Date(req.requestDate);
                const formattedDate = date.toLocaleString(); // Format to local readable string
              
                return (
                  <ListItem key={index} button component="a" href={`/admin/subscriptions`}>
                    <ListItemText
                      primary={`Nouvelle demande de ${req.username}`}
                      secondary={`API: ${req.api} • Date: ${formattedDate}`}
                    />
                  </ListItem>
                );
              })
          )}
        </List>
      </Popover>
    </>
  );
}
