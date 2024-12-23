import React, { useState } from 'react';
import { axiosInstance, apiRoutes } from '../axiosInstance';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {

      // Perform regular login API request
      const response = await axiosInstance({
        method: apiRoutes.login.method,
        url: apiRoutes.login.url,
        data: { email, password },
      });

      // Store token and user ID in local storage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userID', response.data.user_id); // Adjust key if necessary

      if (email === 'Admin@abc.com' && password === 'admin@123') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/appointments';
      }
      
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <form
        onSubmit={handleLogin}
        className="p-4 bg-light shadow rounded"
        style={{ maxWidth: '400px', width: '100%' }}
      >
        <h1 className="text-center mb-4">Login</h1>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

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
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        <div className="mt-3 text-center">
          <p className="small">
            Don't have an account? <a href="/register">Register</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
