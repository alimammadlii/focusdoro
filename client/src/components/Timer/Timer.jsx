import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  Typography,
  IconButton,
  Stack,
  Switch,
  FormControlLabel,
  useTheme,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  SkipNext,
  Settings,
  VolumeUp,
  VolumeOff,
} from '@mui/icons-material';
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

  const renderSessionDots = () => {
    const dots = [];
    for (let i = 0; i < settings.longBreakInterval; i++) {
      dots.push(
        <Box
          key={i}
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: i < consecutiveWorkSessions ? getProgressColor() : 'rgba(0, 0, 0, 0.1)',
            transition: 'background-color 0.3s ease',
          }}
        />
      );
    }
    return dots;
  };

  return (
    <>
      <Card
        sx={{
          p: 4,
          maxWidth: 500,
          mx: 'auto',
          mt: 4,
          textAlign: 'center',
          background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          borderRadius: 4,
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            color: 'text.primary',
            fontWeight: 500,
            mb: 4,
            letterSpacing: 1,
          }}
        >
          {getModeText()}
        </Typography>

        <Box
          sx={{
            position: 'relative',
            display: 'inline-flex',
            my: 4,
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: 300,
              height: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Background Circle */}
            <Box
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: 'rgba(0, 0, 0, 0.03)',
              }}
            />
            
            {/* Progress Circle */}
            <Box
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: `conic-gradient(${getProgressColor()} ${(timeLeft / getMaxTime()) * 100}%, transparent 0)`,
                transition: 'background 1s linear',
              }}
            />

            {/* Inner Circle */}
            <Box
              sx={{
                position: 'absolute',
                width: '85%',
                height: '85%',
                borderRadius: '50%',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant="h1"
                component="div"
                sx={{
                  fontSize: '4rem',
                  fontWeight: 300,
                  color: 'text.primary',
                  fontFamily: 'monospace',
                }}
              >
                {formatTime(timeLeft)}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Stack
          direction="row"
          spacing={3}
          justifyContent="center"
          sx={{ mb: 4 }}
        >
          <IconButton
            onClick={toggleTimer}
            color="primary"
            size="large"
            sx={{
              bgcolor: 'background.paper',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                bgcolor: 'background.paper',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            {isRunning ? <Pause /> : <PlayArrow />}
          </IconButton>
          <IconButton
            onClick={skipTimer}
            color="primary"
            size="large"
            sx={{
              bgcolor: 'background.paper',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                bgcolor: 'background.paper',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            <SkipNext />
          </IconButton>
          <IconButton
            onClick={onSettingsClick}
            color="primary"
            size="large"
            sx={{
              bgcolor: 'background.paper',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                bgcolor: 'background.paper',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            <Settings />
          </IconButton>
        </Stack>

        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
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

        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
            Completed Pomodoros: {completedPomodoros}
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            sx={{ mt: 2 }}
          >
            {renderSessionDots()}
          </Stack>
        </Box>

        <Box sx={{ mt: 4 }}>
          <AdBanner />
        </Box>
      </Card>
    </>
  );
};

export default Timer; 