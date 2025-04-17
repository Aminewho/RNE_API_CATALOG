import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminPage() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/admin/signups', {
        auth: {
          username: 'admin',
          password: 'admin123'  
        }
      })
      .then(response => setRequests(response.data))
      .catch(error => console.error("Error fetching signup requests", error));
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Admin Dashboard</h2>
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>Email</th>
            <th>Username</th>
            <th>API ID</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(req => (
            <tr key={req.id}>
              <td>{req.email}</td>
              <td>{req.username}</td>
              <td>{req.apiId}</td>
              <td>{req.approved ? "Approved" : "Not Approved"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
