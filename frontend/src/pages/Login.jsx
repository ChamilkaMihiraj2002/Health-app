import React, { useState } from 'react';
import { axiosInstance, apiRoutes } from '../axiosInstance';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance({
        method: apiRoutes.login.method,
        url: apiRoutes.login.url,
        data: { email, password },
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userID', response.data.user_id); // Ensure this matches the response key
      window.location.href = '/appointments';
    } catch (error) {
      console.error('Login failed:', error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h1>Login</h1>
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
  );
};

export default Login;