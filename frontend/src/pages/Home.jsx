import React from 'react';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />

      {/* Main Content */}
      <main className="container flex-grow-1 py-5">
        <div className="text-center">
          <h1 className="display-4 fw-bold text-dark">
            Welcome to the Online Appointment App
          </h1>
          <p className="mt-3 mx-auto text-muted lead">
            Schedule appointments quickly and easily with our intuitive online booking system.
          </p>
          <div className="mt-4">
            <a
              href="/register"
              className="btn btn-primary btn-lg px-4 py-2"
            >
              Get Started
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;