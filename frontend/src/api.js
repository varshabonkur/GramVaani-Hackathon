// frontend/src/api.js
const API_BASE_URL = 'https://jj5nmbjioe.execute-api.us-east-1.amazonaws.com/prod';

export const fetchComplaints = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/complaints`);
    if (!response.ok) throw new Error('Failed to fetch');
    const data = await response.json();
    // API returns array directly, not {complaints: [...]}
    return data;
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
};

export const fetchStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/stats`);
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
};