import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ApiCard from '../../components/ApiCard';

export default function ApiListPage() {
  const [apis, setApis] = useState([]);

  useEffect(() => {
    const fetchApis = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/wso2/list');
        setApis(response.data.list || []);
      } catch (error) {
        console.error('Error fetching APIs:', error);
      }
    };

    fetchApis();
  }, []);

  return (
    <div className="container mt-4">
      <div className="row">
        {apis.map(api => (
          <div key={api.id} className="col-md-4 mb-4">
            <ApiCard api={api} />
          </div>
        ))}
      </div>
    </div>
  );
}