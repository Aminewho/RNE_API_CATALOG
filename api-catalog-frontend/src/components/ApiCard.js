import React from 'react';
import { Button } from 'react-bootstrap';
import './ApiCard.css'; // Custom styles

export default function ApiCard({ api, selected, onToggle }) {
  return (
    <div className="col-md-4 mb-4 d-flex">
      <div className={`card api-card text-white w-100 ${selected ? 'bg-success' : 'bg-primary'}`}>
        <div className="card-body d-flex flex-column">
          <h5 className="card-title text-truncate" title={api.name}>{api.name}</h5>
          <p className="card-text api-description">
            {api.description || 'No description available.'}
          </p>
          <p className="card-text small mt-auto">
            <div>Version: {api.version}</div>
            <div>Context: {api.context}</div>
          </p>
          <Button
            variant={selected ? 'light' : 'dark'}
            onClick={() => onToggle(api)}
            className="mt-2"
          >
            {selected ? '-' : '+'}
          </Button>
        </div>
      </div>
    </div>
  );
}
