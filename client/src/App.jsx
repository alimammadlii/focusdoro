import React, { useState, Suspense, lazy } from 'react';
import { ThemeProvider, CssBaseline, Container, Box, CircularProgress } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import theme from './theme';
import Navbar from './components/Navigation/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { SubscriptionProvider } from './context/SubscriptionContext';

// Lazy load components
const Timer = lazy(() => import('./components/Timer/Timer'));
const TimerSettings = lazy(() => import('./components/Timer/TimerSettings'));
const TaskList = lazy(() => import('./components/Tasks/TaskList'));
const Statistics = lazy(() => import('./components/Statistics/Statistics'));
const SubscriptionPlans = lazy(() => import('./components/Subscription/SubscriptionPlans'));
const Profile = lazy(() => import('./components/Profile/Profile'));

const defaultSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
};

function App() {
  const [settings, setSettings] = useState(defaultSettings);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleSettingsSave = (newSettings) => {
    setSettings(newSettings);
  };

  const LoadingFallback = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </Box>
  );

  const MainLayout = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route
              path="/timer"
              element={
                <>
                  <Timer
                    settings={settings}
                    onSettingsClick={() => setIsSettingsOpen(true)}
                  />
                  <TimerSettings
                    open={isSettingsOpen}
                    onClose={() => setIsSettingsOpen(false)}
                    settings={settings}
                    onSave={handleSettingsSave}
                  />
                </>
              }
            />
            <Route path="/" element={<Navigate to="/timer" replace />} />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <TaskList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/statistics"
              element={
                <ProtectedRoute>
                  <Statistics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/subscription"
              element={
                <ProtectedRoute>
                  <SubscriptionPlans />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </Container>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SubscriptionProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/*" element={<MainLayout />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </SubscriptionProvider>
    </ThemeProvider>
  );
}

export default App;