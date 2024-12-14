import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../axiosInstance'; // Adjust the import path as needed
import 'bootstrap/dist/css/bootstrap.min.css';

const AppointmentPlacement = () => {
  const [formData, setFormData] = useState({
    Location: '',
    Date: '',
    Time: '',
    description: '',
    doctor: '',
    userID: localStorage.getItem('userID') || ''
  });

  const [appointments, setAppointments] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [profileData, setProfileData] = useState({});
  const [profileUpdateData, setProfileUpdateData] = useState({});
  const [profileError, setProfileError] = useState(null);

  useEffect(() => {
    fetchAppointments();
    fetchUserProfile();
  }, []);

  const fetchAppointments = async () => {
    setIsLoading(true);
    setFetchError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axiosInstance.get('/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const appointmentsData = response.data?.data || response.data?.appointments || response.data || [];
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      if (error.response) {
        setFetchError(error.response.data.message || 'Failed to fetch appointments');
      } else if (error.request) {
        setFetchError('No response received from server');
      } else {
        setFetchError('Error setting up the request');
      }
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch User Profile
  const fetchUserProfile = async () => {
    setProfileError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await axiosInstance.get('/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setProfileData(response.data || {});
      setProfileUpdateData(response.data || {});
    } catch (error) {
      setProfileError(error.response?.data?.message || 'Failed to fetch profile data');
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      await axiosInstance.post('/logout', {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      localStorage.removeItem('token');
      localStorage.removeItem('userID');
      alert('Logged out successfully!');
      window.location.reload(); // Refresh or redirect to login
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Failed to logout');
    }
  };

  // Handle Profile Update Input Change
  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileUpdateData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Update User Profile
  const handleProfileUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      await axiosInstance.post('/update', profileUpdateData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert('Profile updated successfully');
      fetchUserProfile();
      setShowProfileModal(false);
    } catch (error) {
      console.error('Profile update failed:', error);
      alert('Failed to update profile');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.Location) newErrors.Location = 'Location is required';
    if (!formData.Date) newErrors.Date = 'Date is required';
    if (!formData.Time) newErrors.Time = 'Time is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.doctor) newErrors.doctor = 'Doctor is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = isEditing
        ? await axiosInstance.put(`/appointments/${selectedAppointment.id}`, formData, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        : await axiosInstance.post('/appointments', formData, {
            headers: { 'Authorization': `Bearer ${token}` }
          });

      const successMessage = response.data?.message || 'Appointment saved successfully';
      setFormData({
        Location: '',
        Date: '',
        Time: '',
        description: '',
        doctor: '',
        userID: localStorage.getItem('userID') || ''
      });
      fetchAppointments();
      alert(successMessage);
      setIsEditing(false);
      setSelectedAppointment(null);
      setShowModal(false);
    } catch (error) {
      console.error('Error saving appointment:', error);
      if (error.response) {
        setSubmitError(error.response.data.message || 'Failed to save appointment');
      } else if (error.request) {
        setSubmitError('No response received from server');
      } else {
        setSubmitError('Error setting up the request');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (appointment) => {
    setFormData({
      Location: appointment.Location,
      Date: appointment.Date,
      Time: appointment.Time,
      description: appointment.description,
      doctor: appointment.doctor,
      userID: localStorage.getItem('userID') || ''
    });
    setIsEditing(true);
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const handleDelete = async (appointmentId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axiosInstance.delete(`/appointments/${appointmentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      fetchAppointments();
      alert('Appointment deleted successfully');
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert('Failed to delete appointment');
    }
  };

  const handleAddAppointment = () => {
    setFormData({
      Location: '',
      Date: '',
      Time: '',
      description: '',
      doctor: '',
      userID: localStorage.getItem('userID') || ''
    });
    setIsEditing(false);
    setSelectedAppointment(null);
    setShowModal(true);
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Appointments</h2>
        <div>
          <button className="btn btn-secondary me-2" onClick={() => setShowProfileModal(true)}>
            View Profile
          </button>
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
      

      <button className="btn btn-primary mb-4" onClick={handleAddAppointment}>
        Add Appointment
      </button>

      <h3>Your Appointments</h3>
      {fetchError && (
        <div className="alert alert-danger" role="alert">
          {fetchError}
        </div>
      )}

      {isLoading ? (
        <p>Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p>No appointments found</p>
      ) : (
        <div className="list-group">
          {appointments.map((appointment) => (
            <div key={appointment.id || Math.random()} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <p><strong>Location:</strong> {appointment.Location || 'N/A'}</p>
                <p><strong>Date:</strong> {appointment.Date || 'N/A'}</p>
                <p><strong>Time:</strong> {appointment.Time || 'N/A'}</p>
                <p><strong>Doctor:</strong> {appointment.doctor || 'N/A'}</p>
                <p><strong>Description:</strong> {appointment.description || 'N/A'}</p>
              </div>
              <div>
                <button
                  onClick={() => handleEdit(appointment)}
                  className="btn btn-warning me-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(appointment.id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{isEditing ? 'Edit Appointment' : 'Add Appointment'}</h5>
              <button type="button" className="btn-close float-end" onClick={() => setShowModal(false)} aria-label="Close">
                
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                {submitError && (
                  <div className="alert alert-danger" role="alert">
                    {submitError}
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    name="Location"
                    value={formData.Location}
                    onChange={handleInputChange}
                    className={`form-control ${errors.Location ? 'is-invalid' : ''}`}
                  />
                  {errors.Location && <div className="invalid-feedback">{errors.Location}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    name="Date"
                    value={formData.Date}
                    onChange={handleInputChange}
                    className={`form-control ${errors.Date ? 'is-invalid' : ''}`}
                  />
                  {errors.Date && <div className="invalid-feedback">{errors.Date}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Time</label>
                  <input
                    type="time"
                    name="Time"
                    value={formData.Time}
                    onChange={handleInputChange}
                    className={`form-control ${errors.Time ? 'is-invalid' : ''}`}
                  />
                  {errors.Time && <div className="invalid-feedback">{errors.Time}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Doctor</label>
                  <input
                    type="text"
                    name="doctor"
                    value={formData.doctor}
                    onChange={handleInputChange}
                    className={`form-control ${errors.doctor ? 'is-invalid' : ''}`}
                  />
                  {errors.doctor && <div className="invalid-feedback">{errors.doctor}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                    rows="3"
                  ></textarea>
                  {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`btn ${isLoading ? 'btn-secondary' : 'btn-primary'}`}
                >
                  {isLoading ? 'Saving...' : isEditing ? 'Update Appointment' : 'Create Appointment'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      <div 
        className={`modal fade ${showProfileModal ? 'show' : ''}`} 
        style={{ display: showProfileModal ? 'block' : 'none' }} 
        tabIndex="-1" 
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">User Profile</h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setShowProfileModal(false)} 
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              {profileError && (
                <div className="alert alert-danger" role="alert">
                  {profileError}
                </div>
              )}

              <form onSubmit={(e) => { e.preventDefault(); handleProfileUpdate(); }}>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={profileUpdateData.name || ''}
                    onChange={handleProfileInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={profileUpdateData.email || ''}
                    onChange={handleProfileInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="current_password"
                    onChange={handleProfileInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="new_password"
                    onChange={handleProfileInputChange}
                  />
                  <small className="text-muted">
                    Leave password fields empty if you don't want to change it
                  </small>
                </div>

                <div className="d-flex justify-content-between">
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Update Profile
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowProfileModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Backdrop */}
      {(showModal || showProfileModal) && (
        <div 
          className="modal-backdrop fade show" 
          onClick={() => {
            setShowModal(false);
            setShowProfileModal(false);
          }}
        ></div>
      )}
   
    </div>

  
    
    
  );

};

export default AppointmentPlacement;