import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../authentication/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { fetchUser } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await axios.post('http://localhost:8080/login', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      await fetchUser(); // Make sure AuthContext is updated before redirecting

      const role = response.data.role;
      if (role === 'ROLE_ADMIN') {
        navigate('/admin');
      } else if (role === 'ROLE_USER') {
        navigate('/user');
      } else {
        alert('Unknown role, cannot navigate.');
      }

    } catch (err) {
      alert('Login failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h3 className="mb-4 text-center">Login</h3>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <div className="input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowPassword(prev => !prev)}
              tabIndex={-1}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-100 mb-3">Login</button>

        <div className="text-center">
          <small>
            Don’t have an account?{' '}
            <span
              style={{ color: '#0d6efd', cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => navigate('/signup')}
            >
              Signup Instead
            </span>
          </small>
        </div>
      </form>
    </div>
  );
}
