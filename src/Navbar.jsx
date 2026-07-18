import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import Notifications from './Notifications.jsx';
import './Navbar.css';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/emergency', label: 'Emergency', icon: '🚨' },
  { path: '/ambulances', label: 'Ambulances', icon: '📍' },
  { path: '/hospitals', label: 'Hospitals', icon: '🏥' },
  { path: '/analytics', label: 'Analytics', icon: '📈' },
  { path: '/dijkstra', label: 'Dijkstra', icon: '🗺️' },
  { path: '/priority-queue', label: 'Priority Queue', icon: '🔥' },
  { path: '/trip-history', label: 'Trip History', icon: '📊' },
  { path: '/route-simulation', label: 'Route Sim', icon: '🗺️' },
  { path: '/live-track', label: 'Live Track', icon: '🚑' }
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate('/dashboard')}>
        <span className="brand-icon">🚑</span>
        <span className="brand-text">Smart Ambulance</span>
      </div>

      <ul className="navbar-menu">
        {navItems.map((item) => (
          <li
            key={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </li>
        ))}
      </ul>

      <div className="navbar-right">
        <ThemeToggle />
        <Notifications />
        <button className="user-profile" onClick={() => navigate('/login')}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
