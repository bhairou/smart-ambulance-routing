export const AMBULANCES_KEY = 'smartAmbulanceFleet';
export const HOSPITALS_KEY = 'smartAmbulanceHospitals';
export const DATA_EVENT = 'smart-ambulance-data';

export const defaultAmbulances = [
  {
    id: 1,
    name: 'Alpha',
    location: 'LPU - Block 1 (Near Uni. Gate)',
    status: 'Available',
    eta: '2 min',
    lat: 31.2538,
    lng: 75.7014,
    driver: 'Rajesh Kumar',
    phone: '+91 98765 43210'
  },
  {
    id: 2,
    name: 'Beta',
    location: 'LPU - Block 2 (Canteen Area)',
    status: 'On Route',
    eta: '5 min',
    lat: 31.252,
    lng: 75.704,
    driver: 'Amit Singh',
    phone: '+91 98765 43211'
  },
  {
    id: 3,
    name: 'Gamma',
    location: 'LPU - Block 3 (Library)',
    status: 'Available',
    eta: '1 min',
    lat: 31.255,
    lng: 75.698,
    driver: 'Sunil Sharma',
    phone: '+91 98765 43212'
  },
  {
    id: 4,
    name: 'Delta',
    location: 'Jalandhar - Model Town',
    status: 'Busy',
    eta: '8 min',
    lat: 31.326,
    lng: 75.5762,
    driver: 'Vikram Patel',
    phone: '+91 98765 43213'
  },
  {
    id: 5,
    name: 'Epsilon',
    location: 'Phagwara - GT Road',
    status: 'Available',
    eta: '3 min',
    lat: 31.2184,
    lng: 75.77,
    driver: 'Ravi Kumar',
    phone: '+91 98765 43214'
  },
  {
    id: 6,
    name: 'Zeta',
    location: 'LPU - South Campus (Hostel)',
    status: 'On Route',
    eta: '4 min',
    lat: 31.248,
    lng: 75.71,
    driver: 'Manoj Singh',
    phone: '+91 98765 43215'
  }
];

export const defaultHospitals = [
  {
    id: 1,
    name: 'LPU Multispecialty Hospital',
    location: 'LPU Campus, Jalandhar',
    beds: 45,
    available: 12,
    distance: '2.5 km',
    lat: 31.255,
    lng: 75.7,
    emergency: true
  },
  {
    id: 2,
    name: 'Jalandhar Civil Hospital',
    location: 'Model Town, Jalandhar',
    beds: 80,
    available: 8,
    distance: '5.8 km',
    lat: 31.325,
    lng: 75.575,
    emergency: true
  },
  {
    id: 3,
    name: 'Phagwara Community Health',
    location: 'GT Road, Phagwara',
    beds: 30,
    available: 5,
    distance: '4.2 km',
    lat: 31.22,
    lng: 75.77,
    emergency: false
  },
  {
    id: 4,
    name: 'Kapurthala Medical Center',
    location: 'Kapurthala',
    beds: 50,
    available: 15,
    distance: '8.3 km',
    lat: 31.31,
    lng: 75.45,
    emergency: true
  }
];

const parseSaved = (key, fallback) => {
  const saved = localStorage.getItem(key);
  if (!saved) return fallback;

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

export const getAmbulances = () => parseSaved(AMBULANCES_KEY, defaultAmbulances);
export const getHospitals = () => parseSaved(HOSPITALS_KEY, defaultHospitals);

export const saveAmbulances = (ambulances) => {
  localStorage.setItem(AMBULANCES_KEY, JSON.stringify(ambulances));
  window.dispatchEvent(new CustomEvent(DATA_EVENT));
};

export const saveHospitals = (hospitals) => {
  localStorage.setItem(HOSPITALS_KEY, JSON.stringify(hospitals));
  window.dispatchEvent(new CustomEvent(DATA_EVENT));
};

export const updateAmbulances = (updater) => {
  const next = updater(getAmbulances());
  saveAmbulances(next);
  return next;
};

export const updateHospitals = (updater) => {
  const next = updater(getHospitals());
  saveHospitals(next);
  return next;
};

export const initSharedData = () => {
  if (!localStorage.getItem(AMBULANCES_KEY)) {
    saveAmbulances(defaultAmbulances);
  }
  if (!localStorage.getItem(HOSPITALS_KEY)) {
    saveHospitals(defaultHospitals);
  }
};
