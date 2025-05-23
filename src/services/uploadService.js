import axios from 'axios';

const API_URL = 'http://localhost:3000'; // ajuste se for Vercel/Render etc.

export const uploadArquivo = async (formData) => {
  return await axios.post(`${API_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getRegistros = async () => {
  const response = await axios.get(`${API_URL}/api/registros`); 
  return response.data;
};

