import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import axios from 'axios';
import AdBanner from '../Advertisement/AdBanner';
import { useSubscription } from '../../context/SubscriptionContext';

const FREE_TASK_LIMIT = 5;

const TaskList = () => {
  const { subscription } = useSubscription();
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState('');
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    estimatedPomodoros: 1,
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks. Please try again.');
    }
  };

  const handleOpen = () => {
    // Check task limit for free users
    if (!subscription?.hasSubscription && tasks.length >= FREE_TASK_LIMIT) {
      setError(`Free users can only create up to ${FREE_TASK_LIMIT} tasks. Upgrade to Premium for unlimited tasks.`);
      return;
    }
    setOpen(true);
    setError('');
  };

  const handleClose = () => {
    setOpen(false);
    setEditingTask(null);
    setTaskForm({
      title: '',
      description: '',
      estimatedPomodoros: 1,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!taskForm.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      if (editingTask) {
        await axios.put(
          `http://localhost:5000/api/tasks/${editingTask._id}`,
          taskForm,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
      } else {
        await axios.post(
          'http://localhost:5000/api/tasks',
          taskForm,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
      }
      handleClose();
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
      setError(error.response?.data?.message || 'Failed to save task. Please try again.');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description || '',
      estimatedPomodoros: task.estimatedPomodoros || 1,
    });
    setOpen(true);
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task. Please try again.');
    }
  };

  const handleComplete = async (taskId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/tasks/${taskId}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      fetchTasks();
    } catch (error) {
      console.error('Error completing task:', error);
      setError('Failed to complete task. Please try again.');
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <AdBanner />
      <Card sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">Tasks</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpen}
          >
            Add Task
          </Button>
        </Box>

        {!subscription?.hasSubscription && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {tasks.length} / {FREE_TASK_LIMIT} tasks (Free Plan)
          </Typography>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <List>
          {tasks.map((task) => (
            <ListItem
              key={task._id}
              sx={{
                mb: 1,
                bgcolor: 'background.paper',
                borderRadius: 1,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        textDecoration: task.completed ? 'line-through' : 'none',
                        color: task.completed ? 'text.secondary' : 'text.primary',
                      }}
                    >
                      {task.title}
                    </Typography>
                    <Chip
                      size="small"
                      label={`${task.estimatedPomodoros} pomodoro${task.estimatedPomodoros > 1 ? 's' : ''}`}
                    />
                  </Box>
                }
                secondary={task.description}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="complete"
                  onClick={() => handleComplete(task._id)}
                  sx={{ mr: 1 }}
                >
                  <CheckIcon color={task.completed ? 'success' : 'action'} />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => handleEdit(task)}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(task._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editingTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="title"
              label="Title"
              type="text"
              fullWidth
              value={taskForm.title}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="description"
              label="Description"
              type="text"
              fullWidth
              multiline
              rows={3}
              value={taskForm.description}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="estimatedPomodoros"
              label="Estimated Pomodoros"
              type="number"
              fullWidth
              value={taskForm.estimatedPomodoros}
              onChange={handleChange}
              inputProps={{ min: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              {editingTask ? 'Save Changes' : 'Add Task'}
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </Box>
  );
};

export default TaskList; 