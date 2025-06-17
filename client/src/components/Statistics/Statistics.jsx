import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdBanner from '../Advertisement/AdBanner';
import { useSubscription } from '../../context/SubscriptionContext';

const Statistics = () => {
  const navigate = useNavigate();
  const { subscription } = useSubscription();
  const [stats, setStats] = useState({
    daily: [],
    weekly: [],
    totalPomodoros: 0,
    totalFocusTime: 0,
    dailyStreak: 0,
    averagePomodoros: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await axios.get('/api/statistics', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setError('Failed to load statistics. Please try again.');
      setLoading(false);
    }
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4, px: 2 }}>
      {!subscription?.hasSubscription && <AdBanner />}
      
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Total Pomodoros
            </Typography>
            <Typography variant="h4">{stats.totalPomodoros}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Total Focus Time
            </Typography>
            <Typography variant="h4">{formatTime(stats.totalFocusTime)}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Daily Streak
            </Typography>
            <Typography variant="h4">{stats.dailyStreak} days</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Avg. Pomodoros/Day
            </Typography>
            <Typography variant="h4">{stats.averagePomodoros.toFixed(1)}</Typography>
          </Card>
        </Grid>

        {/* Advanced Statistics (Premium Only) */}
        {subscription?.hasSubscription ? (
          <>
            {/* Daily Pomodoros Chart */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Daily Pomodoros
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.daily}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="pomodoros" fill="#8884d8" name="Pomodoros" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Card>
            </Grid>

            {/* Weekly Focus Time Chart */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Weekly Focus Time
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.weekly}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="focusTime"
                        stroke="#82ca9d"
                        name="Focus Time (minutes)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Card>
            </Grid>
          </>
        ) : (
          <Grid item xs={12}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Unlock Advanced Statistics
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Upgrade to Premium to access detailed analytics, including daily and weekly trends,
                productivity patterns, and more.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/subscription')}
              >
                Upgrade to Premium
              </Button>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Statistics; 