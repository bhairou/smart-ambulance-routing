import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { pushNotification } from './Notifications.jsx';
import {
  DATA_EVENT,
  getAmbulances,
  getHospitals,
  initSharedData,
  saveAmbulances
} from './sharedData';
import './SectionPages.css';

const useSharedFleetData = () => {
  const [ambulances, setAmbulances] = useState(getAmbulances);
  const [hospitals, setHospitals] = useState(getHospitals);

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

  return { ambulances, hospitals };
};

const SectionLayout = ({ title, subtitle, action, children }) => (
  <>
    <Navbar />
    <main className="section-page">
      <header className="section-hero">
        <div>
          <span className="section-kicker">Smart Ambulance Network</span>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        {action}
      </header>
      {children}
    </main>
  </>
);

export const EmergencyPage = () => {
  const navigate = useNavigate();
  const { ambulances } = useSharedFleetData();

  const triggerEmergency = () => {
    const assignedAmbulance = ambulances.find((ambulance) => ambulance.status === 'Available') || ambulances[0];
    const nextAmbulances = ambulances.map((ambulance) =>
      ambulance.id === assignedAmbulance.id
        ? { ...ambulance, status: 'On Route', eta: '3 min', location: 'Emergency Desk' }
        : ambulance
    );
    saveAmbulances(nextAmbulances);

    const trip = {
      id: Date.now(),
      ambulance: assignedAmbulance.name,
      driver: assignedAmbulance.driver,
      location: 'Emergency Desk',
      hospital: 'LPU Multispecialty Hospital',
      distance: '1.2 km',
      time: '2.0 min',
      status: 'In Progress',
      date: new Date().toLocaleString(),
      priority: 'Critical'
    };
    const savedTrips = localStorage.getItem('tripHistory');
    const trips = savedTrips ? JSON.parse(savedTrips) : [];
    localStorage.setItem('tripHistory', JSON.stringify([trip, ...trips]));
    window.dispatchEvent(new CustomEvent('smart-ambulance-trip', { detail: trip }));
    pushNotification(`Critical emergency created and ${assignedAmbulance.name} assigned`);
    navigate('/route-simulation');
  };

  return (
    <SectionLayout
      title="Emergency Command"
      subtitle="Create an emergency dispatch and continue it directly in route simulation."
      action={<button className="section-primary-btn" onClick={triggerEmergency}>Dispatch Now</button>}
    >
      <section className="section-grid">
        {['Critical Triage', 'Nearest Ambulance', 'Hospital Bed Match'].map((item, index) => (
          <article className="section-card" key={item} style={{ animationDelay: `${index * 0.08}s` }}>
            <span className="section-card-icon"></span>
            <h3>{item}</h3>
            <p>Live data syncs with notifications, trip history, and route simulation.</p>
          </article>
        ))}
      </section>
    </SectionLayout>
  );
};

export const AmbulancesPage = () => {
  const { ambulances } = useSharedFleetData();

  return (
    <SectionLayout title="Ambulance Fleet" subtitle="Track driver, location, status, and response readiness.">
      <section className="section-grid">
        {ambulances.map((ambulance, index) => (
          <article className={`section-card fleet ${ambulance.status.toLowerCase().replace(' ', '-')}`} key={ambulance.name} style={{ animationDelay: `${index * 0.08}s` }}>
            <div className="section-card-top">
              <h3>{ambulance.name}</h3>
              <span>{ambulance.status}</span>
            </div>
            <p>{ambulance.location}</p>
            <p>Driver: <strong>{ambulance.driver}</strong></p>
            <div className="mini-meter"><span style={{ width: ambulance.status === 'Available' ? '100%' : ambulance.status === 'On Route' ? '62%' : '34%' }}></span></div>
            <small>ETA {ambulance.eta}</small>
          </article>
        ))}
      </section>
    </SectionLayout>
  );
};

export const HospitalsPage = () => {
  const { hospitals } = useSharedFleetData();

  return (
    <SectionLayout title="Hospital Network" subtitle="Emergency bed availability and distance overview.">
      <section className="section-grid">
        {hospitals.map((hospital, index) => (
          <article className="section-card hospital" key={hospital.name} style={{ animationDelay: `${index * 0.08}s` }}>
            <div className="section-card-top">
              <h3>{hospital.name}</h3>
              <span>{hospital.emergency ? 'Emergency Ready' : 'General'}</span>
            </div>
            <p>Distance: <strong>{hospital.distance}</strong></p>
            <p>Beds: <strong>{hospital.available}</strong> / {hospital.beds} available</p>
            <div className="mini-meter"><span style={{ width: `${(hospital.available / hospital.beds) * 100}%` }}></span></div>
          </article>
        ))}
      </section>
    </SectionLayout>
  );
};
