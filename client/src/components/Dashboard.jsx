import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import IssueForm from './IssueForm';
import IssueList from './IssueList';
import NoticeList from './NoticeList';
import './Dashboard.css';

function Dashboard() {
  const [showForm, setShowForm] = useState(false);
  const { 
    user, 
    issues, 
    notices, 
    loading, 
    error, 
    fetchIssues, 
    createIssue, 
    fetchNotices,
    clearError 
  } = useAuth();

  useEffect(() => {
    fetchIssues();
    fetchNotices();
  }, []);

  const handleIssueCreated = async (issueData) => {
    const result = await createIssue(issueData);
    if (result.success) {
      setShowForm(false);
      // Issues are automatically updated via context
    }
    return result;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {user?.username}!</h1>
          <p>Manage community issues and stay updated with notices</p>
        </div>
        
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Report New Issue'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={clearError} className="close-btn">×</button>
        </div>
      )}

      {/* Notice Section */}
      <NoticeList />

      {showForm && (
        <div className="form-container">
          <IssueForm 
            onIssueCreated={handleIssueCreated}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <div className="issues-section">
        <div className="section-header">
          <h2>Community Issues</h2>
          <div className="issue-stats">
            <span className="stat">
              <strong>{issues.length}</strong> Total Issues
            </span>
            <span className="stat">
              <strong>{issues.filter(issue => issue.status === 'New').length}</strong> New
            </span>
            <span className="stat">
              <strong>{issues.filter(issue => issue.status === 'In Progress').length}</strong> In Progress
            </span>
            <span className="stat">
              <strong>{issues.filter(issue => issue.status === 'Resolved').length}</strong> Resolved
            </span>
          </div>
        </div>
        <IssueList issues={issues} />
      </div>
    </div>
  );
}

export default Dashboard;
