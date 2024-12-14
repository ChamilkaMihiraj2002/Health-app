import React, { useState } from 'react';
import { axiosInstance, apiRoutes } from '../axiosInstance';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await axiosInstance({
        method: apiRoutes.register.method,
        url: apiRoutes.register.url,
        data: { name, email, password },
      });
      window.location.href = '/login'; // Redirect to login page on successful registration
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <form
        onSubmit={handleRegister}
        className="p-4 bg-light shadow rounded"
        style={{ maxWidth: '400px', width: '100%' }}
      >
        <h1 className="text-center mb-4">Register</h1>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="form-control"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="form-control"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="form-control"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={isLoading}
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>

        <div className="mt-3 text-center">
          <p className="small">
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
