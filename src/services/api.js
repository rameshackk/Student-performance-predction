const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const studentAPI = {
  getAll: async () => {
    const res = await fetch(`${API_URL}/students`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch students');
    return res.json();
  },
  
  getById: async (id) => {
    const res = await fetch(`${API_URL}/students/${id}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Student not found');
    return res.json();
  }
};

export const predictionAPI = {
  predict: async (studentId) => {
    const res = await fetch(`${API_URL}/predictions/${studentId}`, { 
      method: 'POST',
      headers: getAuthHeaders() 
    });
    if (!res.ok) throw new Error('Prediction failed');
    return res.json();
  },
  
  getRecent: async (limit = 10) => {
    const res = await fetch(`${API_URL}/predictions/recent?limit=${limit}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch predictions');
    return res.json();
  }
};

export const groupAPI = {
  getAll: async () => {
    const res = await fetch(`${API_URL}/groups`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch groups');
    return res.json();
  }
};