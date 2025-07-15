import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import api from '../api';

const AuthHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      response => response,
      error => {
        const status = error.response?.status;

        if (status === 401 && location.pathname !== '/login') {
          navigate('/login');
        } else if (status === 403) {
          // User is authenticated but not authorized
          alert('Accès refusé : permissions insuffisantes.');
          navigate('/login'); // or navigate('/access-denied') if you have such a page
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [location.pathname, navigate]);

  return null;
};

export default AuthHandler;
