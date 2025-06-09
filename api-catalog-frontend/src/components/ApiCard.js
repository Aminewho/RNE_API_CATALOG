import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';

export default function ApiCard({ api, selected, onToggle }) {
  return (
    <Box sx={{ width: '100%', maxWidth: 400, mb: 3, px: 1 }}>
      <Card
        sx={{
          backgroundColor: selected ? 'success.main' : 'primary.main',
          color: 'white',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <CardContent>
          <Typography variant="h6" noWrap title={api.name}>
            {api.name}
          </Typography>

          <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
            {api.description || 'No description available.'}
          </Typography>

          <Typography variant="body2">
            <div>Version: {api.version}</div>
            <div>Context: {api.context}</div>
          </Typography>

          <Button
            variant="contained"
            size="small"
            sx={{
              mt: 2,
              backgroundColor: selected ? 'white' : 'black',
              color: selected ? 'black' : 'white',
              '&:hover': {
                backgroundColor: selected ? '#f0f0f0' : '#333',
              },
            }}
            onClick={() => onToggle(api)}
          >
            {selected ? '-' : '+'}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
