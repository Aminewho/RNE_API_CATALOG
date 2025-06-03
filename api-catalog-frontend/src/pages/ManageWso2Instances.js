import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api'; 
const ManageWso2Instances = () => {
  const [instances, setInstances] = useState([]);
  const [newInstance, setNewInstance] = useState({
    baseUrl: '',
    clientId: '',
    clientSecret: ''
  });

  useEffect(() => {
    fetchInstances();
  }, []);

  const fetchInstances = async () => {
    try {
      const response = await api.get('/admin/instances');
      setInstances(response.data);
    } catch (error) {
      console.error('Error fetching instances:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewInstance({
      ...newInstance,
      [e.target.name]: e.target.value
    });
  };

  const handleAddInstance = async (e) => {
    e.preventDefault();
    try {
      await axios.post('admin/instances');
      setNewInstance({ baseUrl: '', clientId: '', clientSecret: '' });
      fetchInstances();
    } catch (error) {
      console.error('Error adding instance:', error);
    }
  };

  const handleDeleteInstance = async (id) => {
    try {
      await axios.delete(`/admin/instances/${id}`);
      fetchInstances();
    } catch (error) {
      console.error('Error deleting instance:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Manage WSO2 Instances</h2>

      <form onSubmit={handleAddInstance} className="mb-4">
        <div className="form-group">
          <label>Base URL</label>
          <input
            type="text"
            className="form-control"
            name="baseUrl"
            value={newInstance.baseUrl}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Client ID</label>
          <input
            type="text"
            className="form-control"
            name="clientId"
            value={newInstance.clientId}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Client Secret</label>
          <input
            type="text"
            className="form-control"
            name="clientSecret"
            value={newInstance.clientSecret}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-2">Add Instance</button>
      </form>

      <h4>Existing Instances</h4>
      <ul className="list-group">
        {instances.map((instance) => (
          <li key={instance.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{instance.baseUrl}</strong><br />
              Client ID: {instance.clientId}
            </div>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleDeleteInstance(instance.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageWso2Instances;
