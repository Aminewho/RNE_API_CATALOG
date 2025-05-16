

import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminPage() {
  const [signupRequests, setSignupRequests] = useState([]);
  const [showFormId, setShowFormId] = useState(null); // To track which row's form is open
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/admin/signups', {
          withCredentials: true,
        });
        setSignupRequests(response.data);
      } catch (error) {
        console.error('Error fetching signup requests:', error);
      }
    };

    fetchData();
  }, []);

  const handleApproveClick = (id) => {
    setShowFormId(id); // Show form for this specific request
    setCredentials({ username: '', password: '' }); // Reset input
  };

  const handleFormSubmit = async (id) => {
    try {
      await axios.put(`http://localhost:8080/admin/signups/${id}/approve`, credentials, {
        withCredentials: true,
      });
      alert('Signup request approved!');
      setShowFormId(null);
      // Optionally refresh the list
      const updated = await axios.get('http://localhost:8080/admin/signups', { withCredentials: true });
      setSignupRequests(updated.data);
    } catch (error) {
      alert('Error approving request: ' + error.response?.data || error.message);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '90%' }}>
      <h2 className="mb-4 text-center">Admin Dashboard</h2>
      <table className="table table-bordered table-hover table-sm">
        <thead className="table-dark">
          <tr>
            <th>Matricule Fiscale</th>
            <th>Secteur Activité</th>
            <th>Raison Sociale</th>
            <th>Adresse</th>
            <th>Nom Premier Responsable</th>
            <th>Email Premier Responsable</th>
            <th>Nom Responsable Technique</th>
            <th>Email Responsable Technique</th>
            <th>Email</th>
            <th>Téléphone</th>
            <th>IP</th>
            <th>Status</th>
            <th>Actions</th> {/* New column */}
          </tr>
        </thead>
        <tbody>
          {signupRequests.map((request) => (
            <tr key={request.id}>
              <td>{request.matriculeFiscale}</td>
              <td>{request.secteurActivite}</td>
              <td>{request.raisonSociale}</td>
              <td>{request.adresse}</td>
              <td>{request.nomPremierResponsable} {request.prenomPremierResponsable}</td>
              <td>{request.emailPremierResponsable}</td>
              <td>{request.nomResponsableTechnique} {request.prenomResponsableTechnique}</td>
              <td>{request.emailResponsableTechnique}</td>
              <td>{request.email}</td>
              <td>{request.tel}</td>
              <td>{request.ip}</td>
              <td>{request.status}</td>
              <td>
                {request.status === 'NEW' && showFormId !== request.id && (
                  <button className="btn btn-success btn-sm" onClick={() => handleApproveClick(request.id)}>
                    Approve
                  </button>
                )}
                {showFormId === request.id && (
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Username"
                      className="form-control form-control-sm mb-1"
                      value={credentials.username}
                      onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      className="form-control form-control-sm mb-1"
                      value={credentials.password}
                      onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    />
                    <button className="btn btn-primary btn-sm me-1" onClick={() => handleFormSubmit(request.id)}>
                      Confirm
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setShowFormId(null)}>
                      Cancel
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
