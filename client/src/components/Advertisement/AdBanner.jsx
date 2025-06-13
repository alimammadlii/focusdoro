import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { useSubscription } from '../../context/SubscriptionContext';
import { useNavigate } from 'react-router-dom';

const AdBanner = () => {
  const { subscription } = useSubscription();
  const navigate = useNavigate();

  // Don't show ads for premium users
  if (subscription?.hasSubscription) {
    return null;
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        mb: 3,
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="h6" gutterBottom>
          Upgrade to Premium
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Remove ads and unlock premium features:
        </Typography>
        <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
          <li>Ad-free experience</li>
          <li>Unlimited tasks</li>
          <li>Advanced statistics</li>
          <li>Custom themes</li>
        </ul>
        <Button
          variant="contained"
          color="secondary"
          sx={{ mt: 2 }}
          onClick={() => navigate('/subscription')}
        >
          Upgrade Now
        </Button>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
        }}
      />
    </Paper>
  );
};

export default AdBanner; 