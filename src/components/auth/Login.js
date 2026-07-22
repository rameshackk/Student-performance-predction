import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await login(email, password);
      // login method in AuthContext returns true/false instead of throwing
      if (!success) {
        throw new Error('Invalid email or password');
      }
      toast.success('Logged in successfully');
      navigate('/dashboard'); // will be redirected based on role
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>

      <div style={{ margin: '20px 0', textAlign: 'center' }}>
        <p style={{ margin: '10px 0', color: '#444' }}>Or continue with</p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              const success = await googleLogin(credentialResponse.credential);
              if (success) {
                toast.success('Logged in with Google');
                navigate('/dashboard');
              } else {
                toast.error('Google login failed');
              }
            }}
            onError={() => {
              toast.error('Google login failed');
            }}
          />
        </div>
      </div>

      <p>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  );
};

export default Login;