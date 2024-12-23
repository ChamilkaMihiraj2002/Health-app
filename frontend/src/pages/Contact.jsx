import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="contact-page">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-primary text-white py-5 mb-5">
        <div className="container text-center">
          <h1 className="display-4 fw-bold">Contact Us</h1>
          <p className="lead">We'd love to hear from you. Get in touch with us!</p>
        </div>
      </div>

      <div className="container mb-5">
        <div className="row">
          {/* Contact Information */}
          <div className="col-lg-4 mb-4 mb-lg-0">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h2 className="h4 mb-4">Get in Touch</h2>
                
                <div className="d-flex mb-4">
                  <div className="flex-shrink-0">
                    <i className="bi bi-geo-alt text-primary fs-4"></i>
                  </div>
                  <div className="ms-3">
                    <h3 className="h6 mb-1">Visit Us</h3>
                    <p className="mb-0">123 Business Street<br />New York, NY 10001</p>
                  </div>
                </div>

                <div className="d-flex mb-4">
                  <div className="flex-shrink-0">
                    <i className="bi bi-envelope text-primary fs-4"></i>
                  </div>
                  <div className="ms-3">
                    <h3 className="h6 mb-1">Email Us</h3>
                    <p className="mb-0">support@example.com<br />sales@example.com</p>
                  </div>
                </div>

                <div className="d-flex">
                  <div className="flex-shrink-0">
                    <i className="bi bi-telephone text-primary fs-4"></i>
                  </div>
                  <div className="ms-3">
                    <h3 className="h6 mb-1">Call Us</h3>
                    <p className="mb-0">+1 (555) 123-4567<br />Mon-Fri 9:00-18:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h2 className="h4 mb-4">Send us a Message</h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          name="name"
                          placeholder="Your Name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="name">Your Name</label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-floating mb-3">
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          placeholder="Your Email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="email">Your Email</label>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="subject"
                          name="subject"
                          placeholder="Subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="subject">Subject</label>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-floating mb-3">
                        <textarea
                          className="form-control"
                          id="message"
                          name="message"
                          placeholder="Your Message"
                          style={{ height: '150px' }}
                          value={formData.message}
                          onChange={handleChange}
                          required
                        ></textarea>
                        <label htmlFor="message">Your Message</label>
                      </div>
                    </div>

                    <div className="col-12">
                      <button type="submit" className="btn btn-primary btn-lg">
                        Send Message
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-light py-5">
        <div className="container">
          <h2 className="text-center mb-5">Frequently Asked Questions</h2>
          <div className="row g-4">
            <div className="col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h3 className="h5 mb-3">How quickly do you respond to inquiries?</h3>
                  <p className="text-muted mb-0">We aim to respond to all inquiries within 24 hours during business days.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h3 className="h5 mb-3">What are your business hours?</h3>
                  <p className="text-muted mb-0">Our support team is available Monday through Friday, 9:00 AM to 6:00 PM EST.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Bootstrap Icons CSS */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css"
      />

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

export default Contact;