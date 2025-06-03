import React, { useState, useEffect } from 'react';
import api from '../api'; // instance Axios globale avec gestion de session
import ApiCard from '../components/ApiCard';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ManageAPIs() {
  const [allApis, setAllApis] = useState([]);
  const [catalogApis, setCatalogApis] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAll = async () => { 
      try {
      const [adminRes, catalogRes] = await Promise.all([
        api.get('/admin/apis'),
        api.get('/admin/catalog/apis')
      ]);
      setLoading(false);
      setAllApis(adminRes.data);
      console.log('All APIs:', adminRes.data);
      console.log('Catalog APIs:', catalogRes.data);
      setCatalogApis(catalogRes.data.map(Api => Api.id));
     }
      catch (error) {
        console.error('Error fetching APIs:', error);
      };
    }
    fetchAll();
  }, []);

  const toggleApi = async (Api) => {
    const isSelected = catalogApis.includes(Api.id);
    if (isSelected) {
      await api.delete(`/admin/catalog/apis/${Api.id}`);
      setCatalogApis(prev => prev.filter(id => id !== Api.id));
    } else {
      await api.post(`/admin/catalog/add`, Api);
      setCatalogApis(prev => [...prev, Api.id]);
    }
  };
 
if (loading)  return null;
return (
    <div className="container mt-4">
    <div className="row">
      {allApis.map(Api => {
        const isSelected = catalogApis.includes(Api.id);
        const color = isSelected ? 'success' : 'primary';
        return (
          <div className="col-md-4 mb-3" key={Api.id}>
            <ApiCard
              api={Api}
              selected={isSelected}
              onToggle={toggleApi}
              color={color}
            />
          </div>
        );
      })}
    </div>
  </div>
  
  );
}
