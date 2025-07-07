import './IssueCard.css';

function IssueCard({ issue }) {
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
      day: 'numeric'
    });
  };

  return (
    <div className="issue-card">
      <div className="issue-header">
        <h3 className="issue-title">{issue.title}</h3>
        <span className={`status-badge ${getStatusColor(issue.status)}`}>
          {issue.status}
        </span>
      </div>
      
      <p className="issue-description">{issue.description}</p>
      
      {issue.imageUrl && (
        <div className="issue-image">
          <img 
            src={issue.imageUrl} 
            alt={issue.title}
            className="issue-photo"
          />
        </div>
      )}
      
      <div className="issue-meta">
        <div className="issue-location">
          <span className="meta-label">📍 Location:</span>
          <span className="meta-value">{issue.location}</span>
          {issue.latitude && issue.longitude && (
            <span className="coordinates">
              ({issue.latitude.toFixed(6)}, {issue.longitude.toFixed(6)})
            </span>
          )}
        </div>
        <div className="issue-date">
          <span className="meta-label">🗓️ Reported:</span>
          <span className="meta-value">{formatDate(issue.createdAt)}</span>
        </div>
        {issue.reportedBy && (
          <div className="issue-reporter">
            <span className="meta-label">👤 Reporter:</span>
            <span className="meta-value">{issue.reportedBy.username}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default IssueCard;
