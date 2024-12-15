import axios from 'axios';

const apiRoutes = {
  login: { method: 'post', url: '/login' },
  register: { method: 'post', url: '/register' },
  fetchAppointments: { method: 'get', url: '/appointments' },
  fetchUsers: { method: 'get', url: '/admin/users' },
  updateUser: { method: 'put', url: '/admin/users/:id' },
  delete: { method: 'delete', url: '/admin/users/:id' },
};

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export { axiosInstance, apiRoutes };