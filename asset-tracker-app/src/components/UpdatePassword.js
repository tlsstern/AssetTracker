import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import './Card.css';
import './UpdatePassword.css';

const UpdatePassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters long.');
      setIsError(true);
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      setIsError(true);
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: password });

    if (error) {
      setMessage(error.error_description || error.message);
      setIsError(true);
    } else {
      setMessage('Password updated successfully!');
      setIsError(false);
      setPassword('');
      setConfirmPassword('');
    }
    setLoading(false);
  };

  // Add a specific class for success messages
  const messageClass = isError ? 'error' : message ? 'success' : '';

  return (
    <div className="update-password-wrapper">
      <div className="card">
        <div className="card-header">Change Password</div>
        <div className="card-body">
          {message && <p className={`form-message ${messageClass}`}>{message}</p>}
          <form onSubmit={handleUpdatePassword} noValidate>
            <div className="form-group">
              <label htmlFor="new-password">New Password</label>
              <input
                id="new-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                placeholder="Enter your new password"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirm-password">Confirm New Password</label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-control"
                placeholder="Confirm your new password"
              />
            </div>
            <button className="btn update-password-btn" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;