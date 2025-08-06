import axios from 'axios';
import { API_CONFIG } from '../Api-Config';

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Set to true if you're using cookies/auth
});

export default apiClient;
