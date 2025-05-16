import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '250px', overflowY: 'auto', backgroundColor: '#f8f9fa', borderRight: '1px solid #dee2e6' }}>
        <AdminSidebar />
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        <Outlet />
      </div>
    </div>
  );
}