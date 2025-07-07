import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './NoticeList.css';

const NoticeList = () => {
  const { notices, fetchNotices } = useAuth();

  useEffect(() => {
    fetchNotices();
  }, []);

  if (!notices || notices.length === 0) {
    return (
      <div className="notice-list-empty">
        <div className="empty-state">
          <h3>📢 No Notices</h3>
          <p>There are currently no active notices to display.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notice-list">
      <div className="notice-header">
        <h2>📢 Important Notices</h2>
        <p>Stay updated with the latest announcements</p>
      </div>
      
      <div className="notices-container">
        {notices.map((notice) => (
          <div key={notice._id} className="notice-card">
            <div className="notice-content">
              <h3 className="notice-title">{notice.title}</h3>
              <p className="notice-description">{notice.description}</p>
              
              <div className="notice-meta">
                <span className="notice-author">
                  By {notice.createdBy?.username || 'Admin'}
                </span>
                <span className="notice-date">
                  {new Date(notice.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoticeList;
