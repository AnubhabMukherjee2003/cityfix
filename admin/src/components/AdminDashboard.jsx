import { useState, useEffect, useCallback } from 'react';
import { issueAPI } from '../services/api';
import AdminIssueCard from './AdminIssueCard';
import StatusFilter from './StatusFilter';
import NoticeManager from './NoticeManager';
import './AdminDashboard.css';

function AdminDashboard({ adminUser, onLogout }) {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [activeTab, setActiveTab] = useState('issues');

  const fetchIssues = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await issueAPI.getAllIssues();
      setIssues(response.data);
    } catch (err) {
      console.error('Error fetching issues:', err);
      if (err.response?.status === 401) {
        setError('Authentication failed. Please login again.');
        // Trigger logout to redirect to login
        setTimeout(() => onLogout(), 2000);
      } else {
        setError('Failed to fetch issues. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  const filterIssues = useCallback(() => {
    if (selectedStatus === 'All') {
      setFilteredIssues(issues);
    } else {
      setFilteredIssues(issues.filter(issue => issue.status === selectedStatus));
    }
  }, [issues, selectedStatus]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  useEffect(() => {
    filterIssues();
  }, [filterIssues]);

  const handleStatusUpdate = async (issueId, newStatus) => {
    try {
      const response = await issueAPI.updateIssueStatus(issueId, newStatus);
      setIssues(prevIssues =>
        prevIssues.map(issue =>
          issue._id === issueId ? response.data : issue
        )
      );
    } catch (err) {
      alert('Failed to update issue status. Please try again.');
      console.error('Error updating issue status:', err);
    }
  };

  const getStatusCounts = () => {
    const counts = {
      'All': issues.length,
      'New': issues.filter(i => i.status === 'New').length,
      'In Progress': issues.filter(i => i.status === 'In Progress').length,
      'Resolved': issues.filter(i => i.status === 'Resolved').length,
    };
    return counts;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const statusCounts = getStatusCounts();

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="admin-welcome">
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {adminUser?.username}!</p>
          </div>
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </div>
        
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'issues' ? 'active' : ''}`}
            onClick={() => setActiveTab('issues')}
          >
            📋 Issue Management
          </button>
          <button 
            className={`tab-btn ${activeTab === 'notices' ? 'active' : ''}`}
            onClick={() => setActiveTab('notices')}
          >
            📢 Notice Management
          </button>
        </div>

        {activeTab === 'issues' && (
          <div className="stats-summary">
            <div className="stat-item">
              <span className="stat-number">{statusCounts.All}</span>
              <span className="stat-label">Total Issues</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{statusCounts.New}</span>
              <span className="stat-label">New</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{statusCounts['In Progress']}</span>
              <span className="stat-label">In Progress</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{statusCounts.Resolved}</span>
              <span className="stat-label">Resolved</span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={fetchIssues} className="retry-btn">Retry</button>
        </div>
      )}

      {activeTab === 'issues' && (
        <>
          <div className="filter-section">
            <StatusFilter
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              statusCounts={statusCounts}
            />
          </div>

          <div className="issues-section">
            <h2>
              {selectedStatus === 'All' ? 'All Issues' : `${selectedStatus} Issues`} 
              ({filteredIssues.length})
            </h2>
            
            {filteredIssues.length === 0 ? (
              <div className="no-issues">
                <p>No {selectedStatus.toLowerCase()} issues found.</p>
              </div>
            ) : (
              <div className="admin-issues-list">
                {filteredIssues.map((issue) => (
                  <AdminIssueCard
                    key={issue._id}
                    issue={issue}
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'notices' && (
        <NoticeManager />
      )}
    </div>
  );
}

export default AdminDashboard;
