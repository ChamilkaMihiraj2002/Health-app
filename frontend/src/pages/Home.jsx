import React from 'react';
import Navbar from '../components/Navbar';
import heroImage from '../assets/hero-image.png'; // Replace with your image path
import featuresImage from '../assets/features-image.png'; // Replace with your image path

const Home = () => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />

      {/* Hero Section */}
      <header className="container-fluid bg-primary text-white py-5">
        <div className="container d-flex flex-column flex-md-row align-items-center">
          <div className="text-center text-md-start me-md-4">
            <h1 className="display-4 fw-bold">Effortless Appointment Scheduling</h1>
            <p className="mt-3 lead">
              Save time and energy with our streamlined appointment booking system. Designed for ease of use and efficiency.
            </p>
            <a href="/register" className="btn btn-light btn-lg px-4 py-2 mt-3">
              Get Started Now
            </a>
          </div>
          <div className="mt-4 mt-md-0">
            <img src={heroImage} alt="Appointment Booking" className="img-fluid rounded shadow" />
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="container py-5">
        <h2 className="text-center mb-5">Why Choose Our App?</h2>
        <div className="row align-items-center">
          <div className="col-md-6">
            <img src={featuresImage} alt="Features" className="img-fluid rounded shadow" />
          </div>
          <div className="col-md-6">
            <ul className="list-unstyled">
              <li className="mb-3 d-flex align-items-start">
                <i className="bi bi-check-circle-fill text-primary me-2 fs-4"></i>
                <p className="mb-0">Easily book, reschedule, or cancel appointments anytime.</p>
              </li>
              <li className="mb-3 d-flex align-items-start">
                <i className="bi bi-check-circle-fill text-primary me-2 fs-4"></i>
                <p className="mb-0">Receive reminders to ensure you never miss an appointment.</p>
              </li>
              <li className="mb-3 d-flex align-items-start">
                <i className="bi bi-check-circle-fill text-primary me-2 fs-4"></i>
                <p className="mb-0">Access your appointment history and upcoming schedule.</p>
              </li>
              <li className="mb-3 d-flex align-items-start">
                <i className="bi bi-check-circle-fill text-primary me-2 fs-4"></i>
                <p className="mb-0">Secure and easy-to-use platform for peace of mind.</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-light py-5">
        <div className="container">
          <h2 className="text-center mb-5">What Our Users Say</h2>
          <div className="row">
            <div className="col-md-4">
              <blockquote className="blockquote text-center bg-white p-4 rounded shadow">
                <p>"This app has made scheduling so much easier. I can manage my appointments with just a few clicks!"</p>
                <footer className="blockquote-footer">John Doe</footer>
              </blockquote>
            </div>
            <div className="col-md-4">
              <blockquote className="blockquote text-center bg-white p-4 rounded shadow">
                <p>"I love the reminders! I’ve never missed an appointment since I started using this app."</p>
                <footer className="blockquote-footer">Jane Smith</footer>
              </blockquote>
            </div>
            <div className="col-md-4">
              <blockquote className="blockquote text-center bg-white p-4 rounded shadow">
                <p>"Simple, effective, and secure. Highly recommended for anyone with a busy schedule."</p>
                <footer className="blockquote-footer">Emily Brown</footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <div className="container text-center">
          <p className="mb-0">&copy; {new Date().getFullYear()} Online Appointment App. All rights reserved.</p>
          <p>Chamilka Mihiraj Perera @ UOM FIT22</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
