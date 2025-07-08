import { useState } from 'react';
import MapSelector from './MapSelector';
import './IssueForm.css';

function IssueForm({ onIssueCreated, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    if (location.address) {
      setFormData({
        ...formData,
        location: location.address
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('location', formData.location);
      
      // Add coordinates if selected from map
      if (selectedLocation) {
        submitData.append('latitude', selectedLocation.latitude);
        submitData.append('longitude', selectedLocation.longitude);
      }
      
      // Add image if selected
      if (selectedFile) {
        submitData.append('image', selectedFile);
      }
      
      const result = await onIssueCreated(submitData);
      
      if (result.success) {
        setFormData({ title: '', description: '', location: '' });
        setSelectedFile(null);
        setSelectedLocation(null);
        // Reset file input
        const fileInput = document.getElementById('image');
        if (fileInput) fileInput.value = '';
      } else {
        setError(result.error || 'Failed to create issue. Please try again.');
      }
    } catch (err) {
      setError('Failed to create issue. Please try again.');
      console.error('Error creating issue:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="issue-form">
      <h3>Report New Issue</h3>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Issue Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter a brief title for the issue"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide detailed description of the issue"
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location *</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Where is this issue located?"
            required
          />
        </div>

        <div className="form-group">
          <label>Select Location on Map</label>
          <MapSelector onLocationSelect={handleLocationSelect} />
          {selectedLocation && (
            <p className="location-info">
              Selected: {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="image">Upload Image (Optional)</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
          />
          {selectedFile && (
            <p className="file-info">
              Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
          <small className="file-help">
            Supported formats: JPG, PNG, GIF, WebP (Max 5MB)
          </small>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Issue'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default IssueForm;
