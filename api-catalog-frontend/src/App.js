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
import Subscriptions from './pages/admin/Subscriptions';
import SubscriptionDetails from './pages/admin/SubscriptionDetails';
import ApiMarketplace from './pages/user/ApiMarketplace'; // adjust path if needed
import 'bootstrap/dist/css/bootstrap.min.css';
import UserSubscriptionsPage from './pages/user/UserSubscriptionsPage';
import TransactionsPage from './pages/user/TransactionsPage'; // adjust path if needed
import UserDetailPage from './pages/admin/UserDetailPage'; // adjust path if needed
import UserUsageDashboard from './components/UserUsageDashboard'; // adjust path if needed
function App() {
  return (
    <AuthProvider>
      <Router>
      <LayoutWithAppBar >
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
    path="/"
    element={
      <ProtectedRoute allowedRoles={['ROLE_USER']} >
        <AdminLayout />
      </ProtectedRoute>
    }>
          <Route path="dashboard" element={<UserUsageDashboard />} />
          <Route path="subscriptions" element={<UserSubscriptionsPage/>} />
          <Route path="apis" element={  <ApiMarketplace  />} />
          <Route path="transactions" element={<TransactionsPage />} />


  </Route>

  {/* Admin Protected Routes */}
  <Route path="/admin" element={
    <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
      <AdminLayout />
    </ProtectedRoute>
  }>
    <Route path="dashboard" element={<UserUsageDashboard/>} />
    <Route path="signup-requests" element={<SignupRequests />} />
    <Route path="users" element={<ManageUsers />} />
    <Route path="apis" element={<ManageAPIs />} />
    <Route path="wso2" element={<ManageWso2Instances />} />
    <Route path="subscriptions" element={<Subscriptions />} />
    <Route path="subscriptions/:id" element={<SubscriptionDetails />} />
    <Route path="users/:userId" element={<UserDetailPage />} />
  </Route>
</Routes>
        </LayoutWithAppBar>
      </Router>
    </AuthProvider>
  );
}

export default App;