import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Card.css';
import './UpdatePassword.css';

const UpdatePassword = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage(error.message);
      setIsError(true);
    } else {
      setMessage('Password updated successfully! Redirecting to login...');
      setIsError(false);
      setTimeout(() => navigate('/'), 2000);
    }
    setLoading(false);
  };

  return (
    <div className="update-password-wrapper">
      <div className="card">
        <div className="card-header">Choose a New Password</div>
        <div className="card-body">
          {message && (
            <p className={`form-message ${isError ? 'error' : 'success'}`}>
              {message}
            </p>
          )}
          <form onSubmit={handleUpdatePassword} noValidate>
            <div className="form-group">
              <input
                type="password"
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
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