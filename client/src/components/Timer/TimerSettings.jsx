import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Stack,
} from '@mui/material';

const TimerSettings = ({ open, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = React.useState(settings);

  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setLocalSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Timer Settings</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField
            label="Work Duration (minutes)"
            type="number"
            value={localSettings.workDuration}
            onChange={handleChange('workDuration')}
            inputProps={{ min: 1, max: 60 }}
            fullWidth
          />
          <TextField
            label="Short Break Duration (minutes)"
            type="number"
            value={localSettings.shortBreakDuration}
            onChange={handleChange('shortBreakDuration')}
            inputProps={{ min: 1, max: 30 }}
            fullWidth
          />
          <TextField
            label="Long Break Duration (minutes)"
            type="number"
            value={localSettings.longBreakDuration}
            onChange={handleChange('longBreakDuration')}
            inputProps={{ min: 1, max: 60 }}
            fullWidth
          />
          <TextField
            label="Long Break Interval"
            type="number"
            value={localSettings.longBreakInterval}
            onChange={handleChange('longBreakInterval')}
            inputProps={{ min: 1, max: 10 }}
            fullWidth
            helperText="Number of work sessions before a long break"
          />
          <FormControlLabel
            control={
              <Switch
                checked={localSettings.autoStartBreaks}
                onChange={handleChange('autoStartBreaks')}
              />
            }
            label="Auto-start breaks"
          />
          <FormControlLabel
            control={
              <Switch
                checked={localSettings.autoStartPomodoros}
                onChange={handleChange('autoStartPomodoros')}
              />
            }
            label="Auto-start work sessions"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TimerSettings; 