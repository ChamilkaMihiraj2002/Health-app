import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../axiosInstance'; // Adjust the import path as needed

const AppointmentPlacement = () => {
  // State for form inputs
  const [formData, setFormData] = useState({
    Location: '',
    Date: '',
    Time: '',
    description: '',
    doctor: '',
    userID: localStorage.getItem('userID') || ''
  });

  // State for user's appointments
  const [appointments, setAppointments] = useState([]);

  // State for form validation and submission
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  // Fetch user's appointments on component mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Fetch appointments
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

      // Defensive programming to handle different possible response structures
      const appointmentsData = response.data?.data || 
                                response.data?.appointments || 
                                response.data || 
                                [];

      // Ensure we always have an array
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      
      // More detailed error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setFetchError(error.response.data.message || 'Failed to fetch appointments');
      } else if (error.request) {
        // The request was made but no response was received
        setFetchError('No response received from server');
      } else {
        // Something happened in setting up the request that triggered an Error
        setFetchError('Error setting up the request');
      }
      
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validate form
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

  // Submit appointment
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset previous submission error
    setSubmitError(null);

    // Validate form
    if (!validateForm()) return;

    // Start loading state
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axiosInstance.post('/appointments', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Handle successful submission
      // Check for different possible response structures
      const successMessage = response.data?.message || 
                              'Appointment created successfully';

      // Reset form
      setFormData({
        Location: '',
        Date: '',
        Time: '',
        description: '',
        doctor: '',
        userID: localStorage.getItem('userID') || ''
      });

      // Refresh appointments list
      fetchAppointments();

      // Optional: Show success message (you might want to use a toast or modal)
      alert(successMessage);
    } catch (error) {
      console.error('Error creating appointment:', error);
      
      // Detailed error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setSubmitError(
          error.response.data.message || 
          error.response.data.errors?.join(', ') || 
          'Failed to create appointment'
        );
      } else if (error.request) {
        // The request was made but no response was received
        setSubmitError('No response received from server');
      } else {
        // Something happened in setting up the request that triggered an Error
        setSubmitError('Error setting up the request');
      }
    } finally {
      // Always stop loading, regardless of success or failure
      setIsLoading(false);
    }
  };

  // Fetch single appointment details
  const fetchAppointmentDetails = async (appointmentId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axiosInstance.get(`/appointments/${appointmentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Log or handle appointment details
      console.log('Appointment Details:', response.data);
      alert(`Viewing details for appointment ${appointmentId}`);
    } catch (error) {
      console.error('Error fetching appointment details:', error);
      alert('Failed to fetch appointment details');
    }
  };

  // Delete appointment
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

      // Refresh appointments after deletion
      fetchAppointments();
      alert('Appointment deleted successfully');
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert('Failed to delete appointment');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Create Appointment</h2>
      
      {/* Appointment Creation Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Display submission error if exists */}
        {submitError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{submitError}</span>
          </div>
        )}

        <div>
          <label className="block mb-2">Location</label>
          <input
            type="text"
            name="Location"
            value={formData.Location}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded ${errors.Location ? 'border-red-500' : ''}`}
          />
          {errors.Location && <p className="text-red-500 text-sm mt-1">{errors.Location}</p>}
        </div>

        <div>
          <label className="block mb-2">Date</label>
          <input
            type="date"
            name="Date"
            value={formData.Date}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded ${errors.Date ? 'border-red-500' : ''}`}
          />
          {errors.Date && <p className="text-red-500 text-sm mt-1">{errors.Date}</p>}
        </div>

        <div>
          <label className="block mb-2">Time</label>
          <input
            type="time"
            name="Time"
            value={formData.Time}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded ${errors.Time ? 'border-red-500' : ''}`}
          />
          {errors.Time && <p className="text-red-500 text-sm mt-1">{errors.Time}</p>}
        </div>

        <div>
          <label className="block mb-2">Doctor</label>
          <input
            type="text"
            name="doctor"
            value={formData.doctor}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded ${errors.doctor ? 'border-red-500' : ''}`}
          />
          {errors.doctor && <p className="text-red-500 text-sm mt-1">{errors.doctor}</p>}
        </div>

        <div>
          <label className="block mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded ${errors.description ? 'border-red-500' : ''}`}
            rows={3}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className={`w-full p-2 rounded ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isLoading ? 'Creating...' : 'Create Appointment'}
        </button>
      </form>

      {/* Appointments List */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Your Appointments</h3>
        
        {/* Error handling for fetching appointments */}
        {fetchError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{fetchError}</span>
          </div>
        )}

        {/* Loading state */}
        {isLoading ? (
          <p className="text-center">Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <p>No appointments found</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div 
                key={appointment.id || Math.random()} 
                className="border p-4 rounded flex justify-between items-center"
              >
                <div>
                  <p><strong>Location:</strong> {appointment.Location || 'N/A'}</p>
                  <p><strong>Date:</strong> {appointment.Date || 'N/A'}</p>
                  <p><strong>Time:</strong> {appointment.Time || 'N/A'}</p>
                  <p><strong>Doctor:</strong> {appointment.doctor || 'N/A'}</p>
                  <p><strong>Description:</strong> {appointment.description || 'N/A'}</p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => fetchAppointmentDetails(appointment.id)}
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => handleDelete(appointment.id)}
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentPlacement;