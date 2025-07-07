import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapSelector.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationMarker = ({ onLocationSelect, initialPosition }) => {
  const [position, setPosition] = useState(initialPosition);

  const map = useMapEvents({
    click(e) {
      const newPosition = [e.latlng.lat, e.latlng.lng];
      setPosition(newPosition);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
      
      // Reverse geocoding to get address
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`)
        .then(response => response.json())
        .then(data => {
          if (data.display_name) {
            onLocationSelect(e.latlng.lat, e.latlng.lng, data.display_name);
          }
        })
        .catch(error => {
          console.error('Error fetching address:', error);
          onLocationSelect(e.latlng.lat, e.latlng.lng);
        });
    },
  });

  useEffect(() => {
    if (!position) {
      // Get user's current location
      map.locate({ setView: true, maxZoom: 16 });
    }
  }, [map, position]);

  useMapEvents({
    locationfound(e) {
      if (!position) {
        const newPosition = [e.latlng.lat, e.latlng.lng];
        setPosition(newPosition);
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
};

const MapSelector = ({ onLocationSelect, className = '', height = '300px' }) => {
  const defaultPosition = [40.7128, -74.0060]; // New York City default

  const handleLocationSelect = (lat, lng, address = '') => {
    onLocationSelect({
      latitude: lat,
      longitude: lng,
      address: address
    });
  };

  return (
    <div className={`map-selector ${className}`} style={{ height }}>
      <p className="map-instruction">Click on the map to select the issue location</p>
      <MapContainer 
        center={defaultPosition} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker 
          onLocationSelect={handleLocationSelect}
          initialPosition={null}
        />
      </MapContainer>
    </div>
  );
};

export default MapSelector;
