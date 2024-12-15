import React from "react";
import mission from '../assets/About/mission.jpg';
import vision from '../assets/About/vision.jpg';
import values from '../assets/About/values.jpg';
import Navbar from '../components/Navbar';


import ceo from '../assets/About/ceo.jpg';
import cto from '../assets/About/cto.jpg';
import hcs from '../assets/About/hcs.jpg';

const About = () => {
  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "500K+", label: "Appointments Booked" },
    { number: "98%", label: "Satisfaction Rate" },
    { number: "24/7", label: "Support" }
  ];

  const teamMembers = [
    { name: "Chamilka Mihiraj", role: "CEO & Founder", image:  ceo },
    { name: "Anjana Edirisinghe", role: "Chief Technology Officer", image: cto },
    { name: "Dishma Gagulal", role: "Head of Customer Success", image: hcs }
  ];

  return (
    <div className="about-page">
      <Navbar />
     
      <div className="py-5 text-center position-relative bg-light">
        <div className="container py-5">
          <h1 className="display-3 fw-bold text-primary mb-4 animate__animated animate__fadeIn">
            Revolutionizing Appointment Booking
          </h1>
          <p className="lead text-muted mx-auto fs-4 w-75">
            Welcome to the future of scheduling. We're reimagining how appointments are made, 
            managed, and experienced in the digital age.
          </p>
        </div>
      </div>


      <div className="bg-primary text-white py-5">
        <div className="container">
          <div className="row g-4">
            {stats.map((stat, index) => (
              <div key={index} className="col-md-3 text-center">
                <h2 className="display-4 fw-bold">{stat.number}</h2>
                <p className="lead mb-0">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>


      <div className="container py-5">
        <div className="row g-4">
          {/* Mission Section */}
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm hover-card">
              <div className="card-body text-center p-4">
                <img
                  src={mission}
                  alt="Mission Icon"
                  className="mb-4 rounded-circle bg-light p-3"
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
                <h3 className="h4 fw-bold text-primary">Our Mission</h3>
                <p className="text-muted">
                  To provide a seamless and user-friendly platform for managing appointments,
                  making life simpler for both service providers and clients through innovative
                  technology solutions.
                </p>
              </div>
            </div>
          </div>

          {/* Vision Section */}
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm hover-card">
              <div className="card-body text-center p-4">
                <img
                  src={vision}
                  alt="Vision Icon"
                  className="mb-4 rounded-circle bg-light p-3"
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
                <h3 className="h4 fw-bold text-primary">Our Vision</h3>
                <p className="text-muted">
                  To become the global standard in appointment management, trusted by millions
                  of businesses and individuals worldwide for its reliability and innovation.
                </p>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm hover-card">
              <div className="card-body text-center p-4">
                <img
                  src={values}
                  alt="Values Icon"
                  className="mb-4 rounded-circle bg-light p-3"
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
                <h3 className="h4 fw-bold text-primary">Our Values</h3>
                <p className="text-muted">
                  Built on the foundations of trust, innovation, and user empowerment. We're
                  committed to delivering excellence through simplicity and reliability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-light py-5">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">Meet Our Leadership Team</h2>
          <div className="row g-4">
            {teamMembers.map((member, index) => (
              <div key={index} className="col-md-4">
                <div className="card border-0 shadow-sm text-center hover-card">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="card-img-top rounded-circle mx-auto mt-4"
                    style={{ width: "150px", height: "150px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title fw-bold">{member.name}</h5>
                    <p className="card-text text-muted">{member.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="container py-5 text-center">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h2 className="display-6 fw-bold text-primary mb-4">Ready to Transform Your Scheduling?</h2>
            <p className="lead text-muted mb-4">
              Join thousands of satisfied users who have revolutionized their appointment 
              management with our platform.
            </p>
            <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
              <a href="/register" className="btn btn-primary btn-lg px-4 gap-3">
                Get Started Free
              </a>
              <a href="/contact" className="btn btn-outline-secondary btn-lg px-4">
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </div>

   
      <style jsx>{`
        .hover-card {
          transition: transform 0.3s ease-in-out;
        }
        .hover-card:hover {
          transform: translateY(-10px);
        }
      `}</style>

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

export default About;