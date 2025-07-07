import React, { useState, useEffect } from 'react';
import { issueAPI } from '../services/api';
import './NoticeManager.css';

const NoticeManager = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await issueAPI.getAllNotices();
      setNotices(response.data);
    } catch (error) {
      console.error('Error fetching notices:', error);
      setError('Failed to fetch notices');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      if (editingNotice) {
        const response = await issueAPI.updateNotice(editingNotice._id, formData);
        setNotices(notices.map(notice => 
          notice._id === editingNotice._id ? response.data.notice : notice
        ));
      } else {
        const response = await issueAPI.createNotice(formData);
        setNotices([response.data.notice, ...notices]);
      }
      
      resetForm();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to save notice');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      description: notice.description
    });
    setShowForm(true);
  };

  const handleDelete = async (noticeId) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) {
      return;
    }

    try {
      await issueAPI.deleteNotice(noticeId);
      setNotices(notices.filter(notice => notice._id !== noticeId));
    } catch (error) {
      setError('Failed to delete notice');
    }
  };

  const toggleNoticeStatus = async (notice) => {
    try {
      const response = await issueAPI.updateNotice(notice._id, {
        ...notice,
        isActive: !notice.isActive
      });
      setNotices(notices.map(n => 
        n._id === notice._id ? response.data.notice : n
      ));
    } catch (error) {
      setError('Failed to update notice status');
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '' });
    setEditingNotice(null);
    setShowForm(false);
    setError('');
  };

  if (loading) {
    return (
      <div className="notice-manager">
        <div className="loading">Loading notices...</div>
      </div>
    );
  }

  return (
    <div className="notice-manager">
      <div className="notice-manager-header">
        <h2>📢 Notice Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Create Notice'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')} className="close-btn">×</button>
        </div>
      )}

      {showForm && (
        <div className="notice-form-container">
          <form onSubmit={handleSubmit} className="notice-form">
            <h3>{editingNotice ? 'Edit Notice' : 'Create New Notice'}</h3>
            
            <div className="form-group">
              <label htmlFor="title">Notice Title</label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Enter notice title"
                maxLength="200"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Notice Description</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter notice description"
                rows="4"
                maxLength="1000"
                required
              />
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                onClick={resetForm}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Saving...' : (editingNotice ? 'Update' : 'Create')}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="notices-list">
        {notices.length === 0 ? (
          <div className="empty-state">
            <p>No notices created yet. Create your first notice to get started.</p>
          </div>
        ) : (
          notices.map((notice) => (
            <div key={notice._id} className={`notice-item ${!notice.isActive ? 'inactive' : ''}`}>
              <div className="notice-content">
                <div className="notice-header">
                  <h4>{notice.title}</h4>
                  <div className="notice-status">
                    <span className={`status-badge ${notice.isActive ? 'active' : 'inactive'}`}>
                      {notice.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                <p className="notice-description">{notice.description}</p>
                
                <div className="notice-meta">
                  <span>Created: {new Date(notice.createdAt).toLocaleDateString()}</span>
                  <span>By: {notice.createdBy?.username || 'Admin'}</span>
                </div>
              </div>
              
              <div className="notice-actions">
                <button 
                  onClick={() => toggleNoticeStatus(notice)}
                  className={`btn btn-sm ${notice.isActive ? 'btn-warning' : 'btn-success'}`}
                >
                  {notice.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button 
                  onClick={() => handleEdit(notice)}
                  className="btn btn-sm btn-secondary"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(notice._id)}
                  className="btn btn-sm btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NoticeManager;
