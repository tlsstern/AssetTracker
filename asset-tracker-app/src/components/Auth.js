import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      alert('Check your email for the login link!');
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-6">
        <div className="card">
          <div className="card-body">
            <h1 className="header">Asset Tracker Login</h1>
            <p className="description">Sign in via magic link with your email below</p>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <input
                  className="form-control"
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <button className="btn btn-primary" disabled={loading}>
                  {loading ? <span>Loading...</span> : <span>Send magic link</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}