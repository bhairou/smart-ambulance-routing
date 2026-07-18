import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { io } from 'socket.io-client';
import 'leaflet/dist/leaflet.css';
import './LiveTrack.css';

const LiveTrack = () => {
  const [position, setPosition] = useState([31.2538, 75.7014]);
  const [ambulanceStatus, setAmbulanceStatus] = useState('🟢 Available');
  const [eta, setEta] = useState('2 min');
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  // ===== AMBULANCE ICON =====
  const ambulanceIcon = new L.DivIcon({
    html: `
      <div style="
        font-size: 36px;
        animation: bounceAmbulance 0.5s ease-in-out infinite;
        filter: drop-shadow(0 0 25px rgba(13, 110, 253, 0.9));
      ">🚑</div>
    `,
    className: 'ambulance-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });

  // ===== SOCKET.IO CONNECTION =====
  useEffect(() => {
    socketRef.current = io('http://localhost:5000');

    socketRef.current.on('connect', () => {
      console.log('✅ Connected to server');
      setIsConnected(true);
    });

    socketRef.current.on('ambulance-location', (data) => {
      console.log('📍 Location update:', data);
      setPosition([data.lat, data.lng]);
      setAmbulanceStatus(data.status || 'On Route');
      setEta(data.eta || '3 min');
    });

    socketRef.current.on('disconnect', () => {
      console.log('❌ Disconnected from server');
      setIsConnected(false);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="live-track-container">
      <div className="live-track-header">
        <h2>🚑 Live Ambulance Tracking</h2>
        <div className="live-status">
          <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></span>
          <span>{isConnected ? '● Live' : '● Offline'}</span>
        </div>
      </div>

      {/* Status Card */}
      <div className="live-status-card">
        <div className="status-info">
          <span>📍 Location: {position[0].toFixed(4)}, {position[1].toFixed(4)}</span>
          <span>Status: {ambulanceStatus}</span>
          <span>⏱️ ETA: {eta}</span>
        </div>
      </div>

      {/* Map */}
      <div className="live-map-container">
        <MapContainer
          center={position}
          zoom={15}
          style={{ height: '500px', width: '100%', borderRadius: '16px' }}
          className="live-map"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          <Marker position={position} icon={ambulanceIcon}>
            <Popup>
              <div className="popup-ambulance">
                <h4>🚑 Ambulance</h4>
                <p>Status: {ambulanceStatus}</p>
                <p>ETA: {eta}</p>
                <p>📍 {position[0].toFixed(4)}, {position[1].toFixed(4)}</p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default LiveTrack;
