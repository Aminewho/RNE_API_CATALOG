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
  MenuItem,
  useTheme,
  Paper,
  Fade
}from '@mui/material';
import { FilterAlt, Refresh } from '@mui/icons-material';
import { Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api';

export default function UserUsageDashboard({ userId }) {
  const theme = useTheme();
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
    <Fade in timeout={500}>
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
          minWidth: '800px',
          backgroundColor: 'lightgray',
    }}>
      {/* Header Section */}
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
            Tableau de bord de l'utilisation des API
          </Typography>
        </Box>
      </Paper>      
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Track and analyze your API consumption
      </Typography>

      {/* Filter and Total Requests Section */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        
        {/* Filter Form */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            border: `1px solid ${theme.palette.divider}`,
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
                <FilterAlt fontSize="small" />Filtrer par nom d'API (optionnel)
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={8}>
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
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<Refresh />}
                    onClick={fetchUsage}
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      textTransform: 'none',
                      fontWeight: 600,
                      boxShadow: 'none',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    REFRESH
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Requests */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            borderRadius: 3,
            background: 'linear-gradient(195deg, rgb(102, 187, 106), rgb(67, 160, 71))',
            color: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            height: '145px'
          }}>
            <CardContent sx={{ p: 3, height: '100%' }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                height: '100%'
              }}>
                <Typography variant="h6" gutterBottom>
                  Nombre total de requêtes API
                </Typography>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                    {totalRequests}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Usage Chart */}
      <Box sx={{ 
        mt: 4,
        p: 3,
        borderRadius: 3,
        backgroundColor: theme.palette.background.default,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
      }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, mb: 3 }}>
          API Request Trend
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : error ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: 300,
            backgroundColor: theme.palette.error.light,
            borderRadius: 2,
            p: 3
          }}>
            <Typography color="error" variant="h6">{error}</Typography>
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8} />
                <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
              </linearGradient>
            </defs>  
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis dataKey="date" tickFormatter={(str) => str.slice(0, 10)} tick={{ fill: theme.palette.text.secondary }} />
            <YAxis allowDecimals={false} tick={{ fill: theme.palette.text.secondary }} />
            <Tooltip  
              contentStyle={{
                borderRadius: 8,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: theme.shadows[3],
                backgroundColor: theme.palette.background.paper
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="count" 
              stroke={theme.palette.primary.main} 
              fillOpacity={1} 
              fill="url(#colorCount)" 
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke={theme.palette.primary.main} 
              strokeWidth={2} 
              dot={{ r: 4, fill: theme.palette.primary.main }}
              activeDot={{ r: 6, stroke: theme.palette.primary.dark, strokeWidth: 2 }} 
            />
          </LineChart>
        </ResponsiveContainer>
        )}
      </Box>    
    </Box>
    </Fade>
  );
}