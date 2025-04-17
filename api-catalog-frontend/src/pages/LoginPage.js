import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function LoginPage() {
  const { apiId } = useParams();
  const navigate = useNavigate();

  const handleSignupRedirect = () => {
    navigate(`/signup/${apiId}`);
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h3 className="mb-4 text-center">Login to Access API</h3>
      <p className="text-muted text-center">API ID: <strong>{apiId}</strong></p>
      
      <form>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input type="text" className="form-control" placeholder="Enter your username" />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" placeholder="Enter your password" />
        </div>

        <button type="submit" className="btn btn-primary w-100 mb-2">Login</button>

        <button 
          type="button"
          onClick={handleSignupRedirect} 
          className="btn btn-outline-secondary w-100"
        >
          Signup Instead
        </button>
      </form>
    </div>
  );
}

