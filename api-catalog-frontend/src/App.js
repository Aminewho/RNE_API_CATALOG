import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AdminLayout from './components/AdminLayout';
import ApiListPage from './pages/ApiListPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminPage from './pages/AdminPage';
import ManageUsers from './pages/ManageUsers';
import ManageAPIs from './pages/ManageAPIs';
import ManageWso2Instances from './pages/ManageWso2Instances';
import AuthHandler from './authentication/AuthHandler';  
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const handleListApis = () => {
    console.log("Listing APIs...");
  };

  return (
    <Router>
      <AuthHandler /> 
      <Navbar/>
      <Routes>
        <Route path="/" element={<ApiListPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        {/* Admin Section with Sidebar Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminPage />} />
          <Route path="signup-requests" element={<AdminPage />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="apis" element={<ManageAPIs />} />
          <Route path="wso2" element={<ManageWso2Instances/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;