import axios from 'axios';
import { useLocation } from 'react-router-dom';


const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true
});



export default api;
