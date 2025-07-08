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
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // If the data is FormData, remove the default Content-Type header
  // Let the browser set the correct multipart/form-data header with boundary
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  
  return config;
});

// Handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const issueAPI = {
  // Authentication
  login: (email, password) => api.post('/auth/login', { email, password }),
  signup: (username, email, password) => api.post('/auth/signup', { username, email, password }),

  // Issues
  getAllIssues: () => api.get('/issues'),
  getIssue: (id) => api.get(`/issues/${id}`),
  createIssue: (issueData) => api.post('/issues', issueData),
  updateIssueStatus: (id, status) => api.patch(`/issues/${id}`, { status }),

  // Notices
  getNotices: () => api.get('/notices'),
  getAllNotices: () => api.get('/notices/all'),
  createNotice: (noticeData) => api.post('/notices', noticeData),
  updateNotice: (id, noticeData) => api.put(`/notices/${id}`, noticeData),
  deleteNotice: (id) => api.delete(`/notices/${id}`),
};

export default api;
