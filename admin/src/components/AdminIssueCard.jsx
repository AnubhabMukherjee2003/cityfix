import { useState } from 'react';
import './AdminIssueCard.css';

function AdminIssueCard({ issue, onStatusUpdate }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'New':
        return 'status-new';
      case 'In Progress':
        return 'status-progress';
      case 'Resolved':
        return 'status-resolved';
      default:
        return 'status-new';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusChange = async (newStatus) => {
    if (newStatus === issue.status) return;
    
    setIsUpdating(true);
    try {
      await onStatusUpdate(issue._id, newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const statusOptions = ['New', 'In Progress', 'Resolved'];

  return (
    <div className="admin-issue-card">
      <div className="admin-issue-header">
        <div className="issue-title-section">
          <h3 className="admin-issue-title">{issue.title}</h3>
          <span className={`status-badge ${getStatusColor(issue.status)}`}>
            {issue.status}
          </span>
        </div>
        
        <div className="status-controls">
          <label htmlFor={`status-${issue._id}`} className="status-label">
            Update Status:
          </label>
          <select
            id={`status-${issue._id}`}
            value={issue.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={isUpdating}
            className="status-select"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          {isUpdating && <span className="updating-indicator">Updating...</span>}
        </div>
      </div>
      
      <p className="admin-issue-description">{issue.description}</p>
      
      {issue.imageUrl && (
        <div className="admin-issue-image">
          <img 
            src={issue.imageUrl} 
            alt={issue.title}
            className="admin-issue-photo"
          />
        </div>
      )}
      
      <div className="admin-issue-meta">
        <div className="meta-grid">
          <div className="meta-item">
            <span className="meta-label">📍 Location:</span>
            <span className="meta-value">{issue.location}</span>
            {issue.latitude && issue.longitude && (
              <span className="coordinates">
                ({issue.latitude.toFixed(6)}, {issue.longitude.toFixed(6)})
              </span>
            )}
          </div>
          <div className="meta-item">
            <span className="meta-label">🕒 Reported:</span>
            <span className="meta-value">{formatDate(issue.createdAt)}</span>
          </div>
          {issue.reportedBy && (
            <div className="meta-item">
              <span className="meta-label">👤 Reporter:</span>
              <span className="meta-value">{issue.reportedBy.username}</span>
            </div>
          )}
          {issue.updatedAt !== issue.createdAt && (
            <div className="meta-item">
              <span className="meta-label">🔄 Last Updated:</span>
              <span className="meta-value">{formatDate(issue.updatedAt)}</span>
            </div>
          )}
          <div className="meta-item">
            <span className="meta-label">🆔 Issue ID:</span>
            <span className="meta-value issue-id">{issue._id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminIssueCard;
