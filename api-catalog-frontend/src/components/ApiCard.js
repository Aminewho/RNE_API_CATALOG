import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const ApiCard = ({ api }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/login/${api.id}`);
  };

  return (
    <div className="col-md-4 mb-4" onClick={handleClick} style={{ cursor: 'pointer' }}>
  <div className="card text-white bg-primary h-100" style={{ minHeight: '50px' ,minWidth: '250px'}}>
    <div className="card-header text-center" style={{ fontSize: '3rem' }}>
      {api.name.substring(0, 2)}
    </div>
    <div className="card-body">
      <h5 className="card-title" style={{ fontSize: '1.5rem' }}>{api.name}</h5>
      <p className="card-text">By: {api.provider}</p>
      <p className="card-text">Version: {api.version}</p>
      <p className="card-text">Context: {api.context}</p>
    </div>
  </div>
</div>

  );
};

export default ApiCard;
