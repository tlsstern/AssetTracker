import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Settings.css';

const Settings = ({ onUpdatePrices, isUpdatingPrices, lastPriceUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChangePassword = async () => {
    if (countdown > 0) return;

    setMessage('');
    setIsError(false);
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      setMessage(error.message);
      setIsError(true);
    } else {
      setMessage('Password reset link sent to your email.');
      setIsError(false);
      setCountdown(60); // Start 60-second countdown
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const formatLastUpdate = (date) => {
    if (!date) return 'Never';
    const updateDate = new Date(date);
    const now = new Date();
    const diffMinutes = Math.floor((now - updateDate) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    if (diffMinutes < 1440) {
      const hours = Math.floor(diffMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    return updateDate.toLocaleDateString() + ' at ' + updateDate.toLocaleTimeString();
  };

  return (
    <div className="settings-wrapper">
      <div className="settings-container">
        <div className="settings-header">
          <span className="settings-icon">⚙️</span>
          Settings
        </div>
        
        {message && (
          <p className={`form-message ${isError ? 'error' : 'success'}`}>
            {message}
          </p>
        )}

        {userEmail && (
          <div className="user-info">
            <span className="user-info-label">Logged in as:</span>
            <span className="user-info-value">{userEmail}</span>
          </div>
        )}
        
        <div className="settings-section">
          <h4>
            <span>💹</span>
            Price Updates
          </h4>
          <p>Keep your asset values up-to-date with real-time market prices.</p>
          
          <div className="settings-info">
            <p className="last-update">
              <strong>Last Update:</strong> {formatLastUpdate(lastPriceUpdate)}
            </p>
            <p className="update-note">
              Automatic updates run every 12 minutes for stocks, cryptocurrencies, and precious metals.
            </p>
          </div>
          
          <div className="settings-actions">
            <button
              className="settings-btn btn-primary"
              onClick={onUpdatePrices}
              disabled={isUpdatingPrices}
            >
              {isUpdatingPrices ? (
                <>
                  <span>🔄</span> Updating Prices...
                </>
              ) : (
                <>
                  <span>🔄</span> Refresh Prices Now
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="settings-section">
          <h4>
            <span>🔐</span>
            Account Security
          </h4>
          <p>Manage your account security and authentication settings.</p>
          
          <div className="settings-actions">
            <button
              className="settings-btn btn-primary"
              onClick={handleChangePassword}
              disabled={loading || countdown > 0}
            >
              {loading ? (
                '📧 Sending...'
              ) : countdown > 0 ? (
                `⏰ Resend in ${countdown}s`
              ) : (
                '🔑 Change Password'
              )}
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h4>
            <span>👤</span>
            Account Actions
          </h4>
          <p>Sign out of your account or manage other account settings.</p>
          
          <div className="settings-actions">
            <button 
              className="settings-btn btn-secondary" 
              onClick={handleSignOut}
            >
              🚪 Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;