import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <div className="hero-section">
        <h1>Welcome to CityFix</h1>
        <p>Your community issue tracking platform</p>
        <p>Report issues, track progress, and help make your community better.</p>
        <div className="hero-buttons">
          <Link to="/dashboard" className="btn btn-primary">
            View Issues
          </Link>
        </div>
      </div>
      
      <div className="features">
        <div className="feature-card">
          <h3>Report Issues</h3>
          <p>Easily report community issues with detailed descriptions and locations.</p>
        </div>
        <div className="feature-card">
          <h3>Track Progress</h3>
          <p>Monitor the status of reported issues from submission to resolution.</p>
        </div>
        <div className="feature-card">
          <h3>Community Driven</h3>
          <p>Help your community by reporting and tracking local issues.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
