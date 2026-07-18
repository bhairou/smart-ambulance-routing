import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let isValid = true;
    const newErrors = { email: '', password: '' };
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    
    if (isValid) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        navigate('/dashboard');
      }, 1500);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Animated Ambulance Icon */}
        <div className="icon-wrapper">
          <svg className="ambulance-icon" viewBox="0 0 24 24" fill="none" stroke="#0d6efd" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
            <path d="M14 9v6" />
            <path d="M10 12h8" />
            <rect x="4" y="14" width="16" height="6" rx="2" />
            <circle cx="8" cy="17" r="2" fill="#0d6efd" />
            <circle cx="16" cy="17" r="2" fill="#0d6efd" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="login-title">🚑 Smart Ambulance Routing System</h1>
        
        {/* Subtitle */}
        <p className="login-subtitle">Login to continue</p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">📧 Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">🔒 Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? (
              <span className="spinner">⏳ Loading...</span>
            ) : (
              'Login 🚀'
            )}
          </button>
        </form>

        {/* 🔥🔥🔥 YEH NAYA CODE HAI - SIGN UP LINK 🔥🔥🔥 */}
        <div className="signup-link">
          Don't have an account? <span className="signup-text" onClick={() => navigate('/signup')}>Sign Up</span>
        </div>
      </div>
    </div>
  );
};

export default Login;