import { Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from '../components/PrivateRoute';
import { PublicRoute } from '../components/PublicRoute';
import { Layout } from '../components/Layout';
import { Login } from '../pages/Login';
import { Signup } from '../pages/Signup';
import { Dashboard } from '../pages/Dashboard';
import { Projects } from '../pages/Projects';
import { Tasks } from '../pages/Tasks';
import { UserManagement } from '../pages/UserManagement';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* Private Routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/users" element={<UserManagement />} />
        </Route>
      </Route>

      {/* Default Route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
