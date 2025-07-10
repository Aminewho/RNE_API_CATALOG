import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Divider,
  Chip,
  Alert,
} from '@mui/material';
import api from '../../api'; // your Axios instance

export default function SubscriptionDetails() {
  const { id } = useParams();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const res = await api.get(`/admin/subscriptions/${id}`);
        setSubscription(res.data);
      } catch (err) {
        setError('Failed to load subscription details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!subscription) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">No subscription data found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Subscription Details
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>General Information</Typography>
        <Divider sx={{ mb: 2 }} />

        <Typography variant="body1"><strong>Username:</strong> {subscription.username}</Typography>
        <Typography variant="body1"><strong>API:</strong> {subscription.api}</Typography>
        <Typography variant="body1"><strong>Status:</strong> 
          <Chip 
            label={subscription.status}
            color={
              subscription.status === 'APPROVED' ? 'success' :
              subscription.status === 'REJECTED' ? 'error' : 'warning'
            }
            size="small"
            sx={{ ml: 1 }}
          />
        </Typography>
        <Typography variant="body1"><strong>Allowed Requests:</strong> {subscription.allowedRequests}</Typography>
        <Typography variant="body1"><strong>Used Requests:</strong> {subscription.usedRequests}</Typography>
        <Typography variant="body1"><strong>Request Date:</strong> {new Date(subscription.requestDate).toLocaleString()}</Typography>
        <Typography variant="body1"><strong>Approval Date:</strong> {subscription.approvalDate ? new Date(subscription.approvalDate).toLocaleString() : '-'}</Typography>
        {subscription.rejectionReason && (
          <Typography variant="body1" sx={{ mt: 2 }}>
            <strong>Rejection Reason:</strong> {subscription.rejectionReason}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
