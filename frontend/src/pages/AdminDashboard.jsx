import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../axiosInstance';
import 'bootstrap-icons/font/bootstrap-icons.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
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

  const safelyGetData = (response, key) => {
    if (Array.isArray(response.data)) return response.data;
    if (response.data && Array.isArray(response.data[key])) return response.data[key];
    if (response.data && Array.isArray(response.data.data)) return response.data.data;
    return [];
  };

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

  const fetchUsers = async () => {
    setUsers(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const api = createAuthorizedRequest();
      if (!api) return;

      const response = await api.get('/users');
      const userData = safelyGetData(response, 'users');

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

      if (err.response && err.response.status === 401) {
        handleLogout();
      }
    }
  };

  const fetchDoctors = async () => {
    setDoctors(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const api = createAuthorizedRequest();
      if (!api) return;

      const response = await api.get('/doctors');
      const doctorData = safelyGetData(response, 'doctors');

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

      if (err.response && err.response.status === 401) {
        handleLogout();
      }
    }
  };

  const fetchAppointments = async () => {
    setAppointments(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        handleLogout();
        return;
      }
  
      const response = await axiosInstance.get('/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      const appointmentData = response.data?.data || [];
  
      const validatedAppointments = appointmentData.filter(appointment => 
        appointment && 
        typeof appointment === 'object' && 
        appointment.id && 
        appointment.Date && 
        appointment.Time && 
        appointment.Location && 
        appointment.doctor
      ).map(appointment => ({
        id: appointment.id,
        date: appointment.Date,
        time: appointment.Time,
        location: appointment.Location,
        doctor: appointment.doctor,
        description: appointment.description,
        userId: appointment.userID,
        createdAt: appointment.created_at
      }));
  
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
  
      if (err.response?.status === 401) {
        handleLogout();
      }
    }
  };

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

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
    
      await axiosInstance.post('/logout', {}, {
          headers: { 'Authorization': `Bearer ${token}` }
      });
      localStorage.removeItem('token');
      localStorage.removeItem('userID');
      setTimeout(() => window.location.reload(), 1000);
      } catch (error) {
        console.error('Logout error:', error);
      }
  };

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

  const stats = [
    { title: 'Total Users', value: users.data.length, icon: 'bi-people' },
    { title: 'Total Doctors', value: doctors.data.length, icon: 'bi-hospital' },
    { title: 'Total Appointments', value: appointments.data.length, icon: 'bi-calendar-check' },
  ];

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

          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
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

            {activeTab === 'users' && (
              <div className="card">
                <div className="card-header">Users Management</div>
                <div className="card-body">
                  {renderUsersTable()}
                </div>
              </div>
            )}

            {activeTab === 'doctors' && (
              <div className="card">
                <div className="card-header">Doctors Management</div>
                <div className="card-body">
                  {renderDoctorsTable()}
                </div>
              </div>
            )}

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