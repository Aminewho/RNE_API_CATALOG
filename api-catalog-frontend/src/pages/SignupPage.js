import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function SignupPage() {

  const [formData, setFormData] = useState({
    matriculeFiscale: '',
    secteurActivite: '',
    raisonSociale: '',
    adresse: '',
    nomPremierResponsable: '',
    prenomPremierResponsable: '',
    emailPremierResponsable: '',
    telPremierResponsable: '',
    nomResponsableTechnique: '',
    prenomResponsableTechnique: '',
    emailResponsableTechnique: '',
    telResponsableTechnique: '',
    ip: '',
    tel: '',
    email: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8080/signup`, formData);
      alert("Your signup request has been submitted. An email will be sent upon approval.");
    } catch (error) {
      console.error('Signup failed:', error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '700px' }}>
      <h3 className="mb-4 text-center">Signup</h3>
     

      <form onSubmit={handleSubmit}>
        {/* Company Info */}
        <h5>Company Information</h5>
        {['matriculeFiscale', 'secteurActivite', 'raisonSociale', 'adresse'].map(field => (
          <div className="mb-3" key={field}>
            <label className="form-label">{field}</label>
            <input
              type="text"
              className="form-control"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        {/* Premier Responsable */}
        <h5>Premier Responsable</h5>
        {[
          'nomPremierResponsable', 'prenomPremierResponsable',
          'emailPremierResponsable', 'telPremierResponsable'
        ].map(field => (
          <div className="mb-3" key={field}>
            <label className="form-label">{field}</label>
            <input
              type="text"
              className="form-control"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        {/* Responsable Technique */}
        <h5>Responsable Technique</h5>
        {[
          'nomResponsableTechnique', 'prenomResponsableTechnique',
          'emailResponsableTechnique', 'telResponsableTechnique'
        ].map(field => (
          <div className="mb-3" key={field}>
            <label className="form-label">{field}</label>
            <input
              type="text"
              className="form-control"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        {/* Contact Info */}
        <h5>Contact Information</h5>
        {['ip', 'tel', 'email'].map(field => (
          <div className="mb-3" key={field}>
            <label className="form-label">{field}</label>
            <input
              type={field === 'email' ? 'email' : 'text'}
              className="form-control"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        <button type="submit" className="btn btn-success w-100">
          Submit Signup Request
        </button>
      </form>
    </div>
  );
}
