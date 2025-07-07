import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import './App.css';

function App() {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is already logged in
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        if (user.role === 'admin') {
          setAdminUser(user);
        } else {
          // Clear invalid admin data
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
        }
      } catch (error) {
        console.error('Error parsing admin user data:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      }
    }

    setLoading(false);
  }, []);

  const handleLogin = (user) => {
    setAdminUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setAdminUser(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading admin panel...</p>
      </div>
    );
  }

  if (!adminUser) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <h1 className="nav-title">CityFix Admin Panel</h1>
            <div className="admin-info">
              <div className="admin-badge">Administrator</div>
              <span className="admin-name">{adminUser.username}</span>
              <button 
                onClick={handleLogout} 
                className="logout-btn"
                title="Logout"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>
        
        <main className="main-content">
          <Routes>
            <Route 
              path="/" 
              element={
                <AdminDashboard 
                  adminUser={adminUser} 
                  onLogout={handleLogout} 
                />
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
