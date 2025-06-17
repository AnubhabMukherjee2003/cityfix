import './StatusFilter.css';

function StatusFilter({ selectedStatus, onStatusChange, statusCounts }) {
  const statusOptions = [
    { value: 'All', label: 'All Issues' },
    { value: 'New', label: 'New' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Resolved', label: 'Resolved' }
  ];

  return (
    <div className="status-filter">
      <h3 className="filter-title">Filter by Status</h3>
      <div className="filter-buttons">
        {statusOptions.map(option => (
          <button
            key={option.value}
            onClick={() => onStatusChange(option.value)}
            className={`filter-btn ${selectedStatus === option.value ? 'active' : ''}`}
          >
            {option.label}
            <span className="count-badge">
              {statusCounts[option.value] || 0}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default StatusFilter;
