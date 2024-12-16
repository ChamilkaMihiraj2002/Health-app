# Online Medical Appointment System

## Academic Module
**Course Code:** IN22-S3-IN2120 - Web Programming  
**Semester:** L2S1

## Project Overview
This web application is a comprehensive medical appointment booking system designed to streamline the process of scheduling medical consultations. The platform provides an intuitive interface for patients to browse doctors, view their specialties, and book appointments seamlessly.

## Features

### Frontend (React)
- Doctor Listing Page
  - Responsive card-based doctor display
  - Detailed doctor information
  - Appointment booking modal

- Authentication System
  - User registration
  - User login
  - Role-based access control

- Appointment Management
  - Book appointments
  - View existing appointments
  - Cancel or reschedule appointments
    
- Admin
  - View Users and count
  - View Appointmants and count
  - View Doctors and count
  - Delete Users, Appointmants and, Doctors. 

### Backend (Laravel)
- RESTful API endpoints
- User authentication
- Doctor and appointment management
- Data validation and security

## Tech Stack

### Frontend
- React.js
- React Bootstrap
- Axios for API communication
- React Router for navigation

### Backend
- Laravel
- MySQL Database
- Laravel Sanctum for authentication
- RESTful API

## Project Structure

```
medical-appointment-app/
│
├── frontend/                # React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │ 
│   └── package.json
│
├── backend/                 # Laravel Backend
│   ├── app/
│   ├── database/
│   ├── routes/
│   └── composer.json
│
└── README.md
```

## Setup and Installation

### Prerequisites
- Node.js (v15+)
- npm or yarn
- PHP (v11.0+)
- Composer
- MySQL

### Frontend Setup
1. Clone the repository
```bash
git clone https://github.com/ChamilkaMihiraj2002/Health-app.git
cd medical-appointment-app/frontend
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm start
```

### Backend Setup
1. Navigate to backend directory
```bash
cd ../backend
```

2. Install dependencies
```bash
composer install
```

3. Configure environment
```bash
cp .env.example .env
php artisan key:generate
```

4. Setup database
```bash
php artisan migrate
php artisan db:hospital_DB
```

5. Run backend server
```bash
php artisan serve
```

## API Endpoints

### Authentication
- `POST /api/register` - User Registration
- `POST /api/login` - User Login
- `POST /api/logout` - User Logout
- `GET /api/profile` - Get User Profile
-  `POST /api/update` - Update User Details
-  `DELETE /api/users/{id}` - Delete User

### Doctors
- `GET /api/doctors` - List all doctors
- `GET /api/doctors/{id}` - Get specific doctor details
- `DELETE /api/doctors/{id}` - Delete specific doctor

### Appointments
- `GET /api/appointments` - List user's appointments
- `GET /api/appointments/{id}` - Get specific user's appointments
- `POST /api/appointments` - Create a new appointment
- `PUT /api/appointments/{id}` - Update appointment
- `DELETE /api/appointments/{id}` - Cancel appointment

![Screenshot 2024-12-17 001110](https://github.com/user-attachments/assets/18a484ac-de70-45b4-962f-34cfb2f99d79)

## Environment Variables
Create `.env` files for both frontend and backend with the necessary configurations:

### Frontend `.env`
```
REACT_APP_API_URL=http://localhost:8000/api
```

### Backend `.env`
```
APP_NAME=Laravel
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hospital_DB
DB_USERNAME=root
DB_PASSWORD=
```

## Authentication Flow
1. User registers or logs in
2. Backend generates an authentication token
3. Token stored in frontend for subsequent API requests
4. Protected routes require valid authentication

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
Distributed under the MIT License. See `LICENSE` for more information.

## Contact
Chamilka Mihiraj Perera - chamilkaperera5@gmail.com

Project Link: [https://github.com/ChamilkaMihiraj2002/Health-app](https://github.com/ChamilkaMihiraj2002/Health-app)

## Acknowledgments
- React.js
- Laravel Framework
- Bootstrap
- MySQL
- Axios
- Academic Supervision

---

**Developed as part of IN22-S3-IN2120 - Web Programming Module**
