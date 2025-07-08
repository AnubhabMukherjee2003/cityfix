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
      
      <div className="issue-meta">
        <div className="issue-location">
          <span className="meta-label">📍 Location:</span>
          <span className="meta-value">{issue.location}</span>
        </div>
        <div className="issue-date">
          <span className="meta-label">🗓️ Reported:</span>
          <span className="meta-value">{formatDate(issue.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

export default IssueCard;
