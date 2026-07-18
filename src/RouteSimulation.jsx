import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Navbar from './Navbar';
import { pushNotification } from './Notifications.jsx';
import { DATA_EVENT, getAmbulances, initSharedData, saveAmbulances } from './sharedData';
import './RouteSimulation.css';

const initialFleet = [
  { id: 1, name: 'Alpha', lat: 31.2538, lng: 75.7014, status: 'Available', eta: '2 min', driver: 'Rajesh Kumar' },
  { id: 2, name: 'Beta', lat: 31.252, lng: 75.704, status: 'On Route', eta: '5 min', driver: 'Amit Singh' },
  { id: 3, name: 'Gamma', lat: 31.255, lng: 75.698, status: 'Busy', eta: '8 min', driver: 'Sunil Sharma' },
  { id: 4, name: 'Delta', lat: 31.248, lng: 75.71, status: 'Available', eta: '1 min', driver: 'Vikram Patel' }
];

const statusColors = {
  Available: '#22c55e',
  'On Route': '#f59e0b',
  Busy: '#ef4444'
};

const makeAmbulanceIcon = (status) => {
  const color = statusColors[status] || '#38bdf8';

  return new L.DivIcon({
    html: `<div class="fleet-marker" style="--marker-color:${color}"><span>+</span><small>${status}</small></div>`,
    className: 'route-div-icon',
    iconSize: [54, 54],
    iconAnchor: [27, 27],
    popupAnchor: [0, -24]
  });
};

const emergencyIcon = new L.DivIcon({
  html: '<div class="emergency-pin">!</div>',
  className: 'route-div-icon',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -18]
});

const MapUpdater = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();
  }, [map]);

  useEffect(() => {
    map.flyTo(center, 15, { animate: true, duration: 0.5 });
  }, [center, map]);

  return null;
};

const getSafeFleet = () => {
  const savedFleet = getAmbulances();
  return savedFleet.length ? savedFleet.slice(0, 6) : initialFleet;
};

const RouteSimulation = () => {
  const [ambulances, setAmbulances] = useState(getSafeFleet);
  const [trackedAmbulanceId, setTrackedAmbulanceId] = useState(1);
  const [emergencyLocation, setEmergencyLocation] = useState(null);
  const [routePath, setRoutePath] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const animationRef = useRef(null);

  const trackedAmbulance = ambulances.find((ambulance) => ambulance.id === trackedAmbulanceId) || ambulances[0];
  const mapCenter = trackedAmbulance ? [trackedAmbulance.lat, trackedAmbulance.lng] : [31.2538, 75.7014];

  const stats = useMemo(() => ({
    total: ambulances.length,
    active: ambulances.filter((ambulance) => ambulance.status === 'On Route').length,
    available: ambulances.filter((ambulance) => ambulance.status === 'Available').length,
    busy: ambulances.filter((ambulance) => ambulance.status === 'Busy').length
  }), [ambulances]);

  const syncFleet = (nextFleet) => {
    setAmbulances(nextFleet);
    saveAmbulances(nextFleet);
  };

  const trackAmbulance = (ambulance) => {
    setTrackedAmbulanceId(ambulance.id);
    setRoutePath(emergencyLocation ? [[ambulance.lat, ambulance.lng], [emergencyLocation.lat, emergencyLocation.lng]] : []);
  };

  const startSimulation = () => {
    if (animationRef.current) clearInterval(animationRef.current);

    setIsRunning(true);
    pushNotification('Fleet simulation started');

    animationRef.current = setInterval(() => {
      setAmbulances((currentFleet) => {
        const nextFleet = currentFleet.map((ambulance) => {
          if (ambulance.status === 'Busy') return ambulance;

          const latChange = (Math.random() - 0.5) * 0.0009;
          const lngChange = (Math.random() - 0.5) * 0.0009;

          return {
            ...ambulance,
            status: ambulance.status === 'Available' ? 'On Route' : ambulance.status,
            eta: `${Math.max(1, parseInt(ambulance.eta, 10) || 2)} min`,
            lat: ambulance.lat + latChange,
            lng: ambulance.lng + lngChange
          };
        });

        saveAmbulances(nextFleet);
        return nextFleet;
      });
    }, 1000);
  };

  const stopSimulation = () => {
    if (animationRef.current) {
      clearInterval(animationRef.current);
      animationRef.current = null;
    }
    setIsRunning(false);
    pushNotification('Fleet simulation stopped');
  };

  const resetSimulation = () => {
    stopSimulation();
    syncFleet(initialFleet);
    setTrackedAmbulanceId(1);
    setEmergencyLocation(null);
    setRoutePath([]);
  };

  const addEmergency = () => {
    const location = {
      lat: 31.25 + Math.random() * 0.018,
      lng: 75.698 + Math.random() * 0.018,
      description: 'Emergency reported'
    };

    const nearest = ambulances.reduce((closest, ambulance) => {
      const closestDistance = Math.abs(closest.lat - location.lat) + Math.abs(closest.lng - location.lng);
      const ambulanceDistance = Math.abs(ambulance.lat - location.lat) + Math.abs(ambulance.lng - location.lng);
      return ambulanceDistance < closestDistance ? ambulance : closest;
    }, ambulances[0]);

    const nextFleet = ambulances.map((ambulance) =>
      ambulance.id === nearest.id
        ? { ...ambulance, status: 'On Route', eta: '3 min' }
        : ambulance
    );

    syncFleet(nextFleet);
    setEmergencyLocation(location);
    setTrackedAmbulanceId(nearest.id);
    setRoutePath([[nearest.lat, nearest.lng], [location.lat, location.lng]]);
    pushNotification(`Emergency assigned to ${nearest.name}`);
  };

  useEffect(() => {
    initSharedData();

    const syncFromStorage = () => setAmbulances(getSafeFleet());
    window.addEventListener(DATA_EVENT, syncFromStorage);
    window.addEventListener('storage', syncFromStorage);

    return () => {
      window.removeEventListener(DATA_EVENT, syncFromStorage);
      window.removeEventListener('storage', syncFromStorage);
      if (animationRef.current) clearInterval(animationRef.current);
    };
  }, []);

  return (
    <>
      <Navbar />
      <main className="route-sim-container">
        <section className="route-shell">
          <header className="route-sim-header fade-in">
            <div>
              <span className="route-eyebrow">Fleet Command Center</span>
              <h2>Ambulance Route Simulation</h2>
              <p>Track multiple ambulances, trigger emergencies, and watch live fleet stats update.</p>
            </div>
            <div className={`route-live-pill ${isRunning ? 'on-route' : 'available'}`}>
              <span></span>
              {isRunning ? 'Simulating' : 'Ready'}
            </div>
          </header>

          <section className="route-live-stats slide-up">
            <article><span>Total</span><strong>{stats.total}</strong></article>
            <article><span>Active</span><strong>{stats.active}</strong></article>
            <article><span>Available</span><strong>{stats.available}</strong></article>
            <article><span>Busy</span><strong>{stats.busy}</strong></article>
          </section>

          <section className="route-controls slide-up">
            <div className="route-status">
              <span className="status-label">Tracking</span>
              <span className="status-value">{trackedAmbulance?.name || 'None'}</span>
            </div>
            <div className="route-buttons">
              <button className="route-btn start-btn" onClick={startSimulation} disabled={isRunning}>Start</button>
              <button className="route-btn stop-btn" onClick={stopSimulation} disabled={!isRunning}>Stop</button>
              <button className="route-btn reset-btn" onClick={resetSimulation}>Reset</button>
              <button className="route-btn emergency-btn" onClick={addEmergency}>Emergency</button>
            </div>
          </section>

          <section className="route-map-container zoom-in">
            <MapContainer center={mapCenter} zoom={15} className="route-map">
              <MapUpdater center={mapCenter} />
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />

              {routePath.length > 1 && (
                <Polyline
                  positions={routePath}
                  pathOptions={{ color: '#ef4444', weight: 5, opacity: 0.9, dashArray: '10, 8', className: 'animated-dash' }}
                />
              )}

              {emergencyLocation && (
                <>
                  <Circle
                    center={[emergencyLocation.lat, emergencyLocation.lng]}
                    radius={150}
                    pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.16, weight: 3 }}
                  />
                  <Marker position={[emergencyLocation.lat, emergencyLocation.lng]} icon={emergencyIcon}>
                    <Popup>{emergencyLocation.description}</Popup>
                  </Marker>
                </>
              )}

              {ambulances.map((ambulance) => (
                <Marker
                  key={ambulance.id}
                  position={[ambulance.lat, ambulance.lng]}
                  icon={makeAmbulanceIcon(ambulance.status)}
                  eventHandlers={{ click: () => trackAmbulance(ambulance) }}
                >
                  <Popup>
                    <div className="route-popup">
                      <h4>{ambulance.name}</h4>
                      <p>Status: {ambulance.status}</p>
                      <p>Driver: {ambulance.driver}</p>
                      <p>ETA: {ambulance.eta}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </section>

          <section className="ambulance-cards">
            {ambulances.map((ambulance) => (
              <article
                key={ambulance.id}
                className={`ambulance-card ${trackedAmbulanceId === ambulance.id ? 'tracked' : ''}`}
                onClick={() => trackAmbulance(ambulance)}
              >
                <div className="amb-card-header">
                  <span className="amb-name">{ambulance.name}</span>
                  <span className={`amb-status ${ambulance.status.toLowerCase().replace(' ', '-')}`}>{ambulance.status}</span>
                </div>
                <div className="amb-card-body">
                  <p>{ambulance.lat.toFixed(4)}, {ambulance.lng.toFixed(4)}</p>
                  <p>{ambulance.driver}</p>
                  <p>{ambulance.eta}</p>
                </div>
                {trackedAmbulanceId === ambulance.id && <div className="amb-tracking-badge">Tracking</div>}
              </article>
            ))}
          </section>
        </section>
      </main>
    </>
  );
};

export default RouteSimulation;
