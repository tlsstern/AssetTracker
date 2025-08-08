import React, { useState } from 'react';
import './Login.css';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    if (!validateEmail(email)) {
      setMessage('Please enter a valid email address.');
      setIsError(true);
      return;
    }
    if (!password) {
        setMessage('Please enter your password.');
        setIsError(true);
        return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        setMessage(error.error_description || error.message);
        setIsError(true);
    }
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    if (!validateEmail(email)) {
      setMessage('Please enter a valid email address.');
      setIsError(true);
      return;
    }
    if (password.length < 6) {
        setMessage('Password must be at least 6 characters long.');
        setIsError(true);
        return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setMessage(error.error_description || error.message);
      setIsError(true);
    } else {
      setIsError(false);
      navigate(`/verify?email=${encodeURIComponent(email)}`);
    }
    setLoading(false);
  };
  
  const socialLogin = async (provider) => {
    setMessage('');
    setIsError(false);
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) {
      setMessage(error.error_description || error.message);
      setIsError(true);
    }
  };
  
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (message) {
        setMessage('');
        setIsError(false);
    }
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (message) {
        setMessage('');
        setIsError(false);
    }
  }

  return (
    <div className="login-page-wrapper">
      <div className="login-nav">
        <div className="login-nav-container">
          <Link to="/" className="login-logo">
            <h2>AssetTracker</h2>
          </Link>
          <Link to="/" className="back-home">← Back to Home</Link>
        </div>
      </div>
      <div className="login-layout">
        <h1 className="app-title">Welcome Back</h1>
        
        <div className={`flip-container ${isFlipped ? 'flipped' : ''}`}>
          <div className="flipper">
            {/* Front side of the card (Login) */}
            <div className="front">
              <div className="form-container">
                <div>
                  <p className="title">Login</p>
                  <p className={`form-message ${isError ? 'error' : ''}`}>{message}</p>
                  <form className="form" onSubmit={handleLogin} noValidate>
                    <div className="input-group">
                      <label htmlFor="email">Email</label>
                      <input type="email" name="email" id="email" placeholder="" value={email} onChange={handleEmailChange} className={isError ? 'error-input' : ''} />
                    </div>
                    <div className="input-group">
                      <label htmlFor="password">Password</label>
                      <input type="password" name="password" id="password" placeholder="" value={password} onChange={handlePasswordChange} className={isError ? 'error-input' : ''} />
                    </div>
                    <button className="sign" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
                  </form>
                </div>
                <div>
                  <div className="social-message">
                    <div className="line" />
                    <p className="message">Login with social accounts</p>
                    <div className="line" />
                  </div>
                  <div className="social-icons">
                    <button aria-label="Log in with Google" className="icon" onClick={() => socialLogin('google')}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5 fill-current">
                        <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z" />
                      </svg>
                    </button>
                    <button aria-label="Log in with GitHub" className="icon" onClick={() => socialLogin('github')}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5 fill-current">
                        <path d="M16 0.396c-8.839 0-16 7.167-16 16 0 7.073 4.584 13.068 10.937 15.183 0.803 0.151 1.093-0.344 1.093-0.772 0-0.38-0.009-1.385-0.015-2.719-4.453 0.964-5.391-2.151-5.391-2.151-0.729-1.844-1.781-2.339-1.781-2.339-1.448-0.989 0.115-0.968 0.115-0.968 1.604 0.109 2.448 1.645 2.448 1.645 1.427 2.448 3.744 1.74 4.661 1.328 0.14-1.031 0.557-1.74 1.011-2.135-3.552-0.401-7.287-1.776-7.287-7.907 0-1.751 0.62-3.177 1.645-4.297-0.177-0.401-0.719-2.031 0.141-4.235 0 0 1.339-0.427 4.4 1.641 1.281-0.355 2.641-0.532 4-0.541 1.36 0.009 2.719 0.187 4 0.541 3.043-2.068 4.381-1.641 4.381-1.641 0.859 2.204 0.317 3.833 0.161 4.235 1.015 1.12 1.635 2.547 1.635 4.297 0 6.145-3.74 7.5-7.296 7.891 0.556 0.479 1.077 1.464 1.077 2.959 0 2.14-0.020 3.864-0.020 4.385 0 0.416 0.28 0.916 1.104 0.755 6.4-2.093 10.979-8.093 10.979-15.156 0-8.833-7.161-16-16-16z" />
                      </svg>
                    </button>
                  </div>
                  <p className="signup">Don't have an account?{' '}
                    <a rel="noopener noreferrer" href="#" onClick={(e) => { e.preventDefault(); setIsFlipped(true); }}>Sign up</a>
                  </p>
                </div>
              </div>
            </div>

            {/* Back side of the card (Sign Up) */}
            <div className="back">
              <div className="form-container">
                <div>
                  <p className="title">Sign Up</p>
                  <p className={`form-message ${isError ? 'error' : ''}`}>{message}</p>
                  <form className="form" onSubmit={handleSignUp} noValidate>
                    <div className="input-group">
                      <label htmlFor="signup-email">Email</label>
                      <input type="email" name="email" id="signup-email" placeholder="" value={email} onChange={handleEmailChange} className={isError ? 'error-input' : ''} />
                    </div>
                    <div className="input-group">
                      <label htmlFor="signup-password">Password</label>
                      <input type="password" name="password" id="signup-password" placeholder="" value={password} onChange={handlePasswordChange} className={isError ? 'error-input' : ''} />
                    </div>
                    <button className="sign" disabled={loading}>{loading ? 'Creating account...' : 'Sign up'}</button>
                  </form>
                </div>
                 <div>
                  <div className="social-message">
                    <div className="line" />
                    <p className="message">Sign up with social accounts</p>
                    <div className="line" />
                  </div>
                  <div className="social-icons">
                     <button aria-label="Sign up with Google" className="icon" onClick={() => socialLogin('google')}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5 fill-current">
                        <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z" />
                      </svg>
                    </button>
                    <button aria-label="Sign up with GitHub" className="icon" onClick={() => socialLogin('github')}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5 fill-current">
                        <path d="M16 0.396c-8.839 0-16 7.167-16 16 0 7.073 4.584 13.068 10.937 15.183 0.803 0.151 1.093-0.344 1.093-0.772 0-0.38-0.009-1.385-0.015-2.719-4.453 0.964-5.391-2.151-5.391-2.151-0.729-1.844-1.781-2.339-1.781-2.339-1.448-0.989 0.115-0.968 0.115-0.968 1.604 0.109 2.448 1.645 2.448 1.645 1.427 2.448 3.744 1.74 4.661 1.328 0.14-1.031 0.557-1.74 1.011-2.135-3.552-0.401-7.287-1.776-7.287-7.907 0-1.751 0.62-3.177 1.645-4.297-0.177-0.401-0.719-2.031 0.141-4.235 0 0 1.339-0.427 4.4 1.641 1.281-0.355 2.641-0.532 4-0.541 1.36 0.009 2.719 0.187 4 0.541 3.043-2.068 4.381-1.641 4.381-1.641 0.859 2.204 0.317 3.833 0.161 4.235 1.015 1.12 1.635 2.547 1.635 4.297 0 6.145-3.74 7.5-7.296 7.891 0.556 0.479 1.077 1.464 1.077 2.959 0 2.14-0.020 3.864-0.020 4.385 0 0.416 0.28 0.916 1.104 0.755 6.4-2.093 10.979-8.093 10.979-15.156 0-8.833-7.161-16-16-16z" />
                      </svg>
                    </button>
                  </div>
                  <p className="signup">Already have an account?{' '}
                    <a rel="noopener noreferrer" href="#" onClick={(e) => { e.preventDefault(); setIsFlipped(false); }}>Sign in</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;