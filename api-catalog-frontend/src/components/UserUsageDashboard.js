import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
}from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api';

export default function UserUsageDashboard({ userId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiFilter, setApiFilter] = useState('');
  const [error, setError] = useState('');
  const [totalRequests, setTotalRequests] = useState(0);
  const [subscribedApis, setSubscribedApis] = useState([]);
  const [selectedApi, setSelectedApi] = useState("");
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await api.get("/api/subscriptions/user");
        const approved = response.data
          .filter(sub => sub.status === "APPROVED")
          .map(sub => sub.api);
        setSubscribedApis(approved);
      } catch (err) {
        console.error("Failed to fetch subscriptions", err);
      }
    };
  
    fetchSubscriptions();
  }, []);
  const fetchUsage = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/dashboard/user-usage', {
      params: selectedApi ? { apiName: selectedApi } : {},
      headers: { 'Content-Type': 'application/json' },
      });
      console.log('filter', selectedApi);  
      const data = response.data;
      console.log("Fetched data:", data);

      if (!data || !data.aggregations || !data.aggregations["0"]) {
        setError("No usage data available");
        return;
      }
      // Assuming the response structure matches the expected format
    const buckets = data.aggregations["0"].buckets.map((bucket) => ({
      date: bucket.key_as_string,
      count: bucket["1-bucket"].doc_count,
    }));
    const total = buckets.reduce((sum, entry) => sum + entry.count, 0);
    setTotalRequests(total);
    setData(buckets);
    console.log("Processed data:", buckets);
} catch (error) {
    console.error("Failed to fetch usage:", error);
  }finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsage();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>API Usage Dashboard</Typography>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
  {/* Filter Form */}
  <Grid item xs={12} md={6}>
    <Card>
      <CardContent>
        <Typography variant="subtitle1" gutterBottom>
          Filter by API Name (optional)
        </Typography>
        <FormControl fullWidth variant="outlined" sx={{ minWidth: 250, mr: 2 }}>
  <InputLabel>Filter by API</InputLabel>
  <Select
    label="Filter by API"
    value={selectedApi}
    onChange={(e) => setSelectedApi(e.target.value)}
  >
    <MenuItem value="">All APIs</MenuItem>
    {subscribedApis.map((apiName, index) => (
      <MenuItem key={index} value={apiName}>
        {apiName}
      </MenuItem>
    ))}
  </Select>
</FormControl>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={fetchUsage}
        >
          REFRESH
        </Button>
      </CardContent>
    </Card>
  </Grid>

  {/* Total Requests */}
  <Grid item xs={12} md={6}>
    <Card sx={{ textAlign: 'center', backgroundColor: '#f4f6f8' }}>
      <CardContent>
        <Typography variant="subtitle1" gutterBottom>
          Total Requests
        </Typography>
        <Typography variant="h4" color="primary">
          {totalRequests}
        </Typography>
      </CardContent>
    </Card>
  </Grid>
</Grid>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(str) => str.slice(0, 10)} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#1976d2" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
      )}
    </Box>
  );
}
