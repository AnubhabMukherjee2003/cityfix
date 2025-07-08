import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './AdminIssueMap.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons for different statuses
const createCustomIcon = (status) => {
  const color = status === 'New' ? 'red' : status === 'In Progress' ? 'orange' : 'green';
  return L.divIcon({
    className: 'custom-admin-marker',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.4);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const AdminIssueMap = ({ issues, onStatusUpdate }) => {
  const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]); // Default to NYC
  const [mapZoom, setMapZoom] = useState(13);

  // Filter issues that have coordinates
  const issuesWithCoordinates = issues.filter(issue => 
    issue.latitude && issue.longitude
  );

  useEffect(() => {
    // If we have issues with coordinates, center the map on them
    if (issuesWithCoordinates.length > 0) {
      const avgLat = issuesWithCoordinates.reduce((sum, issue) => sum + issue.latitude, 0) / issuesWithCoordinates.length;
      const avgLng = issuesWithCoordinates.reduce((sum, issue) => sum + issue.longitude, 0) / issuesWithCoordinates.length;
      setMapCenter([avgLat, avgLng]);
    }
  }, [issuesWithCoordinates]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return '#ef4444';
      case 'In Progress': return '#f59e0b';
      case 'Resolved': return '#10b981';
      default: return '#6b7280';
    }
  };

  const handleStatusChange = async (issueId, newStatus) => {
    await onStatusUpdate(issueId, newStatus);
  };

  const statusOptions = ['New', 'In Progress', 'Resolved'];

  return (
    <div className="admin-issue-map-container">
      <div className="admin-map-header">
        <h2>Issues Map View (Admin)</h2>
        <div className="admin-map-legend">
          <div className="legend-item">
            <div className="legend-marker" style={{ backgroundColor: '#ef4444' }}></div>
            <span>New ({issues.filter(i => i.status === 'New').length})</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker" style={{ backgroundColor: '#f59e0b' }}></div>
            <span>In Progress ({issues.filter(i => i.status === 'In Progress').length})</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker" style={{ backgroundColor: '#10b981' }}></div>
            <span>Resolved ({issues.filter(i => i.status === 'Resolved').length})</span>
          </div>
        </div>
      </div>

      {issuesWithCoordinates.length === 0 ? (
        <div className="no-admin-map-data">
          <p>No issues with location data to display on the map.</p>
          <small>Issues need both latitude and longitude coordinates to appear on the map.</small>
        </div>
      ) : (
        <div className="admin-map-wrapper">
          <MapContainer 
            center={mapCenter} 
            zoom={mapZoom} 
            style={{ height: '600px', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {issuesWithCoordinates.map((issue) => (
              <Marker
                key={issue._id}
                position={[issue.latitude, issue.longitude]}
                icon={createCustomIcon(issue.status)}
              >
                <Popup maxWidth={350} className="admin-popup">
                  <div className="admin-issue-popup">
                    <div className="admin-popup-header">
                      <h4 className="admin-popup-title">{issue.title}</h4>
                      <div 
                        className="admin-popup-status" 
                        style={{ backgroundColor: getStatusColor(issue.status) }}
                      >
                        {issue.status}
                      </div>
                    </div>
                    
                    <p className="admin-popup-description">{issue.description}</p>
                    
                    {issue.imageUrl && (
                      <div className="admin-popup-image">
                        <img src={issue.imageUrl} alt={issue.title} />
                      </div>
                    )}
                    
                    <div className="admin-popup-meta">
                      <div><strong>Location:</strong> {issue.location}</div>
                      <div><strong>Coordinates:</strong> {issue.latitude.toFixed(6)}, {issue.longitude.toFixed(6)}</div>
                      <div><strong>Reported:</strong> {formatDate(issue.createdAt)}</div>
                      {issue.reportedBy && (
                        <div><strong>Reporter:</strong> {issue.reportedBy.username}</div>
                      )}
                      <div><strong>Issue ID:</strong> {issue._id}</div>
                    </div>
                    
                    <div className="admin-popup-controls">
                      <label htmlFor={`popup-status-${issue._id}`}>Update Status:</label>
                      <select
                        id={`popup-status-${issue._id}`}
                        value={issue.status}
                        onChange={(e) => handleStatusChange(issue._id, e.target.value)}
                        className="admin-popup-select"
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default AdminIssueMap;
