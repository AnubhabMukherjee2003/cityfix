import { useState, useEffect } from 'react';
import { issueAPI } from '../services/api';
import IssueForm from './IssueForm';
import IssueList from './IssueList';
import './Dashboard.css';

function Dashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const response = await issueAPI.getAllIssues();
      setIssues(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch issues. Please try again.');
      console.error('Error fetching issues:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleIssueCreated = (newIssue) => {
    setIssues(prevIssues => [newIssue, ...prevIssues]);
    setShowForm(false);
  };

  if (loading) {
    return <div className="loading">Loading issues...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Issue Dashboard</h1>
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
          <button onClick={fetchIssues} className="retry-btn">Retry</button>
        </div>
      )}

      {showForm && (
        <div className="form-container">
          <IssueForm 
            onIssueCreated={handleIssueCreated}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <div className="issues-section">
        <h2>Recent Issues ({issues.length})</h2>
        <IssueList issues={issues} />
      </div>
    </div>
  );
}

export default Dashboard;
