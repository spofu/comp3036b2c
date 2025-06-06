"use client"

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './LoginModal.css';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await login(email, password);
    
    if (result.success) {
      // Clear form
      setEmail('');
      setPassword('');
      setError('');
      onSuccess?.();
      onClose();
    } else {
      setError(result.message || 'Login failed. Please try again.');
    }
  };

  const handleInputChange = (setter: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    if (error) setError(''); // Clear error when user starts typing
  };

  const handleClose = () => {
    if (!isLoading) {
      setEmail('');
      setPassword('');
      setError('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Sign In</h2>
          <button 
            className="modal-close" 
            onClick={handleClose}
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          {error && (
            <div className="modal-error">
              <svg className="error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <div className="modal-form-group">
            <label htmlFor="modal-email" className="modal-label">
              Email Address
            </label>
            <input
              type="email"
              id="modal-email"
              value={email}
              onChange={handleInputChange(setEmail)}
              className="modal-input"
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>

          <div className="modal-form-group">
            <label htmlFor="modal-password" className="modal-label">
              Password
            </label>
            <div className="modal-password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="modal-password"
                value={password}
                onChange={handleInputChange(setPassword)}
                className="modal-input"
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="modal-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="modal-submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="modal-spinner"></div>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="modal-footer">
          <p>
            Don't have an account? 
            <button className="modal-link" onClick={handleClose}>
              Continue as guest
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
