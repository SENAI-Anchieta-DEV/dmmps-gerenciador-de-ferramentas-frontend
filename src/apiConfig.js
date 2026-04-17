// src/apiConfig.js
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:8080' 
    : 'https://dmmps-gerenciador-api-arzr.onrender.com';

export default API_BASE_URL;