import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Button, Grid, Container } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';

const plans = [
  {
    name: 'Free',
    price: '0',
    features: [
      'Basic timer functionality',
      'Limited task management',
      'Basic statistics',
      'Ad-supported'
    ],
    plan: 'free'
  },
  {
    name: 'Premium',
    price: '2.99',
    features: [
      'Ad-free experience',
      'Unlimited tasks',
      'Advanced statistics',
      'Custom themes'
    ],
    plan: 'premium'
  }
];

const SubscriptionPlans = () => {
  const theme = useTheme();
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await axios.get('/api/subscriptions/status');
      setCurrentPlan(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching subscription status:', error);
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan) => {
    try {
      // In a real application, this would integrate with a payment processor
      // For now, we'll simulate a successful payment
      const response = await axios.post('/api/subscriptions', {
        plan,
        paymentId: 'simulated_payment_' + Date.now()
      });
      
      setCurrentPlan(response.data);
      // Show success message or redirect
    } catch (error) {
      console.error('Error subscribing:', error);
      // Show error message
    }
  };

  const handleCancel = async () => {
    try {
      await axios.post('/api/subscriptions/cancel');
      fetchSubscriptionStatus();
      // Show success message
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      // Show error message
    }
  };

  if (loading) {
    return <Typography>Loading subscription information...</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Choose Your Plan
      </Typography>
      
      {currentPlan?.hasSubscription && (
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h6">
            Current Plan: {currentPlan.plan.charAt(0).toUpperCase() + currentPlan.plan.slice(1)}
          </Typography>
          <Typography>
            {currentPlan.remainingDays} days remaining
          </Typography>
          <Button
            variant="outlined"
            color="error"
            onClick={handleCancel}
            sx={{ mt: 2 }}
          >
            Cancel Subscription
          </Button>
        </Box>
      )}

      <Grid container spacing={4} justifyContent="center">
        {plans.map((plan) => (
          <Grid item xs={12} sm={6} md={4} key={plan.name}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                ...(currentPlan?.plan === plan.plan && {
                  border: `2px solid ${theme.palette.primary.main}`,
                }),
              }}
            >
              {currentPlan?.plan === plan.plan && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bgcolor: 'primary.main',
                    color: 'white',
                    px: 2,
                    py: 0.5,
                    borderBottomLeftRadius: 8,
                  }}
                >
                  Current Plan
                </Box>
              )}
              
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {plan.name}
                </Typography>
                <Typography variant="h4" component="div" gutterBottom>
                  ${plan.price}
                  <Typography component="span" variant="subtitle1">
                    /month
                  </Typography>
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {plan.features.map((feature, index) => (
                    <Typography key={index} sx={{ mb: 1 }}>
                      • {feature}
                    </Typography>
                  ))}
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 3 }}
                  onClick={() => handleSubscribe(plan.plan)}
                  disabled={currentPlan?.plan === plan.plan}
                >
                  {currentPlan?.plan === plan.plan ? 'Current Plan' : 'Subscribe'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SubscriptionPlans; 