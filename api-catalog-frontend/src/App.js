import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AdminLayout from './components/AdminLayout';
import ApiListPage from './pages/admin/ApiListPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ManageUsers from './pages/admin/ManageUsers';
import ManageAPIs from './pages/admin/ManageAPIs';
import ManageWso2Instances from './pages/admin/ManageWso2Instances';
import AuthHandler from './authentication/AuthHandler';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import { AuthProvider } from './authentication/AuthContext';
import LayoutWithAppBar from './components/LayoutWithAppBar'; // adjust path if needed
import SignupRequests from './pages/admin/SignupRequests';
import SubscriptionRequests from './pages/admin/SubscriptionRequests';
import ApiMarketplace from './pages/user/ApiMarketplace'; // adjust path if needed
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <AuthProvider>
      <Router>
      <LayoutWithAppBar>
        <AuthHandler />
        <Routes>
  {/* Public Routes */}
  <Route path="/" element={<ApiListPage />} />
  <Route
    path="/login"
    element={
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    }
  />
  <Route
    path="/signup"
    element={
      <PublicRoute>
        <SignupPage />
      </PublicRoute>
    }
  />

  {/* Protected Routes */}
  <Route
    path="/apis"
    element={
      <ProtectedRoute allowedRoles={['ROLE_USER']} >
        <ApiMarketplace  />
      </ProtectedRoute>
    }
  />

  {/* Admin Protected Routes */}
  <Route path="/admin" element={
    <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
      <AdminLayout />
    </ProtectedRoute>
  }>
    <Route path="dashboard" element={<ApiListPage />} />
    <Route path="signup-requests" element={<SignupRequests />} />
    <Route path="users" element={<ManageUsers />} />
    <Route path="apis" element={<ManageAPIs />} />
    <Route path="wso2" element={<ManageWso2Instances />} />
    <Route path="subscriptions" element={<SubscriptionRequests />} />


  </Route>
</Routes>
        </LayoutWithAppBar>
      </Router>
    </AuthProvider>
  );
}

export default App;
