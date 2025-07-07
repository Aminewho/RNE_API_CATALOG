import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  Button,
  Paper,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api';

export default function UserUsageDashboard({ userId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiFilter, setApiFilter] = useState('');
  const [error, setError] = useState('');
  const [totalRequests, setTotalRequests] = useState(0);

  const fetchUsage = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/dashboard/user-usage', {
      params: apiFilter ? { apiName: apiFilter } : {},
      headers: { 'Content-Type': 'application/json' },
      });
      console.log('filter', apiFilter);  
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
        <TextField
          label="API Name"
          variant="outlined"
          fullWidth
          value={apiFilter}
          onChange={(e) => setApiFilter(e.target.value)}
        />
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
