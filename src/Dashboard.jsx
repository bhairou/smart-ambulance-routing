import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // ✅ IMPORT ADD KARO
import Navbar from './Navbar';
import LiveMap from './LiveMap';
import FooterComponent from './FooterComponent';
import { pushNotification } from './Notifications.jsx';
import {
  DATA_EVENT,
  getAmbulances,
  getHospitals,
  initSharedData,
  saveAmbulances,
  saveHospitals
} from './sharedData';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();  // ✅ ADD KARO

  // ===== AMBULANCES DATA =====
  const [ambulances, setAmbulances] = useState(getAmbulances);

  // ===== HOSPITALS DATA =====
  const [hospitals, setHospitals] = useState(getHospitals);

  // ===== EMERGENCY STATE =====
  const [emergency, setEmergency] = useState({ location: '', description: '', show: false });
  const [emergencyLocation, setEmergencyLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedAmbulance, setSelectedAmbulance] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [countdown, setCountdown] = useState(0);

  // ===== STATS =====
  const total = ambulances.length;
  const available = ambulances.filter(a => a.status === 'Available').length;
  const busy = ambulances.filter(a => a.status === 'Busy' || a.status === 'On Route').length;
  const responseTime = '3.8 min';

  useEffect(() => {
    initSharedData();
    const syncData = () => {
      setAmbulances(getAmbulances());
      setHospitals(getHospitals());
    };

    syncData();
    window.addEventListener(DATA_EVENT, syncData);
    window.addEventListener('storage', syncData);

    return () => {
      window.removeEventListener(DATA_EVENT, syncData);
      window.removeEventListener('storage', syncData);
    };
  }, []);

  // ===== HANDLE EMERGENCY WITH TRIP SAVE =====
  const handleEmergency = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const availableHospitals = hospitals.filter(h => h.available > 0);
    const nearestHospital = availableHospitals.length > 0 ? availableHospitals[0] : null;
    const availableAmbulances = ambulances.filter(a => a.status === 'Available');
    const nearestAmbulance = availableAmbulances.length > 0 ? availableAmbulances[0] : null;
    
    const emergencyLat = 31.25 + Math.random() * 0.015;
    const emergencyLng = 75.70 + Math.random() * 0.02;
    
    setTimeout(() => {
      setEmergencyLocation({
        lat: emergencyLat,
        lng: emergencyLng,
        description: emergency.description,
        location: emergency.location
      });
      
      if (nearestAmbulance) {
        setAmbulances(prev => {
          const next = prev.map(a =>
            a.id === nearestAmbulance.id 
              ? { ...a, status: 'On Route', eta: '3 min' } 
              : a
          );
          saveAmbulances(next);
          return next;
        });
        setSelectedAmbulance(nearestAmbulance.id);
      }
      
      if (nearestHospital) {
        setSelectedHospital(nearestHospital.id);
        setHospitals(prev => {
          const next = prev.map(h =>
            h.id === nearestHospital.id
              ? { ...h, available: Math.max(0, h.available - 1) }
              : h
          );
          saveHospitals(next);
          return next;
        });
      }
      
      // ===== ✅ SAVE TRIP TO HISTORY =====
      const newTrip = {
        id: Date.now(),
        ambulance: nearestAmbulance ? nearestAmbulance.name : 'N/A',
        driver: nearestAmbulance ? nearestAmbulance.driver : 'N/A',
        location: emergency.location,
        hospital: nearestHospital ? nearestHospital.name : 'No hospital available',
        distance: nearestHospital ? nearestHospital.distance : 'N/A',
        time: nearestAmbulance ? '3.0 min' : 'N/A',
        status: 'Completed',
        date: new Date().toLocaleString(),
        priority: 'Critical'
      };

      const savedTrips = localStorage.getItem('tripHistory');
      let trips = savedTrips ? JSON.parse(savedTrips) : [];
      trips = [newTrip, ...trips];
      localStorage.setItem('tripHistory', JSON.stringify(trips));
      window.dispatchEvent(new CustomEvent('smart-ambulance-trip', { detail: newTrip }));
      pushNotification(`Emergency dispatched: ${nearestAmbulance ? nearestAmbulance.name : 'No ambulance'} to ${emergency.location}`);
      
      setIsLoading(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      
      alert(`🚨 EMERGENCY ALERT!\n📍 Location: ${emergency.location}\n📝 ${emergency.description}\n\n🚑 Ambulance: ${nearestAmbulance ? nearestAmbulance.name : 'No ambulance available'}\n⏱️ ETA: ${nearestAmbulance ? '3 min' : 'N/A'}\n🏥 Hospital: ${nearestHospital ? nearestHospital.name : 'No hospital available'}\n🛏️ Beds available: ${nearestHospital ? nearestHospital.available : 0}`);
      
      setEmergency({ location: '', description: '', show: false });
    }, 1500);
  };

  // ===== LIVE COUNTDOWN =====
  useEffect(() => {
    if (emergencyLocation) {
      setCountdown(3);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [emergencyLocation]);

  // ===== REAL-TIME STATUS UPDATE =====
  useEffect(() => {
    const interval = setInterval(() => {
      setAmbulances(prev =>
        {
          const next = prev.map(a => {
          if (a.status === 'On Route') {
            const etaNum = parseInt(a.eta);
            if (etaNum > 1) {
              return { ...a, eta: `${etaNum - 1} min` };
            } else {
              return { ...a, status: 'Available', eta: '1 min' };
            }
          }
          return a;
        });
          saveAmbulances(next);
          return next;
        }
      );
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-container">
      
      <Navbar />

      {showSuccess && (
        <div className="success-toast">
          <span className="toast-icon">✅</span>
          <div>
            <strong>Emergency Dispatched!</strong>
            <p>Ambulance is on its way 🚑</p>
          </div>
        </div>
      )}

      <header className="premium-header">
        <div className="header-content">
          <div className="logo-section">
            <span className="logo-icon">🚑</span>
            <div>
              <h1>Smart Ambulance Routing</h1>
              <p>Real-time Emergency Response System</p>
            </div>
          </div>
          <div className="header-stats">
            <div className="header-stat">
              <span className="stat-label">Response Time</span>
              <span className="stat-value">{responseTime}</span>
            </div>
            <div className="header-stat">
              <span className="stat-label">Active Fleet</span>
              <span className="stat-value">{total}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="premium-stats-grid">
        <div className="premium-card stat-card floating">
          <div className="stat-icon">🚨</div>
          <div className="stat-info">
            <h3>Total Fleet</h3>
            <p className="stat-number">{total}</p>
          </div>
          <div className="stat-trend up">+12%</div>
        </div>
        <div className="premium-card stat-card available-stat floating">
          <div className="stat-icon">🟢</div>
          <div className="stat-info">
            <h3>Available</h3>
            <p className="stat-number">{available}</p>
          </div>
          <div className="stat-trend up">+5%</div>
        </div>
        <div className="premium-card stat-card busy-stat floating">
          <div className="stat-icon">🔴</div>
          <div className="stat-info">
            <h3>On Duty</h3>
            <p className="stat-number">{busy}</p>
          </div>
          <div className="stat-trend down">-2%</div>
        </div>
        <div className="premium-card stat-card time-stat floating">
          <div className="stat-icon">⏱️</div>
          <div className="stat-info">
            <h3>Avg Response</h3>
            <p className="stat-number">{responseTime}</p>
          </div>
          <div className="stat-trend up">-0.4 min</div>
        </div>
      </div>

      <div className="premium-emergency-section">
        <button 
          className="premium-emergency-btn" 
          onClick={() => setEmergency({ ...emergency, show: !emergency.show })}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="loading-spinner">⏳ Dispatching...</span>
          ) : (
            <>
              <span className="btn-pulse"></span>
              🆘 Request Emergency Assistance
            </>
          )}
        </button>

        {emergency.show && (
          <div className="premium-emergency-modal slide-down">
            <form onSubmit={handleEmergency} className="premium-emergency-form">
              <h2>🚨 Emergency Request</h2>
              <input
                type="text"
                placeholder="📍 Enter your location"
                value={emergency.location}
                onChange={(e) => setEmergency({ ...emergency, location: e.target.value })}
                required
              />
              <textarea
                placeholder="📝 Describe the emergency"
                value={emergency.description}
                onChange={(e) => setEmergency({ ...emergency, description: e.target.value })}
                required
              />
              <button type="submit" className="submit-emergency-btn">
                🚨 Send Emergency Alert
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="map-container">
        {countdown > 0 && emergencyLocation && (
          <div className="countdown-banner">
            🚑 Ambulance arriving in {countdown}...
          </div>
        )}
        <LiveMap ambulances={ambulances} emergencyLocation={emergencyLocation} />
      </div>

      {/* ===== HOSPITAL SECTION WITH CLICK ===== */}
      <div className="hospital-section">
        <div className="premium-section-header">
          <h2>🏥 Nearby Hospitals</h2>
          <span className="section-badge">{hospitals.filter(h => h.emergency).length} Emergency Ready</span>
        </div>

        <div className="hospital-grid">
          {hospitals.map((hospital) => (
            <div 
              key={hospital.id} 
              className={`hospital-card ${hospital.available > 10 ? 'available' : 'critical'} ${selectedHospital === hospital.id ? 'selected' : ''}`}
              onClick={() => navigate(`/hospital/${hospital.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="hospital-top">
                <div className="hospital-name">🏥 {hospital.name}</div>
                <span className={`bed-status ${hospital.available > 10 ? 'available' : 'critical'}`}>
                  {hospital.available > 10 ? '🟢 Available' : '🔴 Limited'}
                </span>
              </div>
              <div className="hospital-details">
                <div className="detail-item">
                  <span className="detail-icon">📍</span>
                  <span>{hospital.location}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">🛏️</span>
                  <span>Beds: <strong>{hospital.available}</strong> / {hospital.beds} available</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">📏</span>
                  <span>Distance: <strong>{hospital.distance}</strong></span>
                </div>
              </div>
              <div className="hospital-progress">
                <div className="progress-bar">
                  <div 
                    className={`progress-fill ${
                      (hospital.available / hospital.beds) * 100 > 60 ? 'high' :
                      (hospital.available / hospital.beds) * 100 > 30 ? 'medium' : 'low'
                    }`}
                    style={{ width: `${(hospital.available / hospital.beds) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="premium-section-header">
        <h2>📍 Fleet Status</h2>
        <span className="section-badge">Live</span>
      </div>

      <div className="premium-ambulance-grid">
        {ambulances.map((amb) => (
          <div 
            key={amb.id} 
            className={`premium-ambulance-card ${amb.status.toLowerCase().replace(' ', '-')} ${selectedAmbulance === amb.id ? 'selected' : ''}`}
          >
            <div className="ambulance-top">
              <div className="ambulance-id">{amb.name}</div>
              <span className={`premium-status-badge ${amb.status.toLowerCase().replace(' ', '-')}`}>
                {amb.status === 'Available' ? '🟢' : amb.status === 'On Route' ? '🟡' : '🔴'} {amb.status}
              </span>
            </div>
            <div className="ambulance-details">
              <div className="detail-item">
                <span className="detail-icon">📍</span>
                <span>{amb.location}</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">⏱️</span>
                <span>ETA: <strong>{amb.eta}</strong></span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">👨‍✈️</span>
                <span>Driver: <strong>{amb.driver}</strong></span>
              </div>
            </div>
            <div className="ambulance-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: amb.status === 'Available' ? '100%' : amb.status === 'On Route' ? '60%' : '30%' }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <FooterComponent />

    </div>
  );
};

export default Dashboard;
