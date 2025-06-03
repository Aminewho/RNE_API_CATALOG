import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // assuming your configured axios instance

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // ← Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/admin/users');
        setUsers(response.data);
        setLoading(false); // Data loaded
      } catch (error) {
        console.error('Error fetching users:', error);
        // Redirect immediately if not authenticated (e.g. intercepted)
       // navigate('/login'); // Optional: you may also rely on global interceptor
      }
    };

    fetchUsers();
  }, [navigate]);

  //if (loading) return null; // ⛔ Don’t render anything until data is fetched

  return (
    <div className="container mt-5" style={{ maxWidth: '100%' }}>
      <h2 className="mb-4 text-center">User Management</h2>
      <div style={{ overflowX: 'auto' }}>
        <table className="table table-bordered table-hover table-sm">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Matricule Fiscale</th>
              <th>Secteur Activité</th>
              <th>Raison Sociale</th>
              <th>Adresse</th>
              <th>Nom Premier Responsable</th>
              <th>Prénom Premier Responsable</th>
              <th>Email Premier Responsable</th>
              <th>Tél Premier Responsable</th>
              <th>Nom Responsable Technique</th>
              <th>Prénom Responsable Technique</th>
              <th>Email Responsable Technique</th>
              <th>Tél Responsable Technique</th>
              <th>Tél</th>
              <th>Email</th>
              <th>IP Autorisée</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter((user) => user.role === 'ROLE_USER')
              .map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.matriculeFiscale}</td>
                  <td>{user.secteurActivite}</td>
                  <td>{user.raisonSociale}</td>
                  <td>{user.adresse}</td>
                  <td>{user.nomPremierResponsable}</td>
                  <td>{user.prenomPremierResponsable}</td>
                  <td>{user.emailPremierResponsable}</td>
                  <td>{user.telPremierResponsable}</td>
                  <td>{user.nomResponsableTechnique}</td>
                  <td>{user.prenomResponsableTechnique}</td>
                  <td>{user.emailResponsableTechnique}</td>
                  <td>{user.telResponsableTechnique}</td>
                  <td>{user.tel}</td>
                  <td>{user.email}</td>
                  <td>{user.ipAutorisee}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
