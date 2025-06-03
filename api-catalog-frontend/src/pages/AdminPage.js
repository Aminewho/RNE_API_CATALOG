import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // instance Axios globale avec gestion de session

export default function AdminPage() {
  const [signupRequests, setSignupRequests] = useState([]);
  const [showFormId, setShowFormId] = useState(null);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/admin/signups');
        const data = response.data;
        console.log('status code:', response.status);
  
        if (Array.isArray(data)) {
          setSignupRequests(data);
        } else {
          setSignupRequests([]); // fallback to empty array
        }
      } catch (error) {
        console.error('Erreur lors du chargement des demandes :', error);
        // Redirection to login should be handled by interceptor
      }
    };
    fetchData();
  }, []);

  const handleApproveClick = (id) => {
    setShowFormId(id);
    setCredentials({ username: '', password: '' });
  };

  const handleFormSubmit = async (id) => {
    try {
      await api.put(`/admin/signups/${id}/approve`, credentials);
      alert('Demande approuvée !');
      setShowFormId(null);
      const updated = await api.get('/admin/signups');
      setSignupRequests(updated.data);
    } catch (error) {
      alert('Erreur lors de l\'approbation : ' + (error.response?.data || error.message));
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '100%' }}>
      <h2 className="mb-4 text-center">Admin Dashboard</h2>
      <div style={{ overflowX: 'auto' }}>
        <table className="table table-bordered table-hover table-sm">
          <thead className="table-dark">
            <tr>
              <th>Matricule Fiscale</th>
              <th>Secteur Activité</th>
              <th>Raison Sociale</th>
              <th>Adresse</th>
              <th>Nom Premier Responsable</th>
              <th>Prénom Premier Responsable</th>
              <th>Email Premier Responsable</th>
              <th>Nom Responsable Technique</th>
              <th>Prénom Responsable Technique</th>
              <th>Email Responsable Technique</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>IP</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {signupRequests.map((request) => (
              <tr key={request.id}>
                <td>{request.matriculeFiscale}</td>
                <td>{request.secteurActivite}</td>
                <td>{request.raisonSociale}</td>
                <td>{request.adresse}</td>
                <td>{request.nomPremierResponsable}</td>
                <td>{request.prenomPremierResponsable}</td>
                <td>{request.emailPremierResponsable}</td>
                <td>{request.nomResponsableTechnique}</td>
                <td>{request.prenomResponsableTechnique}</td>
                <td>{request.emailResponsableTechnique}</td>
                <td>{request.email}</td>
                <td>{request.tel}</td>
                <td>{request.ip}</td>
                <td>{request.status}</td>
                <td>
                  {request.status === 'NEW' && showFormId !== request.id && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleApproveClick(request.id)}
                    >
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
                        onChange={(e) =>
                          setCredentials({ ...credentials, username: e.target.value })
                        }
                      />
                      <input
                        type="password"
                        placeholder="Password"
                        className="form-control form-control-sm mb-1"
                        value={credentials.password}
                        onChange={(e) =>
                          setCredentials({ ...credentials, password: e.target.value })
                        }
                      />
                      <button
                        className="btn btn-primary btn-sm me-1"
                        onClick={() => handleFormSubmit(request.id)}
                      >
                        Confirm
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setShowFormId(null)}
                      >
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
    </div>
  );
}
