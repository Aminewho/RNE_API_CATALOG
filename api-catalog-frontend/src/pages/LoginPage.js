import React, { useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
  
      const response = await axios.post('http://localhost:8080/login', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
  
      const role = response.data.role;
  
      if (role === 'ROLE_ADMIN') {
        navigate('/admin');
      } else if (role === 'ROLE_USER') {
        navigate('/user'); // or '/dashboard' or any other user-specific route
      } else {
        alert("Unknown role, cannot navigate.");
      }
  
    } catch (err) {
      alert("Login failed: " + (err.response?.data?.message || err.message));
    }
  };
  
  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h3 className="mb-4 text-center">Login </h3>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input 
            type="password" 
            className="form-control" 
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>

        <button type="submit" className="btn btn-primary w-100 mb-2">Login</button>
        <button 
          type="button"
          onClick={() => navigate(`/signup`)} 
          className="btn btn-outline-secondary w-100"
        >
          Signup Instead
        </button>
      </form>
    </div>
  );
}
