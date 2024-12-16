import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../axiosInstance';
import UserDetails from "../components/UserDetails";
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
  const [notifications, setNotifications] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [profileData, setProfileData] = useState({});
  const [profileUpdateData, setProfileUpdateData] = useState({});
  const [profileError, setProfileError] = useState(null);
  const { userData, loading } = UserDetails();
  let name, email;

  useEffect(() => {
    fetchAppointments();
    fetchUserProfile();
  }, []);

  const loadUserData = async () => {
    if (!loading) {
      name = userData.name;
      email = userData.email;
    }
  };

  loadUserData();
  const fetchAppointments = async () => {
    setIsLoading(true);
    const userID = localStorage.getItem('userID');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axiosInstance.get(`/appointments/user/${userID}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const appointmentsData = response.data?.data || response.data?.appointments || [];
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserProfile = async () => {
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

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      await axiosInstance.post('/logout', {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      localStorage.removeItem('token');
      localStorage.removeItem('userID');
      addNotification('Logged out successfully!', 'success');
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      addNotification('Failed to logout', 'danger');
    }
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileUpdateData(prev => ({
      ...prev,
      [name]: value
    }));

  };

  const handleProfileUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      await axiosInstance.post('/update', profileUpdateData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      addNotification('Profile updated successfully', 'success');
      fetchUserProfile();
      setShowProfileModal(false);

    } catch (error) {
      addNotification('Failed to update profile', 'danger');
    }
  };

  const handleDeleteProfile = async () => {
    const userId = localStorage.getItem('userID');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      await axiosInstance.delete(`/users/${userId}`, { headers: { 'Authorization': `Bearer ${token}` } });
      localStorage.removeItem('token');
      localStorage.removeItem('userID');
      addNotification('Account deleted successfully!', 'success');
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      addNotification('Profile delete failed', 'danger');
    }
  };

  const deleteProfile = () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      handleDeleteProfile();
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
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = isEditing
        ? await axiosInstance.put(`/appointments/${selectedAppointment.id}`, formData, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        : await axiosInstance.post('/appointments', formData, {
            headers: { 'Authorization': `Bearer ${token}` }
          });

      const successMessage = response.data?.message || 'Appointment saved successfully';
      setFormData({ Location: '', Date: '', Time: '', description: '', doctor: '', userID: localStorage.getItem('userID') || '' });
      fetchAppointments();
      addNotification(successMessage, 'success');
      setShowModal(false);
      setIsEditing(false);
    } catch (error) {
      addNotification('Failed to save appointment', 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (appointment) => {
    setFormData({ ...appointment, userID: localStorage.getItem('userID') || '' });
    setIsEditing(true);
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const handleDelete = async (appointmentId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      await axiosInstance.delete(`/appointments/${appointmentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      fetchAppointments();
      addNotification('Appointment deleted successfully', 'success');
    } catch (error) {
      addNotification('Failed to delete appointment', 'danger');
    }
  };

  const handleAddAppointment = () => {
    setFormData({ Location: '', Date: '', Time: '', description: '', doctor: '', userID: localStorage.getItem('userID') || '' });
    setIsEditing(false);
    setSelectedAppointment(null);
    setShowModal(true);
  };

  const addNotification = (message, type) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => setNotifications(prev => prev.filter(notification => notification.id !== id)), 3000);
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

      {notifications.map(({ id, message, type }) => (
        <div key={id} className={`toast show align-items-center text-bg-${type} border-0 mb-2`} role="alert" aria-live="assertive" aria-atomic="true">
          <div className="d-flex">
            <div className="toast-body">
              {message}
            </div>
            <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setNotifications(prev => prev.filter(n => n.id !== id))} aria-label="Close"></button>
          </div>
        </div>
      ))}

      <button className="btn btn-primary mb-4" onClick={handleAddAppointment}>
        Add Appointment
      </button>

      <h3>Your Appointments</h3>
      {isLoading ? (
        <p>Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <div className="list-group">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <p><strong>Location:</strong> {appointment.Location || 'N/A'}</p>
                <p><strong>Date:</strong> {appointment.Date || 'N/A'}</p>
                <p><strong>Time:</strong> {appointment.Time || 'N/A'}</p>
                <p><strong>Doctor:</strong> {appointment.doctor || 'N/A'}</p>
                <p><strong>Description:</strong> {appointment.description || 'N/A'}</p>
              </div>
              <div>
                <button className="btn btn-warning me-2" onClick={() => handleEdit(appointment)}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(appointment.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for adding/editing appointments */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{isEditing ? 'Edit Appointment' : 'Add Appointment'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Location"
                      value={formData.Location}
                      onChange={handleInputChange}
                    />
                    {errors.Location && <small className="text-danger">{errors.Location}</small>}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="Date"
                      value={formData.Date}
                      onChange={handleInputChange}
                    />
                    {errors.Date && <small className="text-danger">{errors.Date}</small>}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Time</label>
                    <input
                      type="time"
                      className="form-control"
                      name="Time"
                      value={formData.Time}
                      onChange={handleInputChange}
                    />
                    {errors.Time && <small className="text-danger">{errors.Time}</small>}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Doctor</label>
                    <input
                      type="text"
                      className="form-control"
                      name="doctor"
                      value={formData.doctor}
                      onChange={handleInputChange}
                    />
                    {errors.doctor && <small className="text-danger">{errors.doctor}</small>}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                    {errors.description && <small className="text-danger">{errors.description}</small>}
                  </div>
                  <button type="submit" className="btn btn-primary">Save</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  <label className="form-label">Name </label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={profileUpdateData.name || name || ''}
                    onChange={handleProfileInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email </label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={profileUpdateData.email || email || ''}
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
                    onClick={() => deleteProfile()}
                    className="btn btn-danger"
                  >
                    Delete Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentPlacement;
