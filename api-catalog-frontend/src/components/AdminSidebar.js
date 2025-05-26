import React from 'react';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AdminSidebar() {
  return (
    <div className="d-flex flex-column p-3 bg-dark text-white" style={{ height: '100vh', width: '250px' }}>
      <h4 className="mb-4">Admin Panel</h4>
      <ul className="nav nav-pills flex-column">
        <li className="nav-item">
          <NavLink to="/admin/dashboard" className="nav-link text-white" activeclassname="active">
            Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/admin/signup-requests" className="nav-link text-white" activeclassname="active">
            Signup Requests
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/admin/users" className="nav-link text-white" activeclassname="active">
            Manage Users
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/admin/apis" className="nav-link text-white" activeclassname="active">
            Manage APIs
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/admin/wso2" className="nav-link text-white" activeclassname="active">
            Manage wso2 instances
          </NavLink>
        </li>
        <li className="nav-item mt-3">
          <NavLink to="/logout" className="nav-link text-danger">
            Logout
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
