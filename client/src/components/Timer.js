import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Timer = () => {
  const [mode, setMode] = useState('pomodoro');
  const [duration, setDuration] = useState(25 * 60); // 25 minutes in seconds
  const [remainingTime, setRemainingTime] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);

  const recordPomodoro = async () => {
    try {
      await axios.post('/api/statistics/record', {
        type: 'pomodoro',
        duration: 25 * 60 // 25 minutes in seconds
      });
    } catch (error) {
      console.error('Error recording pomodoro:', error);
    }
  };

  const handleComplete = () => {
    if (mode === 'pomodoro') {
      recordPomodoro();
    }
    // ... rest of the existing handleComplete function ...
  };

  // ... rest of the component ...
};

export default Timer; 