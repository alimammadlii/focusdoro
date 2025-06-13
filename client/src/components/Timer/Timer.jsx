import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  SkipNext,
  Settings,
  VolumeUp,
  VolumeOff,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import AdBanner from '../Advertisement/AdBanner';

// Import sound files
import workCompleteSound from '../../assets/sounds/work-complete.mp3';
import breakCompleteSound from '../../assets/sounds/break-complete.mp3';

const Timer = ({ settings, onSettingsClick }) => {
  const theme = useTheme();
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('work');
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [consecutiveWorkSessions, setConsecutiveWorkSessions] = useState(0);

  const workSoundRef = useRef(new Audio(workCompleteSound));
  const breakSoundRef = useRef(new Audio(breakCompleteSound));

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const playSound = (soundRef) => {
    if (soundEnabled) {
      soundRef.current.currentTime = 0;
      soundRef.current.play().catch(error => {
        console.error('Error playing sound:', error);
      });
    }
  };

  const handleTimerComplete = async () => {
    if (mode === 'work') {
      const newCompletedPomodoros = completedPomodoros + 1;
      const newConsecutiveWorkSessions = consecutiveWorkSessions + 1;
      
      setCompletedPomodoros(newCompletedPomodoros);
      setConsecutiveWorkSessions(newConsecutiveWorkSessions);
      playSound(workSoundRef);

      // Save statistics
      try {
        await axios.post('http://localhost:5000/api/statistics/record', {
          type: 'pomodoro',
          duration: settings.workDuration,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      } catch (error) {
        console.error('Error saving statistics:', error);
      }

      if (newConsecutiveWorkSessions >= settings.longBreakInterval) {
        setMode('longBreak');
        setTimeLeft(settings.longBreakDuration * 60);
        setConsecutiveWorkSessions(0);
        if (settings.autoStartBreaks) {
          setIsRunning(true);
        }
      } else {
        setMode('shortBreak');
        setTimeLeft(settings.shortBreakDuration * 60);
        if (settings.autoStartBreaks) {
          setIsRunning(true);
        }
      }
    } else {
      setMode('work');
      setTimeLeft(settings.workDuration * 60);
      playSound(breakSoundRef);
      if (settings.autoStartPomodoros) {
        setIsRunning(true);
      }
    }
    setIsRunning(false);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const skipTimer = () => {
    handleTimerComplete();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressColor = () => {
    switch (mode) {
      case 'work':
        return theme.palette.primary.main;
      case 'shortBreak':
        return theme.palette.secondary.main;
      case 'longBreak':
        return theme.palette.secondary.dark;
      default:
        return theme.palette.primary.main;
    }
  };

  const getModeText = () => {
    switch (mode) {
      case 'work':
        return 'Focus Time';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
      default:
        return 'Focus Time';
    }
  };

  const getMaxTime = () => {
    switch (mode) {
      case 'work':
        return settings.workDuration * 60;
      case 'shortBreak':
        return settings.shortBreakDuration * 60;
      case 'longBreak':
        return settings.longBreakDuration * 60;
      default:
        return settings.workDuration * 60;
    }
  };

  return (
    <>
      <AdBanner />
      <Card
        sx={{
          p: 4,
          maxWidth: 500,
          mx: 'auto',
          mt: 4,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom>
          {getModeText()}
        </Typography>

        <Box
          sx={{
            position: 'relative',
            display: 'inline-flex',
            my: 4,
          }}
        >
          <CircularProgress
            variant="determinate"
            value={(timeLeft / getMaxTime()) * 100}
            size={200}
            thickness={4}
            sx={{ color: getProgressColor() }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h2" component="div" color="text.secondary">
              {formatTime(timeLeft)}
            </Typography>
          </Box>
        </Box>

        <Stack direction="row" spacing={2} justifyContent="center">
          <IconButton
            onClick={toggleTimer}
            color="primary"
            size="large"
            sx={{ bgcolor: 'background.paper' }}
          >
            {isRunning ? <Pause /> : <PlayArrow />}
          </IconButton>
          <IconButton
            onClick={skipTimer}
            color="primary"
            size="large"
            sx={{ bgcolor: 'background.paper' }}
          >
            <SkipNext />
          </IconButton>
          <IconButton
            onClick={onSettingsClick}
            color="primary"
            size="large"
            sx={{ bgcolor: 'background.paper' }}
          >
            <Settings />
          </IconButton>
        </Stack>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <FormControlLabel
            control={
              <Switch
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {soundEnabled ? <VolumeUp /> : <VolumeOff />}
                <Typography variant="body2" sx={{ ml: 1 }}>
                  Sound
                </Typography>
              </Box>
            }
          />
        </Box>

        <Typography variant="body1" sx={{ mt: 2 }}>
          Completed Pomodoros: {completedPomodoros}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Next long break after: {settings.longBreakInterval - consecutiveWorkSessions} sessions
        </Typography>
      </Card>
    </>
  );
};

export default Timer; 