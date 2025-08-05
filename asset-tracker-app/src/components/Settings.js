import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Card.css';
import './Settings.css';

const Settings = () => {
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

  return (
    <div className="settings-wrapper">
      <div className="card">
        <div className="card-header">Settings</div>
        <div className="card-body">
          {message && (
            <p className={`form-message ${isError ? 'error' : 'success'}`}>
              {message}
            </p>
          )}
          <div className="settings-section">
            <h4>Account Actions</h4>
            <p>Manage your account settings and actions.</p>
            <div className="settings-actions">
              <button
                className="btn settings-btn"
                onClick={handleChangePassword}
                disabled={loading || countdown > 0}
              >
                {loading ? 'Sending...' : countdown > 0 ? `Resend in ${countdown}s` : 'Change Password'}
              </button>
              <button className="btn btn-secondary" onClick={handleSignOut}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
