const API_URL = 'http://localhost:5000/api';

export const api = {
  // ===== AUTH =====
  register: async (userData) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return res.json();
  },

  login: async (credentials) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return res.json();
  },

  // ===== AMBULANCES =====
  getAmbulances: async () => {
    const res = await fetch(`${API_URL}/ambulances`);
    return res.json();
  },

  // ===== HOSPITALS =====
  getHospitals: async () => {
    const res = await fetch(`${API_URL}/hospitals`);
    return res.json();
  },

  // ===== EMERGENCIES =====
  createEmergency: async (data) => {
    const res = await fetch(`${API_URL}/emergencies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // ===== TRIPS =====
  getTrips: async () => {
    const res = await fetch(`${API_URL}/trips`);
    return res.json();
  },

  clearTrips: async () => {
    const res = await fetch(`${API_URL}/trips/all`, {
      method: 'DELETE'
    });
    return res.json();
  },

  bookAdmission: async (data) => {
    const res = await fetch(`${API_URL}/admissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }
};
