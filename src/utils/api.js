import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export async function fetchRagResponse(query, options = {}) {
  try {
    const token = options.token || localStorage.getItem('token');
    const body = { 
        query,
        boardId: options.boardId || null,
        topK: options.topK || 10,
        history: options.history || [] 
    };
    
    const res = await api.post('/rag/search', body, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });

    return res.data;
  } catch (err) {
    return { error: err?.response?.data?.error || err.message };
  }
}

export default api;