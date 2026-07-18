import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from './api';
import { pushNotification } from './Notifications.jsx';
import { updateHospitals } from './sharedData';
import './HospitalDetail.css';

const hospitals = [
  {
    id: 1,
    name: 'LPU Multispecialty Hospital',
    location: 'LPU Campus, Jalandhar',
    beds: 45,
    available: 12,
    distance: '2.5 km',
    emergency: true,
    phone: '+91 98765 43210',
    email: 'info@lpuhospital.com',
    specialties: ['Emergency Care', 'Cardiology', 'Orthopedics', 'Pediatrics'],
    doctors: ['Dr. Rajesh Sharma', 'Dr. Priya Singh', 'Dr. Amit Verma'],
    rating: 4.8,
    reviews: 156,
    established: 2010,
    timing: '24x7'
  },
  {
    id: 2,
    name: 'Jalandhar Civil Hospital',
    location: 'Model Town, Jalandhar',
    beds: 80,
    available: 8,
    distance: '5.8 km',
    emergency: true,
    phone: '+91 98765 43211',
    email: 'info@civilhospital.com',
    specialties: ['General Medicine', 'Surgery', 'Gynecology', 'Emergency'],
    doctors: ['Dr. Sanjay Gupta', 'Dr. Neha Sharma', 'Dr. Rohit Kumar'],
    rating: 4.5,
    reviews: 89,
    established: 2005,
    timing: '24x7'
  },
  {
    id: 3,
    name: 'Phagwara Community Health',
    location: 'GT Road, Phagwara',
    beds: 30,
    available: 5,
    distance: '4.2 km',
    emergency: false,
    phone: '+91 98765 43212',
    email: 'info@phagwarachc.com',
    specialties: ['Community Health', 'Family Medicine', 'Vaccination'],
    doctors: ['Dr. Anjali Patel', 'Dr. Vikas Singh'],
    rating: 4.2,
    reviews: 45,
    established: 2015,
    timing: '8:00 AM - 8:00 PM'
  },
  {
    id: 4,
    name: 'Kapurthala Medical Center',
    location: 'Kapurthala',
    beds: 50,
    available: 15,
    distance: '8.3 km',
    emergency: true,
    phone: '+91 98765 43213',
    email: 'info@kapurthalamedical.com',
    specialties: ['Neurology', 'Cardiology', 'Orthopedics', 'Emergency'],
    doctors: ['Dr. Meera Desai', 'Dr. Arjun Singh', 'Dr. Priya Kapoor'],
    rating: 4.7,
    reviews: 120,
    established: 2012,
    timing: '24x7'
  }
];

const HospitalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [bookingMessage, setBookingMessage] = useState('');
  const [patient, setPatient] = useState({
    patientName: '',
    phone: '',
    emergencyType: 'Emergency Admission'
  });

  useEffect(() => {
    setLoading(true);
    const found = hospitals.find((item) => item.id === Number(id));
    setTimeout(() => {
      setHospital(found);
      setLoading(false);
    }, 300);
  }, [id]);

  const handleBookAdmission = async (event) => {
    event.preventDefault();
    if (!hospital || hospital.available <= 0 || booking) return;

    setBooking(true);
    setBookingMessage('');

    try {
      const result = await api.bookAdmission({
        hospitalId: hospital.id,
        hospitalName: hospital.name,
        patientName: patient.patientName,
        phone: patient.phone,
        emergencyType: patient.emergencyType,
        availableBeds: hospital.available
      });

      if (!result.success) {
        setBookingMessage(result.message || 'Booking failed.');
        return;
      }

      const nextAvailable = Math.max(0, hospital.available - 1);
      setHospital({ ...hospital, available: nextAvailable });
      updateHospitals((items) =>
        items.map((item) =>
          item.id === hospital.id ? { ...item, available: nextAvailable } : item
        )
      );
      pushNotification(`Admission booked at ${hospital.name}`);
      setBookingMessage(`Booked successfully. Booking ID: ${result.admission._id}`);
      setPatient({ patientName: '', phone: '', emergencyType: 'Emergency Admission' });
    } catch (error) {
      setBookingMessage('Backend not reachable. Start backend on port 5000 and try again.');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="hospital-detail-container">
        <div className="loading-spinner-center">
          <span className="spinner-large">...</span>
          <p>Loading hospital details...</p>
        </div>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="hospital-detail-container">
        <div className="not-found">
          <h2>Hospital Not Found</h2>
          <button onClick={() => navigate('/hospitals')}>Back to Hospitals</button>
        </div>
      </div>
    );
  }

  const availabilityPercent = (hospital.available / hospital.beds) * 100;

  return (
    <div className="hospital-detail-container">
      <button className="back-btn" onClick={() => navigate('/dashboard')}>
        Back to Dashboard
      </button>

      <div className="hospital-detail-header">
        <div className="header-badge">
          <span className="hospital-type">{hospital.emergency ? 'Emergency Ready' : 'Community Hospital'}</span>
          <span className="hospital-rating">{hospital.rating} ({hospital.reviews} reviews)</span>
        </div>
        <h1>{hospital.name}</h1>
        <p className="hospital-location">{hospital.location}</p>
        <div className="hospital-quick-stats">
          <span>{hospital.available} / {hospital.beds} Beds Available</span>
          <span>{hospital.distance}</span>
          <span>{hospital.timing}</span>
        </div>
      </div>

      <div className="hospital-detail-grid">
        <div className="detail-left">
          <div className="info-card">
            <h3>Contact Information</h3>
            <p><strong>Phone:</strong> {hospital.phone}</p>
            <p><strong>Email:</strong> {hospital.email}</p>
            <p><strong>Established:</strong> {hospital.established}</p>
          </div>

          <div className="info-card">
            <h3>Specialties</h3>
            <div className="specialties-list">
              {hospital.specialties.map((specialty) => (
                <span key={specialty} className="specialty-tag">{specialty}</span>
              ))}
            </div>
          </div>

          <div className="info-card">
            <h3>Doctors on Duty</h3>
            <ul className="doctors-list">
              {hospital.doctors.map((doctor) => (
                <li key={doctor}>{doctor}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="detail-right">
          <div className="bed-availability-card">
            <h3>Bed Availability</h3>
            <div className="bed-stats">
              <div className="bed-stat">
                <span>Total Beds</span>
                <strong>{hospital.beds}</strong>
              </div>
              <div className="bed-stat">
                <span>Available</span>
                <strong style={{ color: '#4ade80' }}>{hospital.available}</strong>
              </div>
              <div className="bed-stat">
                <span>Occupied</span>
                <strong style={{ color: '#f87171' }}>{hospital.beds - hospital.available}</strong>
              </div>
            </div>
            <div className="bed-progress">
              <div className="bed-progress-bar">
                <div
                  className="bed-progress-fill"
                  style={{
                    width: `${availabilityPercent}%`,
                    background: availabilityPercent > 60 ? '#4ade80' : availabilityPercent > 30 ? '#fbbf24' : '#f87171'
                  }}
                ></div>
              </div>
              <p className="bed-status-text">
                {hospital.available > 10 ? 'Good availability' : hospital.available > 3 ? 'Limited availability' : 'Very limited'}
              </p>
            </div>
          </div>

          {hospital.emergency && (
            <form className="admission-form" onSubmit={handleBookAdmission}>
              <input
                type="text"
                placeholder="Patient name"
                value={patient.patientName}
                onChange={(event) => setPatient({ ...patient, patientName: event.target.value })}
                required
              />
              <input
                type="tel"
                placeholder="Phone number"
                value={patient.phone}
                onChange={(event) => setPatient({ ...patient, phone: event.target.value })}
                required
              />
              <select
                value={patient.emergencyType}
                onChange={(event) => setPatient({ ...patient, emergencyType: event.target.value })}
              >
                <option>Emergency Admission</option>
                <option>ICU Required</option>
                <option>Accident Case</option>
                <option>Cardiac Emergency</option>
              </select>
              <button className="emergency-book-btn" disabled={booking || hospital.available <= 0}>
                {booking ? 'Booking...' : 'Book Emergency Admission'}
              </button>
              {bookingMessage && <p className="booking-message">{bookingMessage}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default HospitalDetail;
