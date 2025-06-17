import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <h1 className="nav-title">CityFix Admin Panel</h1>
            <div className="admin-badge">Administrator</div>
          </div>
        </nav>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
