import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from './store/useAuthStore';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import WorkspaceDetail from './pages/WorkspaceDetail';
import BoardPage from './pages/BoardPage';
import SettingsPage from './pages/SettingsPage';
import MyBoardsPage from './pages/MyBoardsPage';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import socketService from './services/socket';

function App() {
  const { user, getProfile } = useAuthStore();

  useEffect(() => {
    // Check for existing session
    getProfile();
  }, [getProfile]);

  useEffect(() => {
    if (user) {
      socketService.connect();
      socketService.emit('join_user_room', user._id);
      return () => socketService.disconnect();
    }
  }, [user]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={!user ? <LandingPage /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/dashboard" />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/boards" element={<MyBoardsPage />} />
            <Route path="/workspace/:workspaceId" element={<WorkspaceDetail />} />
            <Route path="/board/:boardId" element={<BoardPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

// Need to import Outlet for the layout nesting
import { Outlet } from 'react-router-dom';

export default App;
