import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Login.css';
import './Verify.css';

const Verify = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef(null);

  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(location.search);
      const emailFromUrl = searchParams.get('email');
      if (emailFromUrl) {
        setEmail(decodeURIComponent(emailFromUrl));
      } else {
        setMessage('Email not found. Please sign up again.');
        setIsError(true);
      }
    } catch (error) {
        setMessage('Could not read email from URL.');
        setIsError(true);
    }
  }, [location]);

  useEffect(() => {
    if (inputRef.current) {
        inputRef.current.focus();
    }
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);
    
    const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'signup' });

    if (error) {
      setMessage(error.error_description || error.message);
      setIsError(true);
    } else {
      navigate('/');
    }
    setLoading(false);
  };

  const handleOtpChange = (e) => {
    const value = e.target.value;
    if (/^[0-9]*$/.test(value) && value.length <= 6) {
        setOtp(value);
        if (message) {
            setMessage('');
            setIsError(false);
        }
    }
  };

  return (
    <div className="verify-page-wrapper">
       <div className="login-layout">
        <h1 className="app-title">Asset Tracker</h1>
        <p className="app-subtitle">Check your email for a verification code</p>
        <div className="form-container">
            <p className="title">Enter Code</p>
            <p className={`form-message ${isError ? 'error' : ''}`}>{message}</p>
            <form className="form" onSubmit={handleVerify}>
                <div className="otp-container" onClick={() => inputRef.current.focus()}>
                    {[...Array(6)].map((_, index) => (
                        <div
                            key={index}
                            className={`otp-box ${index === otp.length ? 'active' : ''}`}
                        >
                            {otp[index]}
                        </div>
                    ))}
                </div>
                <input
                    ref={inputRef}
                    type="tel"
                    value={otp}
                    onChange={handleOtpChange}
                    maxLength="6"
                    className="otp-hidden-input"
                    autoComplete="one-time-code"
                />
                <button className="sign" disabled={loading || otp.length < 6}>
                    {loading ? 'Verifying...' : 'Verify'}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default Verify;