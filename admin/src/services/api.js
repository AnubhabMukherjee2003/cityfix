import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const issueAPI = {
  // Authentication
  login: (email, password) => api.post('/auth/login', { email, password }),

  // Issues
  getAllIssues: () => api.get('/issues'),
  getIssue: (id) => api.get(`/issues/${id}`),
  createIssue: (issueData) => api.post('/issues', issueData),
  updateIssueStatus: (id, status) => api.patch(`/issues/${id}`, { status }),

  // Notices (admin only)
  getAllNotices: () => api.get('/notices/all'),
  getNotices: () => api.get('/notices'),
  createNotice: (noticeData) => api.post('/notices', noticeData),
  updateNotice: (id, noticeData) => api.put(`/notices/${id}`, noticeData),
  deleteNotice: (id) => api.delete(`/notices/${id}`),
};

export default api;
