import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ApiListPage from './pages/ApiListPage';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import SignupPage from './pages/SignupPage';
import AdminPage from './pages/AdminPage';

function App() {
  const handleListApis = () => {
    // Logic for listing APIs (e.g., redirecting to "/")
    console.log("Listing APIs...");
  };

  return (
    <Router>
      <Navbar onListApis={handleListApis} />  
      <Routes>
        <Route path="/" element={<ApiListPage />} />
        <Route path="/login/:apiId" element={<LoginPage />} />      
        <Route path="/signup/:apiId" element={<SignupPage />} />
        <Route path="/admin" element={<AdminPage />} /> {/* <-- Admin Route */}
      </Routes>
    </Router>
  );
}
export default App; 

