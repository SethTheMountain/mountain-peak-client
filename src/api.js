import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Remove extra 'api'
});

export default api;