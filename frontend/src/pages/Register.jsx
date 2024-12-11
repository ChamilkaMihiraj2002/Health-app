import React, { useState } from 'react';
import { axiosInstance, apiRoutes } from '../axiosInstance';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance({
        method: apiRoutes.register.method,
        url: apiRoutes.register.url,
        data: { name, email, password },
      });
      window.location.href = '/login';
    } catch (error) {
      console.error('Registration failed:', error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h1>Register</h1>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
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
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;