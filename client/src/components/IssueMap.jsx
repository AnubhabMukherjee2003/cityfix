import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useAuth } from '../context/AuthContext';
import 'leaflet/dist/leaflet.css';
import './IssueMap.css';
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
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

const IssueMap = () => {
  const { issues } = useAuth();
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
      day: 'numeric'
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

  return (
    <div className="issue-map-container">
      <div className="map-header">
        <h2>Issues Map View</h2>
        <div className="map-legend">
          <div className="legend-item">
            <div className="legend-marker" style={{ backgroundColor: '#ef4444' }}></div>
            <span>New</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker" style={{ backgroundColor: '#f59e0b' }}></div>
            <span>In Progress</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker" style={{ backgroundColor: '#10b981' }}></div>
            <span>Resolved</span>
          </div>
        </div>
      </div>

      {issuesWithCoordinates.length === 0 ? (
        <div className="no-map-data">
          <p>No issues with location data to display on the map.</p>
        </div>
      ) : (
        <div className="map-wrapper">
          <MapContainer 
            center={mapCenter} 
            zoom={mapZoom} 
            style={{ height: '500px', width: '100%' }}
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
                <Popup maxWidth={300}>
                  <div className="issue-popup">
                    <h4 className="popup-title">{issue.title}</h4>
                    <div 
                      className="popup-status" 
                      style={{ backgroundColor: getStatusColor(issue.status) }}
                    >
                      {issue.status}
                    </div>
                    <p className="popup-description">{issue.description}</p>
                    <div className="popup-meta">
                      <div><strong>Location:</strong> {issue.location}</div>
                      <div><strong>Reported:</strong> {formatDate(issue.createdAt)}</div>
                      {issue.reportedBy && (
                        <div><strong>Reporter:</strong> {issue.reportedBy.username}</div>
                      )}
                    </div>
                    {issue.imageUrl && (
                      <div className="popup-image">
                        <img src={issue.imageUrl} alt={issue.title} />
                      </div>
                    )}
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

export default IssueMap;
