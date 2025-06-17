import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const issueAPI = {
  // Get all issues
  getAllIssues: () => api.get('/issues'),
  
  // Get single issue
  getIssue: (id) => api.get(`/issues/${id}`),
  
  // Create new issue
  createIssue: (issueData) => api.post('/issues', issueData),
  
  // Update issue status
  updateIssueStatus: (id, status) => api.patch(`/issues/${id}`, { status }),
};

export default api;
