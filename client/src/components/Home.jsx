import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">Community-Powered Platform</div>
          <h1>Making Your <span className="accent">Community</span> Better Together</h1>
          <p className="hero-subtitle">
            Report local issues, track their progress, and contribute to improving
            your neighborhood with our interactive issue tracking system.
          </p>
          <div className="hero-buttons">
            <Link to="/dashboard" className="btn btn-primary">
              <span>View Dashboard</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="btn-icon">
                <path fillRule="evenodd" d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link to="/signup" className="btn btn-secondary">
              Sign Up Free
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Issues Resolved</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Communities</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">2K+</span>
              <span className="stat-label">Happy Citizens</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <div className="image-wrapper">
            <img src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" alt="Community improvement" />
          </div>
        </div>
      </div>
      
      <div className="how-it-works">
        <h2>How CityFix Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Report an Issue</h3>
            <p>Submit issues with details, location, and photos using our easy-to-use form.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Track Progress</h3>
            <p>Follow updates as your issue moves from reported to in-progress to resolved.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Issue Resolved</h3>
            <p>Receive notifications when your reported issues are successfully resolved.</p>
          </div>
        </div>
      </div>
      
      <div className="features-section">
        <h2>Powerful Features</h2>
        <div className="features">
          <div className="feature-card">
            <div className="feature-icon">📍</div>
            <h3>Map Integration</h3>
            <p>Pinpoint issue locations on an interactive map for better context and tracking.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📷</div>
            <h3>Photo Evidence</h3>
            <p>Upload images to provide clear visual documentation of community issues.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔔</div>
            <h3>Status Updates</h3>
            <p>Get timely notifications as your reported issues progress toward resolution.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Community Driven</h3>
            <p>Join a network of engaged citizens working to improve your local area.</p>
          </div>
        </div>
      </div>
      
      <div className="cta-section">
        <h2>Ready to improve your community?</h2>
        <p>Join CityFix today and be part of the solution</p>
        <div className="cta-buttons">
          <Link to="/signup" className="btn btn-cta">Get Started</Link>
          <Link to="/login" className="btn btn-outline">Sign In</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
