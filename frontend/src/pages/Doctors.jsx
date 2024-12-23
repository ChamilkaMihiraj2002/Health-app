import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Button, Modal } from 'react-bootstrap';
import { axiosInstance } from '../axiosInstance';
import Navbar from '../components/Navbar';
import DoctorPlaceholder from '../assets/doctor.jpg'; // Create this placeholder image

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axiosInstance.get('/doctors');
        
        console.log('Full API Response:', response);
        
        let doctorData = [];
        if (Array.isArray(response.data)) {
          doctorData = response.data;
        } else if (response.data && Array.isArray(response.data.doctors)) {
          doctorData = response.data.doctors;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          doctorData = response.data.data;
        } else {
          throw new Error('Unexpected response format');
        }

        doctorData = doctorData.filter(doctor => 
          doctor && typeof doctor === 'object' && 
          doctor.name && doctor.hospital && doctor.specialty
        );

        setDoctors(doctorData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError(`Failed to fetch doctors: ${err.message}`);
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowAppointmentModal(true);
  };

  const handleCloseAppointmentModal = () => {
    setShowAppointmentModal(false);
    setSelectedDoctor(null);
  };

  if (loading) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="text-center">
          <div className="spinner-grow text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading Doctors...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="vh-100 bg-danger d-flex align-items-center justify-content-center">
        <div className="text-center text-white p-5 rounded shadow">
          <h2 className="mb-4">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Error
          </h2>
          <p className="lead">{error}</p>
          <Button variant="light" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </Container>
    );
  }

  if (doctors.length === 0) {
    return (
      <Container fluid className="vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h2 className="text-muted mb-4">No Doctors Found</h2>
          <p className="lead text-secondary">Our medical team is currently being updated.</p>
        </div>
      </Container>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <Navbar />
      <Container className="py-5">
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-primary mb-3">Our Medical Experts</h1>
          <p className="lead text-muted">Compassionate Care, Exceptional Expertise</p>
        </div>

        {/* Introductory Paragraph */}
        <div className="row mb-5">
          <div className="col-12 col-lg-10 mx-auto">
            <div className="bg-white p-4 rounded shadow-sm">
              <p className="text-center text-muted">
                At our healthcare center, we pride ourselves on assembling a team of highly skilled and compassionate medical professionals. 
                Our doctors are committed to providing personalized, comprehensive care tailored to each patient's unique needs. 
                With extensive experience across various specialties, our medical experts combine cutting-edge medical knowledge 
                with a deep sense of empathy to ensure the best possible healthcare experience.
              </p>
            </div>
          </div>
        </div>

        <Row xs={1} md={2} lg={3} className="g-4">
          {doctors.map((doctor, index) => (
            <Col key={doctor.id || index}>
              <Card 
                className="h-100 border-0 shadow-lg hover-lift transition-transform" 
                style={{ 
                  borderRadius: '15px', 
                  overflow: 'hidden' 
                }}
              >
                {/* Common Doctor Image */}
                <Card.Img 
                  variant="top" 
                  src={DoctorPlaceholder} 
                  alt="Doctor Placeholder" 
                  className="img-fluid"
                  style={{ 
                    height: '250px', 
                    objectFit: 'cover' 
                  }}
                />
                <div 
                  className="card-header bg-primary text-white text-center py-3"
                  style={{ 
                    backgroundColor: '#007bff', 
                    borderBottom: 'none' 
                  }}
                >
                  <h5 className="card-title mb-0">{doctor.name}</h5>
                </div>
                <Card.Body className="p-4">
                  <Card.Text>
                    <div className="d-flex justify-content-between mb-2">
                      <strong className="text-muted">Hospital:</strong>
                      <span>{doctor.hospital}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <strong className="text-muted">Specialty:</strong>
                      <span className="text-primary fw-bold">{doctor.specialty}</span>
                    </div>
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="bg-white border-0 p-3">
                  <Button 
                    variant="primary" 
                    className="w-100 rounded-pill" 
                    onClick={() => handleBookAppointment(doctor)}
                  >
                    Book Appointment
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Appointment Booking Modal */}
      <Modal show={showAppointmentModal} onHide={handleCloseAppointmentModal} centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>Book Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDoctor && (
            <div>
              <h5 className="text-primary">{selectedDoctor.name}</h5>
              <p>
                <strong>Hospital:</strong> {selectedDoctor.hospital}
                <br />
                <strong>Specialty:</strong> {selectedDoctor.specialty}
              </p>
              <p className="text-muted">Appointment booking feature coming soon!</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAppointmentModal}>
            Close
          </Button>
          <Button variant="primary" disabled>
            Book Now
          </Button>
        </Modal.Footer>
      </Modal>
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

export default Doctors;