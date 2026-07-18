import React, { useState, useEffect } from 'react';

const TripHistory = () => {
  const [trips, setTrips] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const savedTrips = localStorage.getItem('tripHistory');
    if (savedTrips) {
      setTrips(JSON.parse(savedTrips));
    } else {
      const demoData = [
        { id: 1, ambulance: 'Alpha', driver: 'Rajesh Kumar', location: 'LPU - Block 1', hospital: 'LPU Multispecialty', distance: '2.5 km', time: '4.2 min', status: 'Completed', date: '2026-07-18 09:30 AM' },
        { id: 2, ambulance: 'Beta', driver: 'Amit Singh', location: 'Jalandhar Model Town', hospital: 'Jalandhar Civil', distance: '5.8 km', time: '8.5 min', status: 'Completed', date: '2026-07-18 10:15 AM' },
        { id: 3, ambulance: 'Gamma', driver: 'Sunil Sharma', location: 'Phagwara GT Road', hospital: 'Phagwara Community', distance: '4.2 km', time: '6.1 min', status: 'In Progress', date: '2026-07-18 11:00 AM' },
        { id: 4, ambulance: 'Delta', driver: 'Vikram Patel', location: 'Kapurthala', hospital: 'Kapurthala Medical', distance: '8.3 km', time: '12.0 min', status: 'Completed', date: '2026-07-17 08:45 PM' },
        { id: 5, ambulance: 'Epsilon', driver: 'Ravi Kumar', location: 'LPU - Library', hospital: 'LPU Multispecialty', distance: '1.2 km', time: '2.0 min', status: 'Completed', date: '2026-07-17 06:20 PM' },
        { id: 6, ambulance: 'Zeta', driver: 'Manoj Singh', location: 'LPU - South Campus', hospital: 'LPU Multispecialty', distance: '3.0 km', time: '4.5 min', status: 'Cancelled', date: '2026-07-17 02:10 PM' },
      ];
      setTrips(demoData);
      localStorage.setItem('tripHistory', JSON.stringify(demoData));
    }
  }, []);

  const filteredTrips = trips.filter(trip => {
    const matchFilter = filter === 'All' || trip.status === filter;
    const matchSearch = trip.location.toLowerCase().includes(search.toLowerCase()) ||
                         trip.ambulance.toLowerCase().includes(search.toLowerCase()) ||
                         trip.hospital.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const totalTrips = trips.length;
  const completed = trips.filter(t => t.status === 'Completed').length;
  const inProgress = trips.filter(t => t.status === 'In Progress').length;
  const cancelled = trips.filter(t => t.status === 'Cancelled').length;

  return (
    <div style={{ padding: '30px 40px', maxWidth: '1400px', margin: '0 auto' }}>
      <h2 style={{ color: '#ffffff', fontSize: '32px' }}>📊 Trip History</h2>
      <p style={{ color: '#8ab4f8' }}>Complete record of all ambulance trips</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', margin: '20px 0' }}>
        <div style={{ background: '#121b2b', borderRadius: '16px', padding: '18px 22px', textAlign: 'center' }}>
          <span style={{ color: '#8ab4f8' }}>🚑 Total Trips</span>
          <p style={{ color: '#ffffff', fontSize: '28px', fontWeight: '700' }}>{totalTrips}</p>
        </div>
        <div style={{ background: '#121b2b', borderRadius: '16px', padding: '18px 22px', textAlign: 'center' }}>
          <span style={{ color: '#8ab4f8' }}>✅ Completed</span>
          <p style={{ color: '#4ade80', fontSize: '28px', fontWeight: '700' }}>{completed}</p>
        </div>
        <div style={{ background: '#121b2b', borderRadius: '16px', padding: '18px 22px', textAlign: 'center' }}>
          <span style={{ color: '#8ab4f8' }}>⏳ In Progress</span>
          <p style={{ color: '#fbbf24', fontSize: '28px', fontWeight: '700' }}>{inProgress}</p>
        </div>
        <div style={{ background: '#121b2b', borderRadius: '16px', padding: '18px 22px', textAlign: 'center' }}>
          <span style={{ color: '#8ab4f8' }}>❌ Cancelled</span>
          <p style={{ color: '#f87171', fontSize: '28px', fontWeight: '700' }}>{cancelled}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {['All', 'Completed', 'In Progress', 'Cancelled'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '6px 16px',
            background: filter === f ? 'rgba(13,110,253,0.2)' : 'rgba(255,255,255,0.05)',
            border: filter === f ? '1px solid #0d6efd' : '1px solid rgba(255,255,255,0.06)',
            borderRadius: '20px',
            color: '#8ab4f8',
            cursor: 'pointer'
          }}>{f}</button>
        ))}
        <input type="text" placeholder="🔍 Search..." value={search} onChange={(e) => setSearch(e.target.value)} style={{
          padding: '6px 16px',
          background: '#0a0e1a',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '12px',
          color: '#ffffff',
          flex: 1
        }} />
      </div>

      {filteredTrips.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#4a5a7a' }}>
          <span style={{ fontSize: '20px' }}>📭 No trips found</span>
        </div>
      ) : (
        filteredTrips.map((trip) => (
          <div key={trip.id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#121b2b',
            borderRadius: '16px',
            padding: '18px 22px',
            borderLeft: `4px solid ${trip.status === 'Completed' ? '#4ade80' : trip.status === 'In Progress' ? '#fbbf24' : '#f87171'}`,
            marginBottom: '10px'
          }}>
            <div>
              <h4 style={{ color: '#ffffff', margin: 0 }}>🚑 {trip.ambulance} - {trip.driver}</h4>
              <p style={{ color: '#8ab4f8', margin: '4px 0' }}>📍 {trip.location} → 🏥 {trip.hospital}</p>
              <div style={{ display: 'flex', gap: '16px', color: '#4a5a7a', fontSize: '13px' }}>
                <span>📏 {trip.distance}</span>
                <span>⏱️ {trip.time}</span>
                <span>📅 {trip.date}</span>
              </div>
            </div>
            <span style={{
              padding: '4px 14px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '600',
              background: trip.status === 'Completed' ? 'rgba(74,222,128,0.15)' : trip.status === 'In Progress' ? 'rgba(251,191,36,0.15)' : 'rgba(248,113,113,0.15)',
              color: trip.status === 'Completed' ? '#4ade80' : trip.status === 'In Progress' ? '#fbbf24' : '#f87171'
            }}>
              {trip.status === 'Completed' ? '✅' : trip.status === 'In Progress' ? '⏳' : '❌'} {trip.status}
            </span>
          </div>
        ))
      )}

      <button onClick={() => {
        if (window.confirm('Clear all trip history?')) {
          setTrips([]);
          localStorage.removeItem('tripHistory');
        }
      }} style={{
        padding: '10px 24px',
        background: 'rgba(248,113,113,0.12)',
        color: '#f87171',
        border: '1px solid rgba(248,113,113,0.15)',
        borderRadius: '12px',
        cursor: 'pointer',
        marginTop: '20px'
      }}>🗑️ Clear All History</button>
    </div>
  );
};

export default TripHistory;