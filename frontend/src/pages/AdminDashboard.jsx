import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../axiosInstance';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Initialize state with more robust typing
  const [users, setUsers] = useState({
    data: [],
    loading: false,
    error: null
  });
  
  const [doctors, setDoctors] = useState({
    data: [],
    loading: false,
    error: null
  });
  
  const [appointments, setAppointments] = useState({
    data: [],
    loading: false,
    error: null
  });

  // Utility function to safely get data
  const safelyGetData = (response, key) => {
    // Check multiple possible data structures
    if (Array.isArray(response.data)) return response.data;
    if (response.data && Array.isArray(response.data[key])) return response.data[key];
    if (response.data && Array.isArray(response.data.data)) return response.data.data;
    return [];
  };

  // Create authorized axios instance
  const createAuthorizedRequest = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      handleLogout();
      return null;
    }
    return axiosInstance.create({
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  };

  // Fetch Users
  const fetchUsers = async () => {
    // Reset users state before fetching
    setUsers(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const api = createAuthorizedRequest();
      if (!api) return;

      const response = await api.get('/users');
      const userData = safelyGetData(response, 'users');

      // Validate user data structure
      const validatedUsers = userData.filter(user => 
        user && typeof user === 'object' && 
        user.id && 
        user.name && 
        user.email
      );

      setUsers({
        data: validatedUsers,
        loading: false,
        error: validatedUsers.length === 0 ? 'No users found' : null
      });
    } catch (err) {
      console.error('User fetch error:', err);
      setUsers({
        data: [],
        loading: false,
        error: err.response?.data?.message || 'Failed to fetch users'
      });

      // Handle unauthorized access
      if (err.response && err.response.status === 401) {
        handleLogout();
      }
    }
  };

  // Fetch Doctors
  const fetchDoctors = async () => {
    // Reset doctors state before fetching
    setDoctors(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const api = createAuthorizedRequest();
      if (!api) return;

      const response = await api.get('/doctors');
      const doctorData = safelyGetData(response, 'doctors');

      // Validate doctor data structure
      const validatedDoctors = doctorData.filter(doctor => 
        doctor && typeof doctor === 'object' && 
        doctor.id && 
        doctor.name && 
        doctor.specialty
      );

      setDoctors({
        data: validatedDoctors,
        loading: false,
        error: validatedDoctors.length === 0 ? 'No doctors found' : null
      });
    } catch (err) {
      console.error('Doctor fetch error:', err);
      setDoctors({
        data: [],
        loading: false,
        error: err.response?.data?.message || 'Failed to fetch doctors'
      });

      // Handle unauthorized access
      if (err.response && err.response.status === 401) {
        handleLogout();
      }
    }
  };

  // Fetch Appointments
  const fetchAppointments = async () => {
    // Reset appointments state before fetching
    setAppointments(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const api = createAuthorizedRequest();
      if (!api) return;

      const response = await api.get('/appointments');
      const appointmentData = safelyGetData(response, 'appointments');

      // Validate appointment data structure
      const validatedAppointments = appointmentData.filter(appointment => 
        appointment && typeof appointment === 'object' && 
        appointment.id && 
        appointment.date && 
        appointment.time
      );

      setAppointments({
        data: validatedAppointments,
        loading: false,
        error: validatedAppointments.length === 0 ? 'No appointments found' : null
      });
    } catch (err) {
      console.error('Appointments fetch error:', err);
      setAppointments({
        data: [],
        loading: false,
        error: err.response?.data?.message || 'Failed to fetch appointments'
      });

      // Handle unauthorized access
      if (err.response && err.response.status === 401) {
        handleLogout();
      }
    }
  };

  // Fetch all data on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      handleLogout();
      return;
    }

    fetchUsers();
    fetchDoctors();
    fetchAppointments();
  }, []);

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userID');
    navigate('/login');
  };

  // Delete User
  const deleteUser = async (id) => {
    try {
      const api = createAuthorizedRequest();
      if (!api) return;

      await api.delete(`/users/${id}`);
      setUsers(prev => ({
        ...prev,
        data: prev.data.filter(user => user.id !== id)
      }));
    } catch (err) {
      console.error('Delete user error:', err);
      if (err.response && err.response.status === 401) {
        handleLogout();
      }
    }
  };

  // Delete Doctor
  const deleteDoctor = async (id) => {
    try {
      const api = createAuthorizedRequest();
      if (!api) return;

      await api.delete(`/doctors/${id}`);
      setDoctors(prev => ({
        ...prev,
        data: prev.data.filter(doctor => doctor.id !== id)
      }));
    } catch (err) {
      console.error('Delete doctor error:', err);
      if (err.response && err.response.status === 401) {
        handleLogout();
      }
    }
  };

  // Delete Appointment
  const deleteAppointment = async (id) => {
    try {
      const api = createAuthorizedRequest();
      if (!api) return;

      await api.delete(`/appointments/${id}`);
      setAppointments(prev => ({
        ...prev,
        data: prev.data.filter(appointment => appointment.id !== id)
      }));
    } catch (err) {
      console.error('Delete appointment error:', err);
      if (err.response && err.response.status === 401) {
        handleLogout();
      }
    }
  };

  // Dashboard Statistics
  const stats = [
    { title: 'Total Users', value: users.data.length, icon: 'bi-people' },
    { title: 'Total Doctors', value: doctors.data.length, icon: 'bi-hospital' },
    { title: 'Total Appointments', value: appointments.data.length, icon: 'bi-calendar-check' },
    { title: 'Total Revenue', value: '$12,345', icon: 'bi-currency-dollar' },
  ];

  // Render Users Table
  const renderUsersTable = () => {
    if (users.loading) return <div className="text-center">Loading users...</div>;
    if (users.error) return <div className="alert alert-warning">{users.error}</div>;
    
    return (
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.data.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-danger me-2" 
                    onClick={() => deleteUser(user.id)}
                  >
                    Delete
                  </button>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Render Doctors Table
  const renderDoctorsTable = () => {
    if (doctors.loading) return <div className="text-center">Loading doctors...</div>;
    if (doctors.error) return <div className="alert alert-warning">{doctors.error}</div>;
    
    return (
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Hospital</th>
              <th>Specialty</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.data.map(doctor => (
              <tr key={doctor.id}>
                <td>{doctor.name}</td>
                <td>{doctor.hospital || 'N/A'}</td>
                <td>{doctor.specialty}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-danger me-2" 
                    onClick={() => deleteDoctor(doctor.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Render Appointments Table
  const renderAppointmentsTable = () => {
    if (appointments.loading) return <div className="text-center">Loading appointments...</div>;
    if (appointments.error) return <div className="alert alert-warning">{appointments.error}</div>;
    
    return (
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Location</th>
              <th>Date</th>
              <th>Time</th>
              <th>Description</th>
              <th>Doctor</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.data.map(appointment => (
              <tr key={appointment.id}>
                <td>{appointment.location || 'N/A'}</td>
                <td>{appointment.date}</td>
                <td>{appointment.time}</td>
                <td>{appointment.description || 'No description'}</td>
                <td>{appointment.doctor || 'Unassigned'}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-danger me-2" 
                    onClick={() => deleteAppointment(appointment.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="admin-dashboard bg-light min-vh-100">
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Admin Dashboard</a>
          <div className="d-flex align-items-center">
            <span className="text-white me-3">Admin</span>
            <button className="btn btn-outline-light" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-2"></i>Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3 col-lg-2 bg-white sidebar">
            <div className="position-sticky pt-3">
              <ul className="nav flex-column">
                {[
                  { tab: 'overview', icon: 'bi-speedometer2', label: 'Overview' },
                  { tab: 'users', icon: 'bi-people', label: 'Users' },
                  { tab: 'doctors', icon: 'bi-hospital', label: 'Doctors' },
                  { tab: 'appointments', icon: 'bi-calendar-check', label: 'Appointments' }
                ].map(({ tab, icon, label }) => (
                  <li key={tab} className="nav-item">
                    <button
                      className={`nav-link btn btn-link w-100 text-start ${activeTab === tab ? 'active' : ''}`}
                      onClick={() => setActiveTab(tab)}
                    >
                      <i className={`bi ${icon} me-2`}></i>
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="row">
                {stats.map((stat, index) => (
                  <div key={index} className="col-md-3 mb-4">
                    <div className="card">
                      <div className="card-body d-flex align-items-center">
                        <div className="me-3">
                          <i className={`bi ${stat.icon} fs-2 text-primary`}></i>
                        </div>
                        <div>
                          <h5 className="card-title text-muted">{stat.title}</h5>
                          <p className="card-text h4">{stat.value}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="card">
                <div className="card-header">Users Management</div>
                <div className="card-body">
                  {renderUsersTable()}
                </div>
              </div>
            )}

            {/* Doctors Tab */}
            {activeTab === 'doctors' && (
              <div className="card">
                <div className="card-header">Doctors Management</div>
                <div className="card-body">
                  {renderDoctorsTable()}
                </div>
              </div>
            )}

            {/* Appointments Tab */}
            {activeTab === 'appointments' && (
              <div className="card">
                <div className="card-header">Appointments Management</div>
                <div className="card-body">
                  {renderAppointmentsTable()}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;