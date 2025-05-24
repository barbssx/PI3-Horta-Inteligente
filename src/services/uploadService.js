import axios from 'axios';

const API_URL = 'https://dashboard-production-4d11e.up.railway.app/api';

export const uploadArquivo = async (formData) => {
  return await axios.post(`${API_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getRegistros = async (data) => {
  const response = await axios.get(`${API_URL}/registros`, {
    params: { data },
  });
  return response.data;
};
