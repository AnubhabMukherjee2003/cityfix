import IssueCard from './IssueCard';
import './IssueList.css';

function IssueList({ issues }) {
  if (issues.length === 0) {
    return (
      <div className="no-issues">
        <p>No issues reported yet.</p>
        <p>Be the first to report an issue in your community!</p>
      </div>
    );
  }

  return (
    <div className="issue-list">
      {issues.map((issue) => (
        <IssueCard key={issue._id} issue={issue} />
      ))}
    </div>
  );
}

export default IssueList;
