import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  TextField,
  Grid,
  Divider,
  Switch,
  FormControlLabel,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Edit as EditIcon,
  Notifications as NotificationsIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  Security as SecurityIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'JD',
    preferences: {
      notifications: true,
      darkMode: false,
      soundEnabled: true,
      autoStartBreaks: true,
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // TODO: Implement save functionality
  };

  const handlePreferenceChange = (preference) => {
    setUserData({
      ...userData,
      preferences: {
        ...userData.preferences,
        [preference]: !userData.preferences[preference],
      },
    });
  };

  const settings = [
    {
      title: 'Notifications',
      description: 'Enable or disable notifications',
      icon: <NotificationsIcon />,
      preference: 'notifications',
    },
    {
      title: 'Sound',
      description: 'Enable or disable sound effects',
      icon: <PaletteIcon />,
      preference: 'soundEnabled',
    },
    {
      title: 'Auto-start Breaks',
      description: 'Automatically start breaks after work sessions',
      icon: <LanguageIcon />,
      preference: 'autoStartBreaks',
    },
  ];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: 'primary.main',
                fontSize: '2rem',
                mr: 3,
              }}
            >
              {userData.avatar}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              {isEditing ? (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Name"
                      value={userData.name}
                      onChange={(e) =>
                        setUserData({ ...userData, name: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={userData.email}
                      onChange={(e) =>
                        setUserData({ ...userData, email: e.target.value })
                      }
                    />
                  </Grid>
                </Grid>
              ) : (
                <>
                  <Typography variant="h4" gutterBottom>
                    {userData.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {userData.email}
                  </Typography>
                </>
              )}
            </Box>
            <IconButton
              color="primary"
              onClick={isEditing ? handleSave : handleEdit}
              sx={{ ml: 2 }}
            >
              {isEditing ? <SaveIcon /> : <EditIcon />}
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Preferences
          </Typography>
          <List>
            {settings.map((setting, index) => (
              <React.Fragment key={setting.title}>
                <ListItem>
                  <ListItemIcon>{setting.icon}</ListItemIcon>
                  <ListItemText
                    primary={setting.title}
                    secondary={setting.description}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={userData.preferences[setting.preference]}
                        onChange={() => handlePreferenceChange(setting.preference)}
                        color="primary"
                      />
                    }
                    label=""
                  />
                </ListItem>
                {index < settings.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SecurityIcon />}
          onClick={() => {/* TODO: Implement password change */}}
        >
          Change Password
        </Button>
      </Box>
    </Box>
  );
};

export default Profile; 