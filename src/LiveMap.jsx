import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const LiveMap = ({ ambulances, emergencyLocation }) => {
  const center = [31.2538, 75.7014];

  // Simple marker icon
  const getIcon = (status) => {
    const color = status === 'Available' ? 'green' : status === 'Busy' ? 'red' : 'blue';
    return new L.Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
  };

  return (
    <div style={{ width: '100%', padding: '0 40px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h3 style={{ color: '#ffffff', fontSize: '20px', fontWeight: '700' }}>🗺️ Live Ambulance Tracking</h3>
        <span style={{ 
          background: 'rgba(74, 222, 128, 0.15)', 
          color: '#4ade80', 
          padding: '4px 14px', 
          borderRadius: '20px', 
          fontSize: '12px', 
          fontWeight: '600',
          border: '1px solid rgba(74, 222, 128, 0.2)',
          animation: 'blink 1.5s infinite'
        }}>● LIVE</span>
      </div>
      
      <MapContainer 
        center={center} 
        zoom={14} 
        style={{ height: '400px', width: '100%', borderRadius: '16px', border: '2px solid rgba(13,110,253,0.3)' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {ambulances && ambulances.map((amb) => (
          <Marker key={amb.id} position={[amb.lat, amb.lng]} icon={getIcon(amb.status)}>
            <Popup>
              <div>
                <h4 style={{ margin: '0 0 4px 0', color: '#0d6efd' }}>🚑 {amb.name}</h4>
                <p style={{ margin: '2px 0' }}><strong>Status:</strong> {amb.status}</p>
                <p style={{ margin: '2px 0' }}><strong>Location:</strong> {amb.location}</p>
                <p style={{ margin: '2px 0' }}><strong>ETA:</strong> {amb.eta}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {emergencyLocation && (
          <Circle 
            center={[emergencyLocation.lat, emergencyLocation.lng]} 
            radius={300} 
            color="red" 
            fillColor="red" 
            fillOpacity={0.2}
          >
            <Popup>🚨 EMERGENCY</Popup>
          </Circle>
        )}
      </MapContainer>
    </div>
  );
};

export default LiveMap;