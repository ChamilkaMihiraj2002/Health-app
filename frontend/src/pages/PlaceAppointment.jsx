import React, { useEffect, useState } from 'react';
import { axiosInstance, apiRoutes } from '../axiosInstance';

const PlaceAppointment = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axiosInstance({
          method: apiRoutes.fetchAppointments.method,
          url: apiRoutes.fetchAppointments.url,
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        // Check if response.data is an array or an object containing the array
        if (Array.isArray(response.data)) {
          setAppointments(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          setAppointments(response.data.data);
        } else {
          console.error('Unexpected response format:', response.data);
          setAppointments([]);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setAppointments([]); // Fallback to an empty array in case of error
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div>
      <h1>Your Appointments</h1>
      {Array.isArray(appointments) && appointments.length > 0 ? (
        appointments.map((appointment) => (
          <div key={appointment.id}>
            <h2>{appointment.title}</h2>
            <p>{appointment.details}</p>
          </div>
        ))
      ) : (
        <p>No appointments available.</p>
      )}
    </div>
  );
};

export default PlaceAppointment;
