import React from 'react';
import {
  BrowserRouter as Router,
  useLocation,
} from 'react-router-dom';
import PrimarySearchAppBar from './PrimarySearchAppBar'; // adjust path if needed

export default function LayoutWithAppBar ({ children }){
  const location = useLocation();
  const hideOnRoutes = ['/login', '/signup'];
  const shouldHideAppBar = hideOnRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideAppBar && <PrimarySearchAppBar/>}
      {children}
    </>
  );
};